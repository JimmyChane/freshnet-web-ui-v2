import { Image } from "../Image";
import { isObjectOnly, textContains, trimId, trimText } from "@/U";
import { Item } from "@/data/Item";

interface BrandData {
  _id: string;
  title: string;
  icon?: any;
}

export class Brand implements Item {
  id: string = "";
  title: string = "";
  icon?: Image;

  constructor(data: BrandData) {
    this.id = trimId(data._id);
    this.title = trimText(data.title);
    if (isObjectOnly(data.icon)) this.icon = new Image(data.icon);
  }

  toData(): BrandData {
    return {
      _id: this.id,
      title: this.title,
      icon: this.icon?.toData() ?? {},
    };
  }

  toCount(strs: string[]): number {
    return strs.reduce((count, str) => {
      if (textContains(this.title, str)) count++;
      if (textContains(this.title, str)) count++;
      return count;
    }, 0);
  }

  isEqual(obj: Brand): boolean {
    return this.id === obj.id && this.title === obj.title;
  }

  compare(item: Brand): number {
    return this.title.localeCompare(item.title);
  }

  getUnique(): string {
    return this.id;
  }
}
