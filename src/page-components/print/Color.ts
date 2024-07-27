import IconPaletteColor from '@/assets/icon/palette-cmyk.svg';
import IconPaletteBw from '@/assets/icon/palette-bw.svg';

export class Color {
  static BlackWhite = new Color('Black & White', IconPaletteBw);
  static Colorful = new Color('Color', IconPaletteColor);

  private constructor(
    readonly title: string,
    readonly icon: string,
  ) {}
  toString() {
    return this.title;
  }
}
