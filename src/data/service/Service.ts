import { ServiceTimestamp } from "./ServiceTimestamp";
import { ServiceEvent } from "./ServiceEvent";
import { ServicePrice } from "./ServicePrice";
import { ServiceCustomer, type ServiceCustomerData } from "./ServiceCustomer";
import { ServiceImage } from "./ServiceImage";
import { Label, type LabelData } from "./ServiceLabel";
import { ServiceEventMethod } from "./ServiceEventMethod";
import { ServiceState } from "./ServiceState";
import {
  ServiceBelonging,
  type ServiceBelongingData,
} from "./ServiceBelonging";
import { User } from "../user/User";
import { Item } from "@/data/Item";
import { useUserStore } from "@/data-stores/user.store";
import { optArray, optBoolean, textContains, trimId, trimText } from "@/U";

export interface ServiceData {
  _id?: string;
  time?: number;
  username?: string;
  nameOfUser?: string;
  state?: string;
  imageFiles?: any[];
  events?: any[];
  customer?: ServiceCustomerData;
  description?: string;
  belongings?: ServiceBelongingData[];
  labels?: LabelData[];
  notice?: {
    isUrgent?: boolean;
    isWarranty?: boolean;
  };
}

export class Service extends Item {
  id: string = "";
  timestamp: ServiceTimestamp | null = null;
  username: string = "";
  name: string = "";
  state: string = "";
  customer?: ServiceCustomer;
  description: string = "";
  belongings: ServiceBelonging[] = [];
  private _events: ServiceEvent[] = [];
  imageFiles: ServiceImage[] = [];
  labels: Label[] = [];

  fromData(data: ServiceData): Service {
    this.id = trimId(data._id);
    this.timestamp =
      typeof data.time === "number" ? new ServiceTimestamp(data.time) : null;
    this.username = trimId(data.username);
    this.name = trimText(data.nameOfUser);

    switch (trimId(data.state)) {
      case ServiceState.PENDING.key:
        this.state = ServiceState.PENDING.key;
        break;
      case ServiceState.WAITING.key:
        this.state = ServiceState.WAITING.key;
        break;
      case ServiceState.COMPLETED.key:
        this.state = ServiceState.COMPLETED.key;
        break;
      case ServiceState.REJECTED.key:
        this.state = ServiceState.REJECTED.key;
        break;
      default:
        this.state = ServiceState.PENDING.key;
    }

    if (typeof data.customer === "object")
      this.customer = new ServiceCustomer().fromData(data.customer);
    this.description = trimText(data.description);
    this.belongings = optArray(data.belongings).map((belonging) => {
      return new ServiceBelonging().fromData(belonging);
    });

    this._events = optArray(data.events).map((subData) => {
      return new ServiceEvent().fromData(subData);
    });

    // images
    this.imageFiles = optArray(data.imageFiles).map((image) => {
      return new ServiceImage().fromData(image);
    });

    // labels
    this.labels = optArray(data.labels)
      .map((subData) => new Label().fromData(subData))
      .filter((label) => label.title.trim().length > 0);

    // refactoring notice to labels
    const existingLabelUrgent = this.labels.find((label) => {
      return label.title === Label.URGENT.title;
    });
    const existingLabelWarranty = this.labels.find((label) => {
      return label.title === Label.WARRANTY.title;
    });
    const notice = {
      isUrgent: !!data.notice?.isUrgent ?? false,
      isWarranty: !!data.notice?.isWarranty ?? false,
    };
    if (notice.isUrgent && !existingLabelUrgent) {
      this.labels.push(Label.URGENT);
    }
    if (notice.isWarranty && !existingLabelWarranty) {
      this.labels.push(Label.WARRANTY);
    }

    return this;
  }
  toData(): ServiceData {
    return {
      _id: trimId(this.id),
      time: this.timestamp?.time ?? undefined,
      username: trimId(this.username),
      nameOfUser: trimText(this.name),
      state: this.state,
      customer: this.customer?.toData(),
      description: trimText(this.description),
      belongings: this.belongings.map((belonging) => belonging.toData()),
      events: this._events.map((event) => event.toData()),
      imageFiles: this.imageFiles.map((image) => image.toData()),
      labels: this.labels.map((label) => label.toData()),
    };
  }
  toCount(strs: string[]): number {
    const { customer, timestamp, state: stateKey, description } = this;

    const state = ServiceState.findByKey(stateKey);
    const stateTitle = state?.title ?? "";

    const ts = [
      "service",
      description,
      stateTitle,
      ...this.labels.map((label) => label.title),
    ];
    let count =
      strs.reduce((count, str) => {
        for (const t of ts) if (textContains(t, str)) count++;
        return count;
      }, 0) +
      this._events.reduce((count, event) => count + event.toCount(strs), 0);
    if (timestamp?.toCount(strs)) count++;
    if (customer?.toCount(strs)) count += 5;

    return count;
  }
  get events(): ServiceEvent[] {
    const serviceData = this.toData();

    const serviceEvent = new ServiceEvent().fromData({
      method: ServiceEventMethod.INITIAL.key,
      time: serviceData.time,
      username: serviceData.username,
      nameOfUser: serviceData.nameOfUser,
      description: serviceData.description,
      images: serviceData.imageFiles,
    });

    return [serviceEvent, ...this._events].sort((event1, event2) => {
      return event1.compare(event2);
    });
  }
  set events(events: ServiceEvent[]) {
    this._events = events.filter((event) => {
      return event.timestamp?.time !== this.timestamp?.time;
    });
  }

  getUnique(): string {
    return this.id;
  }

  isUrgent(): boolean {
    return !!this.labels.find((label) => label.isEqual(Label.URGENT));
  }
  isWarranty(): boolean {
    return !!this.labels.find((label) => {
      return label.isEqual(Label.WARRANTY);
    });
  }

  compare(item: Service): number {
    let value = 0;
    if (value === 0) value = this.compareState(item);
    if (value === 0) value = this.compareTimestamp(item);
    return value;
  }
  compareState(item: Service): number {
    return (
      ServiceState.indexOfKey(this.state) - ServiceState.indexOfKey(item.state)
    );
  }
  compareTimestamp(item: Service): number {
    if (this.timestamp && item.timestamp)
      return this.timestamp.compare(item.timestamp);
    if (this.timestamp || !item.timestamp) return -1;
    if (!this.timestamp || item.timestamp) return 1;

    return 0;
  }
  compareCustomer(item: Service): number {
    if (this.customer && item.customer)
      return this.customer.compare(item.customer);
    if (this.customer || !item.customer) return -1;
    if (!this.customer || item.customer) return 1;

    return 0;
  }
  compareTotalPrice(item: Service): number {
    const totalPrice1 = this.toTotalPrice();
    const totalPrice2 = item.toTotalPrice();
    return totalPrice1.compare(totalPrice2);
  }

  async fetchUser(): Promise<User | undefined> {
    if (
      typeof this.username !== "string" ||
      this.username.trim().length === 0
    ) {
      return;
    }
    return await useUserStore().getUserByUsername(this.username);
  }
  async fetchName(): Promise<string> {
    const user = await this.fetchUser();
    const username = user?.username ?? "";

    if (username.length && this.name) return `${this.name}(${username})`;
    if (!username.length && this.name) return this.name;
    if (username.length && !this.name) return username;

    throw new Error("unknown");
  }

  toTotalPrice(): ServicePrice {
    return this._events.reduce(
      (cost, event) => {
        if (event.price && event.method === ServiceEventMethod.PURCHASE.key) {
          cost = cost.plus(event.price);
        }
        return cost;
      },
      new ServicePrice().fromData({ amount: 0 }),
    );
  }

  setLabels(labels: Label[] = []) {
    this.labels = optArray(labels)
      .map((label: Label) => new Label().fromData(label.toData()))
      .filter((label) => label.title.trim().length > 0);
  }
  addLabel(label: Label) {
    const labels = this.labels;
    const existingLabel = labels.find((l) => l.isEqual(label));

    if (!existingLabel) {
      this.setLabels([...labels, label]);
    }
  }
  removeLabel(label: Label) {
    const labels = this.labels;
    const existingLabel = labels.find((l) => l.isEqual(label));

    if (existingLabel) {
      this.setLabels(labels.filter((l) => !l.isEqual(label)));
    }
  }

  setUrgent(bool: boolean = false) {
    optBoolean(bool)
      ? this.addLabel(Label.URGENT)
      : this.removeLabel(Label.URGENT);
  }
  setWarranty(bool: boolean = false) {
    optBoolean(bool)
      ? this.addLabel(Label.WARRANTY)
      : this.removeLabel(Label.WARRANTY);
  }
}
