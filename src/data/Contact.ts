import { ContactLink, type ContactLinkData } from '@/data/ContactLink';

interface ContactData {
  title: string;
  links: ContactLinkData[];
}

export class Contact {
  readonly title: string;
  readonly subtitle: string;
  readonly links: ContactLink[];

  constructor(data: ContactData) {
    this.title = data.title;
    this.links = data.links.map((d) => new ContactLink(d));

    this.subtitle = data.links[0].id;
  }

  toData(): ContactData {
    return {
      title: this.title,
      links: this.links.map((link) => link.toData()),
    };
  }
}
