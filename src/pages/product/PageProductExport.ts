import Pixel from "@/data/Pixel";

export class Orientation {
  static Portrait = new Orientation("Portrait");
  static Landscape = new Orientation("Landscape");

  readonly title: string;

  constructor(title: string) {
    this.title = title;
  }
}
export class Size {
  static A5 = new Size("A5", Pixel.cm(148.5), Pixel.cm(210));
  static A4 = new Size("A4", Pixel.cm(210), Pixel.cm(297));

  readonly title: string;
  readonly width: number;
  readonly height: number;

  constructor(title: string, width: number, height: number) {
    this.title = title;
    this.width = width;
    this.height = height;
  }
}
export class GridCount {
  static One = new GridCount("1", 1);
  static Two = new GridCount("2", 2);

  readonly title: string;
  readonly count: number;

  constructor(title: string, count: number) {
    this.title = title;
    this.count = count;
  }
}
export class Layout {
  static One = new Layout("Layout One");
  static Two = new Layout("Layout Two");

  readonly title: string;

  constructor(title: string) {
    this.title = title;
  }
}

export class Option {
  selectedItem?: Orientation | Size | GridCount | Layout;

  readonly title: string;
  readonly items: (Orientation | Size | GridCount | Layout)[];
  readonly defaultIndex: number = 0;

  constructor(
    title: string,
    items: (Orientation | Size | GridCount | Layout)[],
    defaultIndex: number,
  ) {
    this.title = title;
    this.items = items;

    this.items.forEach((item: Record<string, any>) => {
      item.isSelected = () => item === this.selectedItem;
      item.click = () =>
        (this.selectedItem = item as Orientation | Size | GridCount | Layout);
    });

    this.selectedItem = this.items[defaultIndex];
  }

  click() {
    if (!this.selectedItem) return;
    const index = this.items.indexOf(this.selectedItem);
    const nextIndex = index + 1;
    this.selectedItem =
      this.items[nextIndex >= this.items.length ? 0 : nextIndex];
  }
}
