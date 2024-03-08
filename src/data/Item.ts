export abstract class Item {
  abstract getUnique(): string;

  toCount(strs: string[]): number {
    return 0;
  }
}
