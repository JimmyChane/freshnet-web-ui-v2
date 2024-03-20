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

export const TABLET = new Image({ method: "link", path: BgTablet });
export const NOTEBOOK = new Image({ method: "link", path: BgNotebook });
export const DESKTOP = new Image({ method: "link", path: BgDesktop });
export const PRINTER = new Image({ method: "link", path: BgPrinter });
export const CARTRIDGE = new Image({ method: "link", path: BgCartridge });
export const MOUSE = new Image({ method: "link", path: BgMouse });
export const KEYBOARD = new Image({ method: "link", path: BgKeyboard });
export const AUDIO = new Image({ method: "link", path: BgAudio });
export const MONITOR = new Image({ method: "link", path: BgMonitor });
export const WEBCAM = new Image({ method: "link", path: BgWebcam });
export const CCTV = new Image({ method: "link", path: BgCctv });
export const STORAGE = new Image({ method: "link", path: BgStorage });
export const RAM = new Image({ method: "link", path: BgRam });
export const NETWORK = new Image({ method: "link", path: BgNetwork });
export const OTHER = new Image({ method: "link", path: BgOther });

export function getBackground(key: string): Image | undefined {
  switch (key) {
    case Category.Key.Tablet:
      return TABLET;
    case Category.Key.Notebook:
      return NOTEBOOK;
    case Category.Key.Desktop:
      return DESKTOP;
    case Category.Key.Printer:
      return PRINTER;
    case Category.Key.Cartridge:
      return CARTRIDGE;
    case Category.Key.Mouse:
      return MOUSE;
    case Category.Key.Keyboard:
      return KEYBOARD;
    case Category.Key.Audio:
      return AUDIO;
    case Category.Key.Monitor:
      return MONITOR;
    case Category.Key.Webcam:
      return WEBCAM;
    case Category.Key.Cctv:
      return CCTV;
    case Category.Key.Storage:
      return STORAGE;
    case Category.Key.Ram:
      return RAM;
    case Category.Key.Network:
      return NETWORK;
    case Category.Key.Other:
      return OTHER;
    default:
      return undefined;
  }
}

interface CategoryData {
  _id?: string;
  key?: string;
  title?: string;
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

  id: string;
  key: string;
  title: string;
  icon?: Image;
  background?: Image;

  constructor(data: CategoryData) {
    this.id = trimId(data._id);
    this.key = trimId(data.key);
    this.title = trimStringAll(data.title);
    if (typeof data.icon === "object") this.icon = new Image(data.icon);
    this.background = getBackground(this.key);
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
