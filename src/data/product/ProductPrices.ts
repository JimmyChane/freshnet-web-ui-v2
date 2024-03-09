import { ProductPrice } from "./ProductPrice";

export interface ProductPricesData {
  normal?: string;
  promotion?: string;
}

export class ProductPrices {
  normal: ProductPrice | null = null;
  promotion: ProductPrice | null = null;

  fromData(data: ProductPricesData): ProductPrices {
    this.normal = new ProductPrice().fromString(data.normal || "");
    this.promotion = new ProductPrice().fromString(data.promotion || "");
    return this;
  }
  toData(): ProductPricesData {
    return {
      normal: this.normal?.toString() ?? "",
      promotion: this.promotion?.toString() ?? "",
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
