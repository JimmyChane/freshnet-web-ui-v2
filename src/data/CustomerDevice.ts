import { optArray, textContains, trimId, trimText } from '@/utils/U';
import { CustomerDeviceSpecification } from './CustomerDeviceSpecification';
import { Category } from '@/data/Category';
import { Customer } from './Customer';
import { Item } from '@/data/Item';
import { useCustomerStore } from '@/data-stores/customer.store';
import { useCategoryStore } from '@/data-stores/category.store';
import { serverRequest } from '@/data/Server';

export interface CustomerDeviceData {
  _id: string;
  ownerCustomerId: string;
  description: string;
  categoryKey: string;
  specifications: any[];
}

export class CustomerDevice implements Item {
  id: string = '';
  ownerCustomerId: string = '';
  description: string = '';
  categoryKey: string = '';
  specifications: CustomerDeviceSpecification[] = [];

  constructor(data: CustomerDeviceData) {
    this.id = trimId(data._id);
    this.ownerCustomerId = trimId(data.ownerCustomerId);
    this.description = trimText(data.description);
    this.categoryKey = trimId(data.categoryKey);
    this.specifications = optArray(data.specifications)
      .map((specification) => {
        return new CustomerDeviceSpecification(specification);
      })
      .filter((specification) => {
        return specification.typeKey && specification.content;
      });
  }

  toData(): CustomerDeviceData {
    return {
      _id: trimId(this.id),
      ownerCustomerId: trimId(this.ownerCustomerId),
      description: trimId(this.description),
      categoryKey: trimId(this.categoryKey),
      specifications: this.specifications.map((specification) => {
        return specification.toData();
      }),
    };
  }

  toCount(strs: string[]): number {
    const count = strs.reduce((count, str) => {
      if (textContains(this.ownerCustomerId, str)) count++;
      if (textContains(this.description, str)) count++;
      if (textContains(this.categoryKey, str)) count++;
      count += this.specifications.reduce((count, specification) => {
        return count + specification.toCount(strs);
      }, 0);
      return count;
    }, 0);

    return count;
  }

  compare(item: CustomerDevice): number {
    return 0;
  }

  async fetchCustomer(): Promise<Customer | undefined> {
    const customers = await useCustomerStore().getItems();
    return customers.find((customer) => customer.id === this.ownerCustomerId);
  }

  async fetchCategory(): Promise<Category | undefined> {
    const categories = await useCategoryStore().getItems();
    return categories.find((category) => category.key === this.categoryKey);
  }

  getUnique(): string {
    return this.id;
  }
}

export class DeviceRequest {
  static list(): Promise<any> {
    return serverRequest().path('customer/device/list').sendJson();
  }
  static add(body: any): Promise<any> {
    return serverRequest().POST().path('customer/device/add').bodyJson(body).sendJson();
  }
  static remove(body: any): Promise<any> {
    return serverRequest().DELETE().path('customer/device/remove').bodyJson(body).sendJson();
  }
  static updateSpecification(body: any): Promise<any> {
    return serverRequest()
      .PUT()
      .path('customer/device/update/specifications')
      .bodyJson(body)
      .sendJson();
  }
  static updateDescription(body: any): Promise<any> {
    return serverRequest()
      .PUT()
      .path('customer/device/update/description')
      .bodyJson(body)
      .sendJson();
  }
}
