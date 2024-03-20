import { PhoneNumber } from "../PhoneNumber";
import { CustomerDevice } from "./CustomerDevice";
import { Item } from "@/data/Item";
import { useCustomerStore } from "@/data-stores/customer.store";
import { optArray, textContains, trimId, trimText } from "@/U";
import type { Group } from "../Group";
import type { Category } from "../category/Category";

export const Requirement = {
  name: { isRequired: true },
  phoneNumber: { isRequired: false },
  description: { isRequired: false },
  deviceIds: { isRequired: false },
};

export interface CustomerData {
  _id?: string;
  name?: string;
  phoneNumber?: string;
  description?: string;
  deviceIds?: string[];
}

export class Customer implements Item {
  id: string;
  name: string;
  phoneNumber?: PhoneNumber;
  description: string;
  deviceIds: string[];

  cachedServices: any[] = [];
  cachedOrders: any[] = [];

  get services(): any[] {
    return this.cachedServices;
  }

  get orders(): any[] {
    return this.cachedOrders;
  }

  getUnique(): string {
    return this.id;
  }

  constructor(data: CustomerData) {
    this.id = trimId(data._id);
    this.name = trimText(data.name);
    const phoneNumber = trimText(data.phoneNumber);
    if (phoneNumber) this.phoneNumber = new PhoneNumber({ value: phoneNumber });
    this.description = trimText(data.description);
    this.deviceIds = optArray(data.deviceIds)
      .map((deviceId) => trimId(deviceId))
      .filter((deviceId) => !!deviceId);
  }

  toData(): CustomerData {
    return {
      _id: trimId(this.id),
      name: trimText(this.name),
      phoneNumber: this.phoneNumber?.toData().value ?? "",
      description: trimText(this.description),
      deviceIds: this.deviceIds.map((deviceId) => deviceId),
    };
  }

  toCount(strs: string[]): number {
    let count = strs.reduce((count, str) => {
      if (textContains("customer", str)) count++;
      if (textContains(this.name, str)) count++;
      if (textContains(this.phoneNumber?.toString() ?? "", str)) count++;
      if (textContains(this.description, str)) count++;
      return count;
    }, 0);

    return count;
  }

  isFromStoreCustomer(): boolean {
    return !!this.id;
  }

  isModifiable(): boolean {
    return this.isFromStoreCustomer();
  }

  compare(item: Customer): number {
    return 0;
  }

  async fetchDevices(): Promise<(CustomerDevice | undefined)[]> {
    if (!this.deviceIds.length) return [];
    const devices: CustomerDevice[] = await useCustomerStore().getDevices();
    return this.deviceIds.map((deviceId) => {
      return devices.find((device) => device.id === deviceId);
    });
  }

  async fetchDeviceGroups(property: string = ""): Promise<any[]> {
    const devices: (CustomerDevice | undefined)[] = await this.fetchDevices();

    const optGroup = (groups: Record<string, any>[], key: any) => {
      let group = groups.find((group) => group[property] === key);
      if (!group) {
        group = { devices: [] };
        group[property] = key;
        groups.push(group);
      }
      return group;
    };

    return devices.reduce((groups: any[], device: any) => {
      if (!device) return groups;

      const deviceValue = device[property];

      optGroup(groups, deviceValue).devices.push(device);
      return groups;
    }, []);
  }

  async fetchDeviceGroupsByCategoryKey() {
    const devices = await this.fetchDevices();

    const optGroup = (groups: Group<string, CustomerDevice>[], key: any) => {
      let group = groups.find((group) => group.parent === key);
      if (!group) {
        group = { parent: key, items: [] };
        groups.push(group);
      }
      return group;
    };

    return devices.reduce((groups: any[], device: any) => {
      if (!device) return groups;

      const deviceValue = device.categoryKey;

      optGroup(groups, deviceValue).items.push(device);
      return groups;
    }, []);
  }
}
