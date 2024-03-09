import { serverRequest } from "@/data/server/Server";

export class BrandRequest {
  static list(): Promise<any> {
    return serverRequest().path("brand/").sendJson();
  }
}
