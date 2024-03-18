import { trimId, trimText } from "@/U";

export interface LabelData {
  title?: string;
  hexColor?: string;
}

export class Label {
  title: string;
  hexColor: string;

  constructor(data: LabelData) {
    this.title = trimText(data.title);
    this.hexColor = trimId(data.hexColor);
  }
  toData(): LabelData {
    return {
      title: trimText(this.title),
      hexColor: trimId(this.hexColor),
    };
  }
  toCount(strs: string[]): number {
    return 0;
  }

  isEqual(label: Label): boolean {
    return this.title === label.title && this.hexColor === label.hexColor;
  }

  compare(item: Label): number {
    return 0;
  }
}

export const URGENT = new Label({ title: "Urgent", hexColor: "d93f35" });
export const WARRANTY = new Label({ title: "Warranty", hexColor: "db950c" });
