import { IconModel } from '@/model/Icon.model';

export class IconPackModel {
  readonly light: IconModel;
  readonly dark: IconModel;

  constructor(light: IconModel, dark: IconModel) {
    this.light = light;
    this.dark = dark;
  }
}
