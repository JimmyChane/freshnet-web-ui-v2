import { optArray, optBoolean } from '@/utils/U';
import { ProductPrices, type ProductPricesData } from './ProductPrices';

export interface ProductStockData {
  isAvailable?: boolean;
  isSecondHand?: boolean;
  prices?: ProductPricesData[];
}

export class ProductStock {
  isAvailable: boolean = true;
  isSecondHand: boolean = false;
  prices: any[] = [];

  constructor(data?: ProductStockData) {
    this.isAvailable = optBoolean(data?.isAvailable, true);
    this.isSecondHand = optBoolean(data?.isSecondHand, false);

    // deprecated on 2022_04_09
    this.prices = optArray(data?.prices)
      .map((price) => new ProductPrices(price))
      .map((price) => price.toData())
      .filter((price) => price && Object.keys(price).length);
  }
  toData(): ProductStockData {
    return {
      isAvailable: optBoolean(this.isAvailable),
      isSecondHand: optBoolean(this.isSecondHand),
      prices: this.prices.map((price) => new ProductPrices(price)).map((price) => price.toData()),
    };
  }
  toCount(strs: string[]): number {
    return 0;
  }

  isEqual(item: ProductStock): boolean {
    return this === item;
  }

  compare(item: ProductStock): number {
    return 0;
  }
}
