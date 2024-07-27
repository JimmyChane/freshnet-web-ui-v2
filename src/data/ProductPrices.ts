import { ProductPrice, fromString } from './ProductPrice';

export interface ProductPricesData {
  normal?: string;
  promotion?: string;
}

export class ProductPrices {
  normal: ProductPrice | null = null;
  promotion: ProductPrice | null = null;

  constructor(data: ProductPricesData) {
    this.normal = fromString(data.normal || '');
    this.promotion = fromString(data.promotion || '');
  }
  toData(): ProductPricesData {
    return {
      normal: this.normal?.toString() ?? '',
      promotion: this.promotion?.toString() ?? '',
    };
  }
  toCount(strs: string[]): number {
    return 0;
  }

  isEqual(item: ProductPrices): boolean {
    return this === item;
  }

  compare(item: ProductPrices): number {
    return 0;
  }
}
