import { serverRequest } from "@/data/server/Server";

export class SpecificationRequest {
  static list(): Promise<any> {
    return serverRequest().path("spec/").sendJson();
  }
}
