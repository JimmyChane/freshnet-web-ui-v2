import { trimText } from "@/U";

export interface ProductBundleData {
  title?: string;
}

export class ProductBundle {
  title: string = "";

  fromData(data: ProductBundleData): ProductBundle {
    this.title = trimText(data.title || "");
    return this;
  }
  toData(): ProductBundleData {
    return { title: trimText(this.title) };
  }
  toCount(strs: string[]): number {
    return 0;
  }

  isEqual(item: ProductBundle): boolean {
    return this === item;
  }

  compare(item: ProductBundle): number {
    return 0;
  }
}
