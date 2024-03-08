export class ValidationChecker {
  private _timeout: number = 0;
  private _checkpoint: number = 0;

  constructor(timeout: number) {
    this._timeout = timeout;
  }

  get timeout(): number {
    return this._timeout;
  }

  get checkpoint(): number {
    return this._checkpoint;
  }

  isValid(): boolean {
    return Date.now() - this._checkpoint < this._timeout;
  }

  makeCheckpoint(): void {
    this._checkpoint = Date.now();
  }

  resetCheckpoint(): void {
    this._checkpoint = 0;
  }
}
