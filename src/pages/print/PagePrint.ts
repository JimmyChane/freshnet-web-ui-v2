import { Paper } from "./Paper";
import { Output } from "./Output";
import { Price } from "@/data/Price";

export class Media {
  constructor(readonly title: string, readonly items: Category[]) {}
}
export class Category {
  readonly title: string;
  readonly icon?: string;
  readonly items: Subcategory[];

  constructor(res: Output | Paper | undefined, items: Subcategory[]) {
    this.title = res ? res.toString() : "";

    if (res instanceof Paper) {
      this.icon = res.paperType.icon;
    }
    this.items = items;
  }
}
export class Subcategory {
  readonly title: string;
  readonly icon: string;
  readonly items: Item[];

  constructor(
    res: { toString: () => string; color: { icon: string } } | undefined,
    items: Item[],
  ) {
    this.title = res ? res.toString() : "";
    this.icon = res ? res.color.icon : "";
    this.items = items;
  }
}
export class Item {
  readonly title: string;
  readonly icon?: string;
  readonly price: Price;

  constructor(res: { title: string; icon?: string }, price: Price) {
    this.title = res ? res.title : "";
    this.icon = res ? res.icon : "";
    this.price = price;
  }
}

export interface Tab {
  title: string;
  isSelected: () => boolean;
  click: () => void;
}
