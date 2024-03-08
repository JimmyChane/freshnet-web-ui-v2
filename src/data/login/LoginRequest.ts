import { serverRequest } from "@/data/server/Server";

export class LoginRequest {
  static login(body: any): Promise<any> {
    return serverRequest()
      .POST()
      .path("session/login/")
      .bodyJson(body)
      .sendJson();
  }
  static user(token: string): Promise<any> {
    return serverRequest()
      .POST()
      .path("session/verifyToken/")
      .bodyJson({ token })
      .sendJson();
  }
  static updatePassword(
    username: string,
    passwordVerify: string,
    passwordNew: string,
  ): Promise<any> {
    return serverRequest()
      .POST()
      .path(`session/user/${username}/changePassword`)
      .bodyJson({ passwordVerify, passwordNew })
      .sendJson();
  }
}
