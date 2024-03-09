import { Image } from "../Image";
import { textContains, trimId, trimStringAll } from "@/U";
import { Item } from "@/data/Item";

import BgTablet from "@/assets/bg/daniel-romero--cCxgKIA5RA-unsplash-w300h100.webp";
import BgNotebook from "@/assets/bg/andras-vas-Bd7gNnWJBkU-unsplash-w300h100.webp";
import BgDesktop from "@/assets/bg/niclas-illg-wzVQp_NRIHg-unsplash-w300h100.webp";
import BgPrinter from "@/assets/bg/mahrous-houses-5AoOejjRUrA-unsplash-w300h100.webp";
import BgCartridge from "@/assets/bg/177364729-w300h100.webp";
import BgMouse from "@/assets/bg/ryan-putra-j4PqlNVZ4Bc-unsplash-w300h100.webp";
import BgKeyboard from "@/assets/bg/girl-with-red-hat-Z6SXt1v5tP8-unsplash-w300h100.webp";
import BgAudio from "@/assets/bg/josh-sorenson-u8-QI4tRES0-unsplash-w300h100.webp";
import BgMonitor from "@/assets/bg/monitor-u3223qe-gallery-3-w300h100.webp";
import BgWebcam from "@/assets/bg/emiliano-cicero-lq87UxGSiEQ-unsplash-w300h100.webp";
import BgCctv from "@/assets/bg/michal-jakubowski-oQD9uq4Rd4I-unsplash-w300h100.webp";
import BgStorage from "@/assets/bg/denny-muller-1qL31aacAPA-unsplash-w300h100.webp";
import BgRam from "@/assets/bg/harrison-broadbent-ING1Uf1Fc30-unsplash-w300h100.webp";
import BgNetwork from "@/assets/bg/jordan-harrison-40XgDxBfYXM-unsplash-w300h100.webp";
import BgOther from "@/assets/bg/christopher-bill-3l19r5EOZaw-unsplash-w300h100.webp";

class CategoryBackground extends Image {
  static TABLET = new Image().fromData({ method: "link", path: BgTablet });
  static NOTEBOOK = new Image().fromData({ method: "link", path: BgNotebook });
  static DESKTOP = new Image().fromData({ method: "link", path: BgDesktop });
  static PRINTER = new Image().fromData({ method: "link", path: BgPrinter });
  static CARTRIDGE = new Image().fromData({
    method: "link",
    path: BgCartridge,
  });
  static MOUSE = new Image().fromData({ method: "link", path: BgMouse });
  static KEYBOARD = new Image().fromData({ method: "link", path: BgKeyboard });
  static AUDIO = new Image().fromData({ method: "link", path: BgAudio });
  static MONITOR = new Image().fromData({ method: "link", path: BgMonitor });
  static WEBCAM = new Image().fromData({ method: "link", path: BgWebcam });
  static CCTV = new Image().fromData({ method: "link", path: BgCctv });
  static STORAGE = new Image().fromData({ method: "link", path: BgStorage });
  static RAM = new Image().fromData({ method: "link", path: BgRam });
  static NETWORK = new Image().fromData({ method: "link", path: BgNetwork });
  static OTHER = new Image().fromData({ method: "link", path: BgOther });

  static getBackground(key: string): Image | null {
    switch (key) {
      case Category.Key.Tablet:
        return CategoryBackground.TABLET;
      case Category.Key.Notebook:
        return CategoryBackground.NOTEBOOK;
      case Category.Key.Desktop:
        return CategoryBackground.DESKTOP;
      case Category.Key.Printer:
        return CategoryBackground.PRINTER;
      case Category.Key.Cartridge:
        return CategoryBackground.CARTRIDGE;
      case Category.Key.Mouse:
        return CategoryBackground.MOUSE;
      case Category.Key.Keyboard:
        return CategoryBackground.KEYBOARD;
      case Category.Key.Audio:
        return CategoryBackground.AUDIO;
      case Category.Key.Monitor:
        return CategoryBackground.MONITOR;
      case Category.Key.Webcam:
        return CategoryBackground.WEBCAM;
      case Category.Key.Cctv:
        return CategoryBackground.CCTV;
      case Category.Key.Storage:
        return CategoryBackground.STORAGE;
      case Category.Key.Ram:
        return CategoryBackground.RAM;
      case Category.Key.Network:
        return CategoryBackground.NETWORK;
      case Category.Key.Other:
        return CategoryBackground.OTHER;
      default:
        return null;
    }
  }
}

interface CategoryData {
  _id: string;
  key: string;
  title: string;
  icon?: any;
  background?: any;
}

export class Category implements Item {
  static Key = {
    Tablet: "tablet",
    Notebook: "laptop",
    Desktop: "desktopComputer",
    Printer: "printer",
    Cartridge: "cartridge",
    Mouse: "mouse",
    Keyboard: "keyboard",
    Audio: "audio",
    Monitor: "monitor",
    Webcam: "webcam",
    Cctv: "cctv-camera",
    Storage: "storage",
    Ram: "ram",
    Network: "network",
    Charger: "charger",
    Other: "other",
  };

  id: string = "";
  key: string = "";
  title: string = "";
  icon: Image | null = null;
  background: Image | null = null;

  fromData(data: CategoryData): this {
    this.id = trimId(data._id);
    this.key = trimId(data.key);
    this.title = trimStringAll(data.title);
    this.icon =
      typeof data.icon === "object" ? new Image().fromData(data.icon) : null;
    this.background = CategoryBackground.getBackground(this.key);

    return this;
  }

  toData(): CategoryData {
    return {
      _id: this.id,
      key: this.key,
      title: this.title,
      icon: this.icon?.toData() ?? {},
      background: this.background?.toData() ?? {},
    };
  }

  toCount(strs: string[]): number {
    return strs.reduce((count, str) => {
      if (this.title === "Notebook")
        count += textContains("Laptop", str) ? 1 : 0;
      if (this.title === "Notebook" && textContains("Laptop", str)) count++;
      if (textContains(this.title, str)) count++;
      if (textContains("category", str)) count++;
      return count;
    }, 0);
  }

  compare(item: Category): number {
    const keyOrders = Object.values(Category.Key);

    let index1 = keyOrders.indexOf(this.key);
    let index2 = keyOrders.indexOf(item.key);
    index1 = index1 == -1 ? keyOrders.length : index1;
    index2 = index2 == -1 ? keyOrders.length : index2;

    return index1 > index2 ? 1 : index1 < index2 ? -1 : 0;
  }

  getUnique(): string {
    return this.id;
  }
}
