import { ServiceTimestamp } from './ServiceTimestamp';
import { ServicePrice, type ServicePriceData } from './ServicePrice';
import { ServiceImage, type ServiceImageData } from './ServiceImage';
import { INFO, PURCHASE, QUOTATION } from './ServiceEventMethod';
import { User } from '@/data/User';
import { useUserStore } from '@/data-stores/user.store';
import { optArray, textContains, trimId, trimText } from '@/utils/U';

export interface ServiceEventData {
  time?: number;
  username?: string;
  nameOfUser?: string;
  method?: string;
  description?: string;
  status?: string;
  price?: ServicePriceData;
  images?: ServiceImageData[];
}

export class ServiceEvent {
  timestamp?: ServiceTimestamp;
  username: string;
  name: string;
  method: string;
  description: string;
  status: string;
  price?: ServicePrice;
  images: ServiceImage[];

  constructor(data: ServiceEventData) {
    this.timestamp = new ServiceTimestamp(data.time);
    this.username = trimId(data.username);
    this.name = trimText(data.nameOfUser);
    this.method = trimId(data.method);
    this.description = trimText(data.description);
    this.status = trimId(data.status);
    if (typeof data.price === 'object') this.price = new ServicePrice(data.price);
    this.images = optArray(data.images).map((image) => {
      return new ServiceImage(image);
    });
  }

  toData(): ServiceEventData {
    return {
      time: this.timestamp?.time ?? undefined,
      username: trimId(this.username),
      nameOfUser: trimText(this.name),
      method: trimId(this.method),
      description: trimText(this.description),
      status: trimId(this.status),
      price: this.price?.toData() ?? undefined,
      images: this.images.map((image) => image.toData()),
    };
  }

  toCount(strs: string[]) {
    let count = strs.reduce((count, str) => {
      if (textContains('event', str)) count++;
      if (textContains(this.username, str)) count++;
      if (textContains(this.name, str)) count++;
      if (textContains(this.method, str)) count++;
      if (textContains(this.description, str)) count++;
      if (textContains(this.status, str)) count++;
      return count;
    }, 0);

    count += this.timestamp ? this.timestamp.toCount(strs) : 0;

    return count;
  }

  toResult() {
    if (this.isQuotation() || this.isPurchase()) return this.price;
    if (this.isInfo()) return this.status;
    return null;
  }

  isInfo() {
    return this.method === INFO.key;
  }

  isQuotation() {
    return this.method === QUOTATION.key;
  }

  isPurchase() {
    return this.method === PURCHASE.key;
  }

  compare(item: ServiceEvent) {
    return (item.timestamp?.time ?? 0) - (this.timestamp?.time ?? 0);
  }

  async fetchUser(): Promise<User | undefined> {
    if (typeof this.username !== 'string' || this.username.trim().length === 0) return;
    return await useUserStore().getUserByUsername(this.username);
  }

  async fetchName(): Promise<string> {
    const user = await this.fetchUser();
    const username = user ? user.username : '';

    if (username.length && this.name) return `${this.name}(${username})`;
    if (!username.length && this.name) return this.name;
    if (username.length && !this.name) return username;

    throw new Error('unknown');
  }
}
