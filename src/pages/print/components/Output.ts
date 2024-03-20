import { Color } from "./Color";

export class Output {
  static BlackWhite = new Output("", Color.BlackWhite);
  static Colorful = new Output("", Color.Colorful);
  static BorderlessColorful = new Output("Borderless", Color.Colorful);

  private constructor(
    readonly title: string,
    readonly color: Color,
  ) {}

  toString() {
    if (!this.title) return `${this.color.title}`;
    return `${this.color.title} ${this.title}`;
  }
}
