import { optNumber, trimText } from '@/utils/U';

export interface ServiceBelongingData {
  title?: string;
  time?: number;
  quantity?: number;
  description?: string;
}

export class ServiceBelonging {
  title: string;
  time: number;
  quantity: number;
  description: string;

  constructor(data?: ServiceBelongingData) {
    this.title = trimText(data?.title);
    this.time = optNumber(data?.time);
    this.quantity = Math.max(optNumber(data?.quantity), 1);
    this.description = trimText(data?.description);
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
