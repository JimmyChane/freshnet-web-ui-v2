import { trimId, trimText } from '@/utils/U';

export interface CustomerDeviceSpecificationData {
  typeKey?: string;
  content?: string;
}

export class CustomerDeviceSpecification {
  typeKey: string;
  content: string;

  constructor(data: CustomerDeviceSpecificationData) {
    this.typeKey = trimId(data.typeKey);
    this.content = trimText(data.content);

    return this;
  }
  toData(): CustomerDeviceSpecificationData {
    return {
      typeKey: trimId(this.typeKey),
      content: trimText(this.content),
    };
  }
  toCount(strs: string[]): number {
    return 0;
  }

  compare(item: CustomerDeviceSpecification): number {
    return 0;
  }
}
