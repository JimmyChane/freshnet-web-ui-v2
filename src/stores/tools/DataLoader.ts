import { ValidationChecker } from "./ValidationChecker";
import { Processor } from "./Processor";
import { optArray } from "@/U";

export class DataLoader<T> {
  static withStore(getStore: () => any = () => {}) {
    return new DataLoader(1000 * 60 * 10) // 10min
      .processor(() => getStore().state.processor)
      .setData((data) => {
        return getStore()
          .state.list.clear()
          .addItems(...optArray(data));
      })
      .getData(() => getStore().state.list.items);
  }

  private validator: ValidationChecker;

  private onGetProcessor: (() => Processor | undefined) | undefined;
  private onLoadData: (() => Promise<T[]>) | undefined;
  private onSetData: ((data: T[] | undefined) => void) | undefined;
  private onGetData: (() => T[] | undefined) | undefined;

  constructor(timeout: number = 1000 * 60 * 10) {
    this.validator = new ValidationChecker(timeout);
  }

  processor(callback: () => Processor | undefined): this {
    this.onGetProcessor = callback;
    return this;
  }

  loadData(callback: () => Promise<T[]>): this {
    this.onLoadData = callback;
    return this;
  }

  setData(callback: (data: T[] | undefined) => void): this {
    this.onSetData = callback;
    return this;
  }

  getData(callback: () => T[] | undefined): this {
    this.onGetData = callback;
    return this;
  }

  doTimeout(): void {
    this.validator.resetCheckpoint();
  }

  isTimeout(): boolean {
    return !this.validator.isValid();
  }

  async data(): Promise<T[]> {
    const validator = this.validator;
    const processor = this.onGetProcessor?.();

    const getData = this.onGetData;
    const setData = this.onSetData;
    const loadData = this.onLoadData;

    if (!processor || !getData || !setData || !loadData) {
      throw new Error("DataLoader not properly initialized.");
    }

    return processor.acquire("DataLoader", async () => {
      try {
        if (validator.isValid()) return getData() ?? [];

        const data = await new Promise<T[] | undefined>((resolve, reject) => {
          validator.resetCheckpoint();
          setData(undefined);
          loadData()
            .then((data) => resolve(data))
            .catch((error) => reject(error));
        });

        setData(data);
        validator.makeCheckpoint();

        return getData() ?? [];
      } catch (error) {
        validator.resetCheckpoint();
        setData(undefined);
        throw error;
      }
    });
  }
}
