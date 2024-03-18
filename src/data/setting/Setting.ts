import { trimId } from "@/U";
import { Item } from "@/data/Item";

interface SettingData {
  key: string;
  visibility?: string;
  value: any;
}

export class Setting extends Item {
  static Visibility = { Protected: "protected", Private: "private" };
  static Key = {
    PublicShowPrice: "public-showPrice",
    Location: "store-location",
    LocationLink: "store-location-link",
    Contacts: "store-contacts",
    CompanyName: "store-name",
    CompanyCategory: "store-category",
    CompanyWorkingHours: "store-working-hours",
  };

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
