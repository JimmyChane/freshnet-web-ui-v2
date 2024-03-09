import { serverRequest } from "@/data/server/Server";

export class DatabaseRequest {
  static info(): Promise<any> {
    return serverRequest().POST().path("database/info").sendJson();
  }

  static databases(): Promise<any> {
    return serverRequest().POST().path("database/databases").sendJson();
  }

  static collections(database: string): Promise<any> {
    return serverRequest()
      .POST()
      .path(`database/database/${database}/collections`)
      .sendJson();
  }

  static documents(database: string, collection: string): Promise<any> {
    return serverRequest()
      .POST()
      .path(`database/database/${database}/collection/${collection}/documents`)
      .sendJson();
  }

  static import(body: any): Promise<any> {
    return serverRequest()
      .POST()
      .path("database/imports")
      .bodyJson(body)
      .sendJson();
  }

  static export(database: string): Promise<any> {
    return serverRequest()
      .path(`database/database/${database}/exportv2`)
      .sendJson();
  }
}
