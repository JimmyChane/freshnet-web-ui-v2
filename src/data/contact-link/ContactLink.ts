import { optString } from "@/U";
import {
  Call,
  Whatsapp,
  SocialMedia,
  Telephone,
  Telegram,
} from "../social-media/SocialMedia";

export interface ContactLinkData {
  id: string;
  category?: string;
}

export class ContactLink {
  readonly socialMedia?: SocialMedia;
  readonly id: string;

  constructor(data: ContactLinkData) {
    this.id = optString(data.id);
    this.socialMedia = [Call, Whatsapp, Telegram, Telephone].find(
      (category) => {
        return category.key === data.category;
      },
    );
  }

  toData(): ContactLinkData {
    const data: ContactLinkData = { id: this.id };

    if (this.socialMedia instanceof SocialMedia) {
      data.category = this.socialMedia.key;
    }

    return data;
  }

  toHtmlHref(): string {
    if (this.socialMedia === Call || this.socialMedia === Telephone)
      return `tel:+6${this.id}`;
    if (this.socialMedia === Whatsapp)
      return `https://api.whatsapp.com/send?phone=6${this.id}`;
    if (this.socialMedia === Telegram) return `https://t.me/${this.id}`;
    return "";
  }

  toHtmlTarget(): string {
    if (this.socialMedia === Call || this.socialMedia === Telephone)
      return "_self";
    if (this.socialMedia === Whatsapp || this.socialMedia === Telegram)
      return "_blank";
    return "";
  }
}
