import { serverRequest } from "@/data/server/Server";

export default class UserRequest {
  static list(): Promise<any> {
    return serverRequest().path("users").sendJson();
  }
  static add(
    username: string,
    name: string,
    passwordNew: string,
    passwordRepeat: string,
  ): Promise<any> {
    return serverRequest()
      .path("users/user")
      .POST()
      .bodyJson({ username, name, passwordNew, passwordRepeat })
      .sendJson();
  }
  static remove(username: string): Promise<any> {
    return serverRequest()
      .DELETE()
      .path("users/user")
      .bodyJson({ username })
      .sendJson();
  }
  static update(username: string, userType: string): Promise<any> {
    return serverRequest()
      .path("users/user")
      .PUT()
      .bodyJson({ username, userType })
      .sendJson();
  }
}
