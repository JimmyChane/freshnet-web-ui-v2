import { serverRequest } from "@/data/server/Server";

export default class SettingRequest {
  static list(): Promise<any> {
    return serverRequest().path("settingv3").sendJson();
  }
  static update(setting: any): Promise<any> {
    return serverRequest()
      .PUT()
      .path("settingv3/system")
      .bodyJson(setting)
      .sendJson();
  }
}
