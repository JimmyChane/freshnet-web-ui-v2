import { Item } from "@/data/Item";
import { Image } from "../Image";
import { useSpecificationStore } from "@/data-stores/specification.store";
import { isObjectOnly, textContains, trimId, trimText } from "@/U";

export interface TypeData {
  _id?: string;
  key?: string;
  title?: string;
  icon?: any;
  color?: string;
}

export class Type implements Item {
  static Key: Record<string, string> = {
    Processor: "processor",
    Ram: "ram",
    Size: "size",
    Storage: "storage",
    Resolution: "resolution",
    Display: "display",
    Monitor: "monitor",
    Graphic: "graphic",

    Keyboard: "keyboard",
    Backlight: "backlight",
    Stylus: "stylus",
    Camera: "camera",
    Battery: "battery",

    Speed: "speed",
    Wifi: "wifi",
    Bluetooth: "bluetooth",

    Print: "print",
    Scan: "scan",
    Paper: "paper",
    Ink: "ink",
    Connectivity: "connectivity",

    Colour: "colour",
    Os: "os",
  };

  id: string;
  key: string;
  title: string;
  icon?: Image;
  color: string;

  constructor(data: TypeData) {
    this.id = trimId(data._id || "");
    this.key = trimId(data.key || "");
    this.title = trimText(data.title || "");
    this.color = trimId(data.color || "");

    if (isObjectOnly(data.icon)) this.icon = new Image(data.icon);
  }
  toData(): {
    _id: string;
    key: string;
    title: string;
    icon: any;
    color: string;
  } {
    return {
      _id: trimId(this.id),
      key: trimId(this.key),
      title: trimText(this.title),
      icon: this.icon?.toData() ?? {},
      color: trimId(this.color),
    };
  }
  toCount(strs: string[]): number {
    return strs.reduce((count, str) => {
      if (textContains(this.key, str)) count++;
      if (textContains(this.title, str)) count++;
      return count;
    }, 0);
  }

  compare(item: Type): number {
    return 0;
  }

  getUnique(): string {
    return this.id;
  }
}

export class Specification {
  typeKey: string = "";
  type?: Type;
  content: string = "";

  fromData(data: { key?: string; content?: string }): Specification {
    this.typeKey = trimId(data.key);
    this.content = trimText(data.content);
    this.fetchType();

    return this;
  }
  toData(): { key: string | undefined; content: string } {
    return {
      key: this.getKey(),
      content: this.content,
    };
  }
  toCount(strs: string[]): number {
    return strs.reduce((count, str) => {
      if (textContains(this.content, str)) count++;
      return count;
    }, 0);
  }

  compare(item: Specification): number {
    return 0;
  }

  async fetchType(): Promise<Type | undefined> {
    if (this.type instanceof Type) return this.type;

    const specifications: Type[] = await useSpecificationStore().getItems();
    const specification = specifications.find((specification) => {
      return specification.key == this.typeKey;
    });
    this.type = specification ?? undefined;
    return this.type;
  }

  getKey(): string {
    if (this.type instanceof Type) {
      return this.type.key;
    }
    if (typeof this.type === "string") {
      return this.typeKey;
    }
    return "";
  }
}
