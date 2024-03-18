import { OrderCustomer } from "./OrderCustomer";
import { Item } from "@/data/Item";
import { textContains, trimId, trimText } from "@/U";

export enum OrderStatus {
  Pending = 0,
  Completed = 1,
}

export interface OrderData {
  _id?: string;
  customer_name?: string;
  phone_number?: string;
  content?: string;
  createdAt?: string;
  status?: number;
}

export class Order implements Item {
  id: string = "";
  customer?: OrderCustomer;
  content: string;
  createdAt?: string;
  status: OrderStatus = OrderStatus.Pending;

  constructor(data: OrderData) {
    this.id = trimId(data._id);
    this.customer = new OrderCustomer({
      name: trimText(data.customer_name),
      phoneNumber: trimText(data.phone_number),
    });
    this.content = trimText(data.content);
    this.createdAt = data.createdAt;
    this.status =
      data.status !== OrderStatus.Completed
        ? OrderStatus.Pending
        : OrderStatus.Completed;
  }
  toData(): OrderData {
    const customer = this.customer?.toData();
    return {
      _id: this.id,
      content: this.content,
      customer_name: customer?.name,
      phone_number: customer?.phoneNumber,
      createdAt: this.createdAt,
      status: this.status,
    };
  }
  toCount(strs: string[]): number {
    let count = strs.reduce((count, str) => {
      if (textContains("order", str)) count++;
      if (textContains(this.content, str)) count++;
      if (textContains(String(this.status), str)) count++;
      return count;
    }, 0);
    if (this.customer) count += this.customer.toCount(strs);

    return count;
  }

  compare(item: Order): number {
    return 0;
  }

  getUnique(): string {
    return this.id;
  }
}
