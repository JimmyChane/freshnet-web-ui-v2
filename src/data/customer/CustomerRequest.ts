import { serverRequest } from "@/data/server/Server";

interface CustomerContent {
  _id?: string;
  name?: string;
  phoneNumber?: string;
  description?: string;
}

export class CustomerRequest {
  static list(): Promise<any> {
    return serverRequest().path("customer/list").sendJson();
  }

  static add(content: CustomerContent = {}): Promise<any> {
    return serverRequest()
      .POST()
      .path("customer/add")
      .bodyJson({ content })
      .sendJson();
  }

  static remove(id: string = ""): Promise<any> {
    return serverRequest()
      .DELETE()
      .path("customer/remove")
      .bodyJson({ content: { _id: id } })
      .sendJson();
  }

  static updateNamePhoneNumber(
    id: string = "",
    name: string = "",
    phoneNumber: string = "",
  ): Promise<any> {
    return serverRequest()
      .PUT()
      .path("customer/update/namePhoneNumber")
      .bodyJson({ content: { _id: id, name, phoneNumber } })
      .sendJson();
  }

  static updateDescription(
    id: string = "",
    description: string = "",
  ): Promise<any> {
    return serverRequest()
      .PUT()
      .path("customer/update/description")
      .bodyJson({ content: { id, description } })
      .sendJson();
  }
}
