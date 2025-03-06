export function url(
  name: string = '',
  ext: string | undefined = undefined,
): string {
  return new IconModel(name, ext).toUrl();
}

export class IconModel {
  private name: string = '';
  private ext?: string = undefined;

  constructor(name: string = '', ext: string | undefined = undefined) {
    if (typeof name === 'string') this.name = name;
    if (typeof ext === 'string') this.ext = ext;
  }

  toUrl(): string {
    const filename =
      typeof this.ext !== 'string' ? this.name : `${this.name}.${this.ext}`;
    return `${import.meta.env.VITE_HOST_RES}/icon/${filename}`;
  }
  toName(): string {
    return this.name;
  }
}
