import { TypeKey } from '@/data/Specification';
import { AMD, INTEL, NVIDIA } from '@/data/Brand';
import { Product } from '@/data/Product';

class Unit {
  short: string;
  long: string;
  text: string;

  constructor(short: string = '', long: string = '', text: string = '') {
    this.short = short;
    this.long = long;
    this.text = text;
  }
}
class Memory {
  amount: number;
  unit: Unit;

  constructor(amount: number = 0, unit: Unit = new Unit()) {
    this.amount = amount;
    this.unit = unit;
  }

  toString(): string {
    return `${this.amount}${this.unit.short}`;
  }
}
class Size {
  amount: number;
  unit: Unit;

  constructor(amount: number = 0, unit: Unit = new Unit()) {
    this.amount = amount;
    this.unit = unit;
  }

  toString(): string {
    return `${this.amount}${this.unit.short}`;
  }
}
class Resolution {
  width: number;
  height: number;
  short: string;
  text: string;

  constructor(width: number = 0, height: number = 0, short: string = '', text: string = '') {
    this.width = width;
    this.height = height;
    this.short = short;
    this.text = text;
  }

  toString(): string {
    return `${this.short}`;
  }
}
class Label {
  name: string;
  text: string;
  color: string;

  constructor(name: string, text: string, color: string) {
    this.name = name;
    this.text = text;
    this.color = color;
  }
}

export const KILOBYTE = new Unit('kb', 'kilobyte', 'KiloByte');
export const MEGABYTE = new Unit('mb', 'megabyte', 'MegaByte');
export const GIGABYTE = new Unit('gb', 'gigabyte', 'GigaByte');
export const TERABYTE = new Unit('tb', 'terabyte', 'TeraByte');

export const INCH = new Unit('"', 'inch', 'Inch');

export const PROMOTION = new Label('promotion', 'Promotion', '#FF8A00');
export const OUT_OF_STOCK = new Label('outOfStock', 'Out of Stock', '#FF4B33');
export const SECOND_HAND = new Label('secondHand', 'Second Hand', '#249696');

const PROCESSOR_MAPS: Record<string, string[]> = {
  intel: ['i9', 'i7', 'i5', 'i3', 'celeron', 'pentium'],
  amd: ['ryzen 7', 'ryzen 5', 'ryzen 3', 'althon silver'],
};
const RAM_MAPS: Record<string, string[]> = {
  ddr3: [16, 8, 7, 6, 5, 4, 3, 2].map((x) => {
    return new Memory(x, GIGABYTE).toString();
  }),
  ddr4: [16, 8, 7, 6, 5, 4, 3, 2].map((x) => {
    return new Memory(x, GIGABYTE).toString();
  }),
};
const SIZES = [15.6, 14, 13, 13.1, 11.5].map((x) => {
  return new Size(x, INCH).toString();
});
const SSDS = [
  new Memory(1, TERABYTE).toString(),
  ...[1000, 512, 480, 256, 240, 128, 120].map((x) => {
    return new Memory(x, GIGABYTE).toString();
  }),
];
const HDDS = [
  ...[4, 2, 1].map((x) => new Memory(x, TERABYTE).toString()),
  ...[4000, 2000, 1000, 640, 500, 320, 250].map((x) => {
    return new Memory(x, GIGABYTE).toString();
  }),
];
const STORAGE_MAPS: Record<string, string[]> = { ssd: SSDS, hdd: HDDS };

const GRAPHICS = [
  `${INTEL.title} hd`,
  `${INTEL.title} uhd`,
  `${INTEL.title} iris xe`,
  `${INTEL.title} iris plus`,
  `${NVIDIA.title} geforce gtx`,
  `${NVIDIA.title} geforce rtx`,
  `${NVIDIA.title} gtx`,
  `${NVIDIA.title} rtx`,
  `${AMD.title} radeon`,
];
const RESOLUTIONS = [
  new Resolution(1920, 1080, 'fhd', 'Full HD').toString(),
  new Resolution(1366, 768, 'hd', 'HD').toString(),
];

export const SPECIFICATION_MAPS = {
  [TypeKey.Processor]: PROCESSOR_MAPS,
  [TypeKey.Ram]: RAM_MAPS,
  [TypeKey.Size]: SIZES,
  [TypeKey.Resolution]: RESOLUTIONS,
  [TypeKey.Display]: RESOLUTIONS,
  [TypeKey.Storage]: STORAGE_MAPS,
  graphic: GRAPHICS,
};
export const COLOR_MAPS: Record<string, string> = {
  [TypeKey.Processor]: '#276EB0',
  [TypeKey.Ram]: '#249696',
  [TypeKey.Size]: '#3B9511',
  [TypeKey.Resolution]: '#A11357',
  [TypeKey.Display]: '#A11357',
  [TypeKey.Storage]: '#276EB0',
};

export function generateStockLabels(product?: Product): Label[] {
  if (product === undefined) return [];

  let labels = [];

  if (product.isPricePromotion()) labels.push(PROMOTION);
  if (!product.isStockAvailable()) labels.push(OUT_OF_STOCK);
  if (product.isStockSecondHand()) labels.push(SECOND_HAND);

  return labels;
}
export function generateSpecificationLabels(
  product?: Product,
): { name: string; text: string; color: string }[] {
  if (product === undefined) return [];

  const { specifications } = product;

  const itemSpecificationsByMap = specifications.filter((itemSpec) => {
    const key = itemSpec.getKey();
    if (key === undefined) return false;
    return Object.keys(SPECIFICATION_MAPS).includes(key);
  });
  const itemSpecifications = itemSpecificationsByMap.map((itemSpec) => {
    const key = itemSpec.getKey();

    if (key === undefined) return;

    const content = itemSpec.content.toLowerCase();

    switch (key) {
      case TypeKey.Processor:
        for (const key of Object.keys(PROCESSOR_MAPS)) {
          if (!content.includes(key)) continue;

          for (const key in PROCESSOR_MAPS) {
            if (PROCESSOR_MAPS[key].includes(content)) {
              return {
                name: `${key}${content}`,
                text: `${key} ${content}`.toUpperCase(),
                color: COLOR_MAPS[key],
              };
            }
          }
        }

        break;
      case TypeKey.Ram:
        for (const key of Object.keys(RAM_MAPS)) {
          if (!content.includes(key)) continue;

          for (const key in RAM_MAPS) {
            if (RAM_MAPS[key].includes(content)) {
              return {
                name: `${key}${content}`,
                text: `${key} ${content}`.toUpperCase(),
                color: COLOR_MAPS[key],
              };
            }
          }
        }

        break;
      case TypeKey.Storage:
        for (const key of Object.keys(STORAGE_MAPS)) {
          if (!content.includes(key)) continue;

          for (const key in STORAGE_MAPS) {
            if (STORAGE_MAPS[key].includes(content)) {
              return {
                name: `${key}${content}`,
                text: `${key} ${content}`.toUpperCase(),
                color: COLOR_MAPS[key],
              };
            }
          }
        }
        break;
      case TypeKey.Resolution:
      case TypeKey.Display:
        if (RESOLUTIONS.includes(content)) {
          return {
            name: content,
            text: `${content}`.toUpperCase(),
            color: COLOR_MAPS[key],
          };
        }
        break;
      case TypeKey.Size:
        if (SIZES.includes(content)) {
          return {
            name: content,
            text: `${content}"`,
            color: COLOR_MAPS[key],
          };
        }

        break;
      case TypeKey.Graphic:
        const reversedCompares = [].map((compare: any) => compare).reverse();
        for (const compare of reversedCompares) {
          if (content.includes(compare)) {
            return {
              name: compare,
              text: `${compare}`.toUpperCase(),
              color: COLOR_MAPS[key],
            };
          }
        }
      default:
    }

    const compares = (() => {
      switch (key) {
        case TypeKey.Processor:
          return SPECIFICATION_MAPS.processor;
        case TypeKey.Ram:
          return SPECIFICATION_MAPS.ram;
        case TypeKey.Size:
          return SPECIFICATION_MAPS.size;
        case TypeKey.Resolution:
          return SPECIFICATION_MAPS.resolution;
        case TypeKey.Display:
          return SPECIFICATION_MAPS.display;
        case TypeKey.Storage:
          return SPECIFICATION_MAPS.storage;
        default:
          return undefined;
      }
    })();
  });

  return itemSpecifications.filter(
    (itemSpec): itemSpec is { name: string; text: string; color: string } => {
      return itemSpec !== undefined;
    },
  );
}
