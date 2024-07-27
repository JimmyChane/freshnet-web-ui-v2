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

const PROCESSOR_MAPS = {
  intel: ['i9', 'i7', 'i5', 'i3', 'celeron', 'pentium'],
  amd: ['ryzen 7', 'ryzen 5', 'ryzen 3', 'althon silver'],
};
const RAM_MAPS = {
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
const STORAGE_MAPS = { ssd: SSDS, hdd: HDDS };

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

export const SPECIFICATION_MAPS: Record<string, string[] | Record<string, string[]>> = {
  processor: PROCESSOR_MAPS,
  ram: RAM_MAPS,
  size: SIZES,
  resolution: RESOLUTIONS,
  display: RESOLUTIONS,
  storage: STORAGE_MAPS,
  graphic: GRAPHICS,
};
export const COLOR_MAPS: Record<string, string> = {
  processor: '#276EB0',
  ram: '#249696',
  size: '#3B9511',
  resolution: '#A11357',
  display: '#A11357',
  storage: '#276EB0',
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
    return Object.keys(SPECIFICATION_MAPS).includes(key);
  });
  const itemSpecifications = itemSpecificationsByMap.map((itemSpec) => {
    const key = itemSpec.getKey();
    const compares = SPECIFICATION_MAPS[key];
    const content = itemSpec.content.toLowerCase();

    if ([TypeKey.Processor, TypeKey.Ram, TypeKey.Storage].includes(key as TypeKey)) {
      for (const compareType of Object.keys(compares)) {
        if (!content.includes(compareType)) {
          continue;
        }
        for (const compare of compares[compareType]) {
          if (content.includes(compare)) {
            return {
              name: `${compareType}${compare}`,
              text: `${compareType} ${compare}`.toUpperCase(),
              color: COLOR_MAPS[key],
            };
          }
        }
      }
    }

    if (key === TypeKey.Size) {
      for (const compare of compares) {
        if (content.includes(compare)) {
          return {
            name: compare,
            text: `${compare}"`,
            color: COLOR_MAPS[key],
          };
        }
      }
    } else if ([TypeKey.Resolution, TypeKey.Display].includes(key as TypeKey)) {
      for (const compare of compares) {
        if (content.includes(compare)) {
          return {
            name: compare,
            text: `${compare}`.toUpperCase(),
            color: COLOR_MAPS[key],
          };
        }
      }
    }

    if (key === TypeKey.Graphic) {
      const reversedCompares = compares.map((compare: any) => compare).reverse();
      for (const compare of reversedCompares) {
        if (content.includes(compare)) {
          return {
            name: compare,
            text: `${compare}`.toUpperCase(),
            color: COLOR_MAPS[key],
          };
        }
      }
    }
  });

  return itemSpecifications.filter(
    (itemSpec): itemSpec is { name: string; text: string; color: string } => {
      return itemSpec !== undefined;
    },
  );
}
