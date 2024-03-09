import { optNumber, trimText } from "@/U";

export interface ServiceBelongingData {
  title?: string;
  time?: number;
  quantity?: number;
  description?: string;
}

export class ServiceBelonging {
  title: string = "";
  time: number = 0;
  quantity: number = 1;
  description: string = "";

  fromData(data: ServiceBelongingData) {
    this.title = trimText(data.title);
    this.time = optNumber(data.time);
    this.quantity = Math.max(optNumber(data.quantity), 1);
    this.description = trimText(data.description);
    return this;
  }
  toData(): ServiceBelongingData {
    return {
      title: trimText(this.title),
      time: this.time,
      quantity: Math.max(optNumber(this.quantity), 1),
      description: trimText(this.description),
    };
  }
}
