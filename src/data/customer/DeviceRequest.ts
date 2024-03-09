import { serverRequest } from "@/data/server/Server";

export class DeviceRequest {
  static list(): Promise<any> {
    return serverRequest().path("customer/device/list").sendJson();
  }
  static add(body: any): Promise<any> {
    return serverRequest()
      .POST()
      .path("customer/device/add")
      .bodyJson(body)
      .sendJson();
  }
  static remove(body: any): Promise<any> {
    return serverRequest()
      .DELETE()
      .path("customer/device/remove")
      .bodyJson(body)
      .sendJson();
  }
  static updateSpecification(body: any): Promise<any> {
    return serverRequest()
      .PUT()
      .path("customer/device/update/specifications")
      .bodyJson(body)
      .sendJson();
  }
  static updateDescription(body: any): Promise<any> {
    return serverRequest()
      .PUT()
      .path("customer/device/update/description")
      .bodyJson(body)
      .sendJson();
  }
}
