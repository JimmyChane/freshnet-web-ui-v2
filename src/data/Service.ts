import { ServiceTimestamp } from './ServiceTimestamp';
import { ServiceEvent } from './ServiceEvent';
import { ServicePrice } from './ServicePrice';
import { ServiceCustomer, type ServiceCustomerData } from './ServiceCustomer';
import { ServiceImage } from './ServiceImage';
import { Label, URGENT, type LabelData, WARRANTY } from './ServiceLabel';
import { INITIAL, PURCHASE } from './ServiceEventMethod';
import {
  COMPLETED,
  PENDING,
  REJECTED,
  ServiceStateId,
  WAITING,
  findByKey,
  indexOfKey,
} from './ServiceState';
import { ServiceBelonging, type ServiceBelongingData } from './ServiceBelonging';
import { User } from '@/data/User';
import { Item } from '@/data/Item';
import { useUserStore } from '@/data-stores/user.store';
import { optArray, optBoolean, textContains, trimId, trimText } from '@/utils/U';
import { serverRequest } from '@/data/Server';

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
  id: string;
  timestamp?: ServiceTimestamp;
  username: string;
  name: string;
  state: ServiceStateId;
  customer?: ServiceCustomer;
  description: string;
  belongings: ServiceBelonging[];
  private _events: ServiceEvent[];
  imageFiles: ServiceImage[];
  labels: Label[];

  constructor(data: ServiceData) {
    super();

    this.id = trimId(data._id);
    if (typeof data.time === 'number') this.timestamp = new ServiceTimestamp(data.time);
    this.username = trimId(data.username);
    this.name = trimText(data.nameOfUser);

    switch (trimId(data.state)) {
      case PENDING.key:
        this.state = PENDING.key;
        break;
      case WAITING.key:
        this.state = WAITING.key;
        break;
      case COMPLETED.key:
        this.state = COMPLETED.key;
        break;
      case REJECTED.key:
        this.state = REJECTED.key;
        break;
      default:
        this.state = PENDING.key;
    }

    if (typeof data.customer === 'object') this.customer = new ServiceCustomer(data.customer);
    this.description = trimText(data.description);
    this.belongings = optArray(data.belongings).map((belonging) => {
      return new ServiceBelonging(belonging);
    });

    this._events = optArray(data.events).map((subData) => {
      return new ServiceEvent(subData);
    });

    // images
    this.imageFiles = optArray(data.imageFiles).map((image) => {
      return new ServiceImage(image);
    });

    // labels
    this.labels = optArray(data.labels)
      .map((subData) => new Label(subData))
      .filter((label) => label.title.trim().length > 0);

    // refactoring notice to labels
    const existingLabelUrgent = this.labels.find((label) => {
      return label.title === URGENT.title;
    });
    const existingLabelWarranty = this.labels.find((label) => {
      return label.title === WARRANTY.title;
    });
    const notice = {
      isUrgent: !!data.notice?.isUrgent ?? false,
      isWarranty: !!data.notice?.isWarranty ?? false,
    };
    if (notice.isUrgent && !existingLabelUrgent) {
      this.labels.push(URGENT);
    }
    if (notice.isWarranty && !existingLabelWarranty) {
      this.labels.push(WARRANTY);
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

    const state = findByKey(stateKey);
    const stateTitle = state?.title ?? '';

    const ts = ['service', description, stateTitle, ...this.labels.map((label) => label.title)];
    let count =
      strs.reduce((count, str) => {
        for (const t of ts) if (textContains(t, str)) count++;
        return count;
      }, 0) + this._events.reduce((count, event) => count + event.toCount(strs), 0);
    if (timestamp?.toCount(strs)) count++;
    if (customer?.toCount(strs)) count += 5;

    return count;
  }
  get events(): ServiceEvent[] {
    const serviceData = this.toData();

    const serviceEvent = new ServiceEvent({
      method: INITIAL.key,
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
    return !!this.labels.find((label) => label.isEqual(URGENT));
  }
  isWarranty(): boolean {
    return !!this.labels.find((label) => {
      return label.isEqual(WARRANTY);
    });
  }

  compare(item: Service): number {
    let value = 0;
    if (value === 0) value = this.compareState(item);
    if (value === 0) value = this.compareTimestamp(item);
    return value;
  }
  compareState(item: Service): number {
    return indexOfKey(this.state) - indexOfKey(item.state);
  }
  compareTimestamp(item: Service): number {
    if (this.timestamp && item.timestamp) return this.timestamp.compare(item.timestamp);
    if (this.timestamp || !item.timestamp) return -1;
    if (!this.timestamp || item.timestamp) return 1;

    return 0;
  }
  compareCustomer(item: Service): number {
    if (this.customer && item.customer) return this.customer.compare(item.customer);
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
    if (typeof this.username !== 'string' || this.username.trim().length === 0) {
      return;
    }
    return await useUserStore().getUserByUsername(this.username);
  }
  async fetchName(): Promise<string> {
    const user = await this.fetchUser();
    const username = user?.username ?? '';

    if (username.length && this.name) return `${this.name}(${username})`;
    if (!username.length && this.name) return this.name;
    if (username.length && !this.name) return username;

    throw new Error('unknown');
  }

  toTotalPrice(): ServicePrice {
    return this._events.reduce(
      (cost, event) => {
        if (event.price && event.method === PURCHASE.key) {
          cost = cost.plus(event.price);
        }
        return cost;
      },
      new ServicePrice({ amount: 0 }),
    );
  }

  setLabels(labels: Label[] = []) {
    this.labels = optArray(labels)
      .map((label: Label) => new Label(label.toData()))
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
    optBoolean(bool) ? this.addLabel(URGENT) : this.removeLabel(URGENT);
  }
  setWarranty(bool: boolean = false) {
    optBoolean(bool) ? this.addLabel(WARRANTY) : this.removeLabel(WARRANTY);
  }
}

export class ServiceRequest {
  static list(): Promise<any> {
    return serverRequest().path('service_v2/get/items').sendJson();
  }
  static import(service: any): Promise<any> {
    return serverRequest()
      .POST()
      .path('service_v2/import/item/')
      .bodyJson({ content: service })
      .sendJson();
  }
  static add(service: any): Promise<any> {
    return serverRequest()
      .POST()
      .path('service_v2/add/item/')
      .bodyJson({ content: service })
      .sendJson();
  }
  static remove(id: string): Promise<any> {
    return serverRequest().DELETE().path(`service_v2/delete/item/${id}`).sendJson();
  }
  static updateState(id: string, state: string): Promise<any> {
    return serverRequest()
      .PUT()
      .path(`service_v2/item/${id}/update/state/`)
      .bodyJson({ content: state })
      .sendJson();
  }
  static updateDescription(id: string, description: string): Promise<any> {
    return serverRequest()
      .PUT()
      .path(`service_v2/item/${id}/update/description/`)
      .bodyJson({ content: description })
      .sendJson();
  }
  static updateBelongings(id: string, belongings: any[]): Promise<any> {
    return serverRequest()
      .PUT()
      .path(`service_v2/item/${id}/update/belonging/`)
      .bodyJson({ content: belongings })
      .sendJson();
  }
  static updateCustomer(id: string, customer: any): Promise<any> {
    return serverRequest()
      .PUT()
      .path(`service_v2/item/${id}/update/customer/`)
      .bodyJson({ content: customer })
      .sendJson();
  }
  static addEvent(id: string, event: any): Promise<any> {
    return serverRequest()
      .POST()
      .path(`service_v2/item/${id}/add/event/`)
      .bodyJson({ content: event })
      .sendJson();
  }
  static removeEvent(id: string, eventTime: number): Promise<any> {
    return serverRequest()
      .DELETE()
      .path(`service_v2/item/${id}/delete/event/`)
      .bodyJson({ serviceID: id, time: eventTime })
      .sendJson();
  }
  static updateEventDescription(id: string, eventTime: number, description: string): Promise<any> {
    return serverRequest()
      .PUT()
      .path(`service_v2/item/${id}/update/event/description`)
      .bodyJson({ serviceID: id, time: eventTime, description })
      .sendJson();
  }
  static addLabel(id: string, label: any): Promise<any> {
    return serverRequest()
      .POST()
      .path(`service_v2/item/${id}/add/label/`)
      .bodyJson({ label })
      .sendJson();
  }
  static removeLabel(id: string, label: any): Promise<any> {
    return serverRequest()
      .DELETE()
      .path(`service_v2/item/${id}/delete/label/`)
      .bodyJson({ label: label.toData() })
      .sendJson();
  }
  static addImageTemp(imageFormData: any): Promise<any> {
    return serverRequest()
      .POST()
      .path(`service_v2/add/image_files_temp/`)
      .body(imageFormData)
      .send();
  }
  static addImage(id: string, imageForm: any): Promise<any> {
    return serverRequest()
      .POST()
      .path(`service_v2/item/${id}/add/image_files/`)
      .body(imageForm)
      .send();
  }
  static addEventImage(id: string, eventTime: number, imageForm: any): Promise<any> {
    return serverRequest()
      .POST()
      .path(`service_v2/item/${id}/add/event/${eventTime}/image_files/`)
      .body(imageForm)
      .send();
  }
  static removeImage(id: string, image: any): Promise<any> {
    return serverRequest()
      .DELETE()
      .path(`service_v2/item/${id}/delete/image/`)
      .bodyJson({ content: image.toData() })
      .sendJson();
  }
  static removeEventImage(serviceId: string, eventTime: number, image: any) {
    return serverRequest()
      .DELETE()
      .path(`service_v2/item/${serviceId}/delete/event/${eventTime}/image/`)
      .bodyJson({ image: image.toData() })
      .sendJson();
  }
}
