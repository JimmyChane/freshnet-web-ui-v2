import { serverRequest } from "@/data/server/Server";

export class CategoryRequest {
  static list(): Promise<any> {
    return serverRequest().path("productv2/category/list/").sendJson();
  }
}
