import { Image } from './Image';
import { isObjectOnly, textContains, trimId, trimText } from '@/utils/U';
import { Item } from '@/data/Item';
import { serverRequest } from './Server';

export interface BrandData {
  _id: string;
  title: string;
  icon?: any;
}

export class Brand implements Item {
  id: string = '';
  title: string = '';
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

export class BrandRequest {
  static list(): Promise<any> {
    return serverRequest().path('brand/').sendJson();
  }
}

export const INTEL = new Brand({ _id: '', title: 'Intel', icon: null });
export const AMD = new Brand({ _id: '', title: 'AMD', icon: null });
export const NVIDIA = new Brand({ _id: '', title: 'Nvidia', icon: null });
