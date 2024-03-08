import { Icon } from "../icon/Icon";

export class IconPack {
  readonly light: Icon;
  readonly dark: Icon;

  constructor(light: Icon, dark: Icon) {
    this.light = light;
    this.dark = dark;
  }
}
