import { serverRequest } from "@/data/server/Server";

export class Ps2Request {
  static listDisc(): Promise<any> {
    return serverRequest().path("ps2/disc/").sendJson();
  }
}
