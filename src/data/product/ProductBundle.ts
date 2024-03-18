import { trimText } from "@/U";

export interface ProductBundleData {
  title?: string;
}

export class ProductBundle {
  title: string = "";

  constructor(data: ProductBundleData) {
    this.title = trimText(data.title || "");
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
