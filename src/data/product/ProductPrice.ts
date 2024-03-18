import { DefaultCurrency, Price, parse } from "@/data/Price";

export const Currency = DefaultCurrency;

export function fromString(str: string): ProductPrice {
  const { currency, amount: value } = parse(str);
  return new ProductPrice({ currency, value });
}

export class ProductPrice {
  private price?: Price;

  constructor(data?: { currency: string; value: number }) {
    this.price = new Price(data?.value ?? 0, data?.currency ?? "");
  }
  toData(): { currency: string; value: number } {
    return {
      currency: this.price?.currency ?? "",
      value: this.price?.amount ?? 0,
    };
  }
  toCount(strs: string[]): number {
    return this.price?.toCount(strs) ?? 0;
  }
  toString(): string {
    return this.price?.toString() ?? "";
  }

  compare(item: ProductPrice): number {
    return this.price?.compare(item.price ?? new Price()) ?? 0;
  }

  plus(value: ProductPrice | number): ProductPrice {
    const price =
      value instanceof ProductPrice
        ? this.price?.plus(value.price) ?? new Price(0, "")
        : this.price?.plus(value) ?? new Price(0, "");
    const data = { value: price.amount, currency: price.currency };
    return new ProductPrice(data);
  }
  minus(value: ProductPrice | number): ProductPrice {
    const price =
      value instanceof ProductPrice
        ? this.price?.minus(value.price) ?? new Price(0, "")
        : this.price?.minus(value) ?? new Price(0, "");
    const data = { value: price.amount, currency: price.currency };
    return new ProductPrice(data);
  }

  get value(): number {
    return this.price?.amount ?? 0;
  }
  get currency(): string {
    return this.price?.currency ?? "";
  }
}
