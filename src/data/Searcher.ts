export interface Countable {
  id: string;
  toCount(strs: string[]): number;
}

interface SearchResult<T extends Countable> {
  count: number;
  item: T;
}

export default class Searcher<T extends Countable> {
  static withItems<T extends Countable>(items: T[] = []): Searcher<T> {
    const searcher = new Searcher<T>();
    searcher.items = items;
    return searcher;
  }

  items: T[] = [];

  constructor() {}

  onSplitStrings(strs: string[] = []): string[] {
    return strs.reduce((strs: string[], str: string) => {
      for (const parsedStr of this.onSplitString(str)) {
        if (!strs.includes(parsedStr)) {
          strs.push(parsedStr);
        }
      }

      return strs;
    }, []);
  }

  onSplitString(str: string = ''): string[] {
    return str
      .toLowerCase()
      .split(/[\s,]+/)
      .filter((text) => text);
  }

  onCountItems(items: T[] = [], strs: string[] = []): SearchResult<T>[] {
    return items.reduce((results, item) => {
      try {
        const result = this.onCountItem(item, strs);
        if (result.count > 0) results.push(result);
      } catch (error) {
        console.error('skip search item', error);
      }
      return results;
    }, [] as SearchResult<T>[]);
  }

  onCountItem(item: T, strs: string[]): SearchResult<T> {
    return { count: item.toCount(strs), item };
  }

  onFilterResults(results: SearchResult<T>[]): SearchResult<T>[] {
    if (results.length <= 30) return results;

    let highestCount = 0;
    for (const result of results) {
      if (result.count > highestCount) highestCount = result.count;
    }

    const minCount = highestCount * 0.5;
    results = results.filter((result) => result.count <= minCount);

    return this.onFilterResults(results);
  }

  onSortResults(results: SearchResult<T>[]): SearchResult<T>[] {
    return results.sort((result1, result2) => result2.count - result1.count);
  }

  search(str: string | string[]): T[] {
    if (typeof str !== 'string') return [];

    const strs = Array.isArray(str) ? this.onSplitStrings(str) : this.onSplitString(str);
    const results = this.onCountItems(this.items, strs);
    const sortedResults = this.onSortResults(results);

    if (sortedResults.length < 40) {
      return sortedResults.map((result) => result.item);
    }
    const items = [];
    for (let i = 0; i < 40; i++) {
      items.push(sortedResults[i].item);
    }
    return items;
  }
}
