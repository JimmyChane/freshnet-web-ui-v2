import { optArray, textContains, trimId, trimText } from "@/U";
import { CustomerDeviceSpecification } from "./CustomerDeviceSpecification";
import { Category } from "../category/Category";
import { Customer } from "./Customer";
import { Item } from "@/data/Item";
import { useCustomerStore } from "@/data-stores/customer.store";
import { useCategoryStore } from "@/data-stores/category.store";

interface CustomerDeviceData {
  _id: string;
  ownerCustomerId: string;
  description: string;
  categoryKey: string;
  specifications: any[];
}

export class CustomerDevice implements Item {
  id: string = "";
  ownerCustomerId: string = "";
  description: string = "";
  categoryKey: string = "";
  specifications: CustomerDeviceSpecification[] = [];

  fromData(data: CustomerDeviceData): this {
    this.id = trimId(data._id);
    this.ownerCustomerId = trimId(data.ownerCustomerId);
    this.description = trimText(data.description);
    this.categoryKey = trimId(data.categoryKey);
    this.specifications = optArray(data.specifications)
      .map((specification) => {
        return new CustomerDeviceSpecification().fromData(specification);
      })
      .filter((specification) => {
        return specification.typeKey && specification.content;
      });

    return this;
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
    const customers: Customer[] = await useCustomerStore().getItems();
    return customers.find((customer) => customer.id === this.ownerCustomerId);
  }

  async fetchCategory(): Promise<Category | undefined> {
    const categories: Category[] = await useCategoryStore().getItems();
    return categories.find((category) => category.key === this.categoryKey);
  }

  getUnique(): string {
    return this.id;
  }
}
