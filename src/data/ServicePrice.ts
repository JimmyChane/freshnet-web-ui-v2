import { Price } from '@/data/Price';

export interface ServicePriceData {
  amount?: number;
  currency?: string;
}

export class ServicePrice {
  private price?: Price;

  get amount(): number {
    return this.price?.amount ?? 0;
  }
  get currency(): string {
    return this.price?.currency ?? 'rm';
  }

  constructor(data: ServicePriceData) {
    this.price = new Price(data.amount, data.currency ?? 'rm');
    return this;
  }
  toData(): ServicePriceData {
    return {
      amount: this.price?.amount ?? 0,
      currency: this.price?.currency ?? 'rm',
    };
  }
  toCount(strs: string[]): number {
    return this.price?.toCount(strs) ?? 0;
  }
  toString(): string {
    return this.price?.toString() ?? '';
  }

  compare(item: ServicePrice): number {
    if (!item.price) return 0;
    return this.price?.compare(item.price) ?? 0;
  }

  plus(value: ServicePrice | number): ServicePrice {
    const price =
      value instanceof ServicePrice ? this.price?.plus(value.price) : this.price?.plus(value);
    const data = {
      amount: price?.amount ?? 0,
      currency: price?.currency ?? 'rm',
    };
    return new ServicePrice(data);
  }
  minus(value: ServicePrice | number): ServicePrice {
    const price =
      value instanceof ServicePrice ? this.price?.minus(value.price) : this.price?.minus(value);
    const data = {
      amount: price?.amount ?? 0,
      currency: price?.currency ?? 'rm',
    };
    return new ServicePrice(data);
  }
}
