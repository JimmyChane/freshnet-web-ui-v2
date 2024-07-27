interface Resolver<R> {
  resolve: (value: R | PromiseLike<R>) => void;
  reject: (reason?: any) => void;
  callback: () => Promise<R>;
}

export class LinearQueue {
  private resolvers: Resolver<any>[] = [];
  private currentResolver?: Resolver<any>;

  private async runNext() {
    if (this.currentResolver) return;
    if (this.resolvers.length === 0) return;

    this.currentResolver = this.resolvers[0];

    const { resolve, reject, callback } = this.currentResolver;

    try {
      const result = await callback();
      resolve(result);
    } catch (error) {
      reject(error);
    }

    const index = this.resolvers.indexOf(this.currentResolver);
    if (index > -1) this.resolvers.splice(index, 1);

    this.currentResolver = undefined;
    this.runNext();
  }

  async next<T>(callback: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const resolver: Resolver<T> = {
        resolve,
        reject,
        callback,
      };
      this.resolvers.push(resolver);
      this.runNext();
    });
  }
}
