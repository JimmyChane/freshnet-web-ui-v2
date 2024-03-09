import { getOriginApi } from "@/data/server/Server";
import { Filename } from "../Filename";
import { Image, type ImageUrlOption } from "../Image";
import { useLoginStore } from "@/stores/login.store";
import { trimId } from "@/U";

export interface ServiceImageData {
  name: string;
  path: string;
  method: string;
  storageType: string;
}

export class ServiceImage {
  name: string = "";
  path: string = "";
  method: string = "";
  storageType: string = "";

  fromData(data: ServiceImageData): this {
    const image = new Image().fromData({
      path: data.path,
      method: data.method,
    });

    this.name = trimId(data.name);
    this.path = image.path;
    this.method = image.method;
    this.storageType = trimId(data.storageType);
    return this;
  }

  toData(): ServiceImageData {
    const image = new Image()
      .fromData({ path: this.path, method: this.method })
      .toData();
    return {
      name: trimId(this.name),
      path: image.path,
      method: image.method,
      storageType: trimId(this.storageType),
    };
  }

  toCount(strs: string[]): number {
    return 0;
  }

  toUrl(option?: ImageUrlOption): string {
    const { width = 0, height = 0 } = option ?? {};

    const { path, method } = this;
    const dimensionQuery = Image.dimensionToQuery(width, height);
    const query = dimensionQuery.length ? `?${dimensionQuery}` : "";

    if (method === Image.Method.StorageImage) {
      const prefix = "/api/image/name/";
      const name = path.substring(prefix.length, path.length);
      const filename = new Filename(name);
      return `${getOriginApi()}/image/name/${filename.toString()}${query}`;
    }

    const filename = new Filename(this.name);
    return `${getOriginApi()}/service_v2/get/image/${filename.toString()}${query}`;
  }

  async toBlob(option: ImageUrlOption): Promise<string> {
    const { width = 0, height = 0 } = option;

    const { token } = useLoginStore();
    const url = this.toUrl({ width, height });
    let options: RequestInit | undefined;
    if (typeof token === "string") {
      options = { headers: { authorization: token } };
    }

    const response = await fetch(url, options);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}
