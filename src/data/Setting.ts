import { trimId } from '@/utils/U';
import { Item } from '@/data/Item';
import { serverRequest } from '@/data/Server';

export enum SettingKey {
  PublicShowPrice = 'public-showPrice',
  Location = 'store-location',
  LocationLink = 'store-location-link',
  Contacts = 'store-contacts',
  CompanyName = 'store-name',
  CompanyCategory = 'store-category',
  CompanyWorkingHours = 'store-working-hours',
}
export enum SettingVisibility {
  Protected = 'protected',
  Private = 'private',
}

export interface SettingData {
  key: string;
  visibility?: string;
  value: any;
}

export class Setting extends Item {
  key: string;
  visibility: string;
  value: any;

  constructor(data: SettingData) {
    super();
    this.key = trimId(data.key);
    this.visibility = trimId(data.visibility);
    this.value = data.value;
  }

  toData(): SettingData {
    return {
      key: trimId(this.key),
      visibility: trimId(this.visibility),
      value: this.value,
    };
  }

  getUnique(): string {
    return this.key;
  }
}

export class SettingRequest {
  static list(): Promise<any> {
    return serverRequest().path('settingv3').sendJson();
  }
  static update(setting: any): Promise<any> {
    return serverRequest().PUT().path('settingv3/system').bodyJson(setting).sendJson();
  }
}
