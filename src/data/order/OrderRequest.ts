import { serverRequest } from "@/data/server/Server";

export class OrderRequest {
  static list(): Promise<any> {
    return serverRequest().path("order/").sendJson();
  }
  static add(body: any): Promise<any> {
    return serverRequest().POST().path("order/").bodyJson(body).sendJson();
  }
  static delete(id: string): Promise<any> {
    return serverRequest().DELETE().path("order/").bodyJson({ id }).sendJson();
  }
  static updateStatus(id: string, status: number): Promise<any> {
    return serverRequest()
      .PUT()
      .path("order/")
      .bodyJson({ id, status })
      .sendJson();
  }
}
