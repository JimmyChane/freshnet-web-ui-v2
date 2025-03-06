import { IconModel } from '@/model/Icon.model';
import { trimId } from '@/utils/U';
import { isObjectOnly, optArray, optObject } from '@/utils/U';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  url: string;
  method: HttpMethod;
  headers: Record<string, any>;
  body?: BodyInit | null;
}
class Request {
  private bind: RequestOptions = {
    url: '',
    method: 'GET',
    headers: {},
    body: undefined,
  };

  serverUrl: string;

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  GET(): this {
    return this.method('GET');
  }
  POST(): this {
    return this.method('POST');
  }
  PUT(): this {
    return this.method('PUT');
  }
  DELETE(): this {
    return this.method('DELETE');
  }

  private method(method: HttpMethod): this {
    this.bind.method = method;
    return this;
  }

  headers(headers: HeadersInit): this {
    this.bind.headers = headers;
    return this;
  }

  private contentTypeJson(): this {
    if (
      typeof this.bind.headers === 'object' ||
      Array.isArray(this.bind.headers)
    ) {
      this.bind.headers = {};
    }
    this.bind.headers['Content-Type'] = 'application/json;charset=UTF-8';
    return this;
  }

  path(path: string): this {
    this.bind.url = `${this.serverUrl}/${path}`;
    return this;
  }

  bodyJson(body: any): this {
    this.bind.body = JSON.stringify(body);
    return this;
  }

  body(body: any): this {
    this.bind.body = body;
    return this;
  }

  async sendJson(): Promise<Response> {
    this.contentTypeJson();
    return this.send();
  }

  async send(): Promise<Response> {
    const url = this.bind.url;
    const method = this.bind.method;
    const headers = this.bind.headers;
    const body = this.bind.body;

    const token = window.localStorage.getItem('userToken');
    if (token !== null) {
      headers.authorization = window.localStorage.getItem('userToken');
    }

    const response = await fetch(url, { method, headers, body });
    const json = await response.json();
    const hostResponse: Response = new Response(json);
    const hostError = hostResponse.getError();

    if (hostError) {
      throw new Error(hostError);
    }
    return hostResponse;
  }
}
class Response {
  private apiJson: any = null;

  constructor(apiJson: any) {
    this.apiJson = apiJson;
  }

  getError(): string | null {
    return this.apiJson.error;
  }

  getErrorFriendly(): string | null {
    return this.apiJson.friendlyError;
  }

  getContent(): any {
    const error = this.getError();
    const friendlyError = this.getErrorFriendly();
    if (error) {
      if (friendlyError) {
        throw new Error(friendlyError);
      } else {
        throw new Error(error);
      }
    }
    return this.optContent();
  }

  optContent(): any {
    return this.apiJson.content;
  }

  getArrayContent(): any[] {
    const content = this.getContent();
    if (!Array.isArray(content)) {
      throw new Error('content not array');
    }
    return content;
  }

  optArrayContent(): any[] | undefined {
    const content = this.getContent();
    return optArray(content) ? content : undefined;
  }

  getObjectContent(): object {
    const content = this.getContent();
    if (Array.isArray(content)) throw new Error('content array');
    if (typeof content !== 'object') throw new Error('content not object');
    if (content === undefined) throw new Error('content undefined');
    if (content === null) throw new Error('content null');
    return content;
  }

  optObjectContent(): object | undefined {
    const content = this.getContent();
    if (Array.isArray(content) || !isObjectOnly(content)) {
      return {};
    }
    return optObject(content);
  }

  getStringContent(): string {
    const content = this.getContent();
    if (typeof content !== 'string') {
      throw new Error('content not string');
    }
    return content;
  }

  optStringContent(): string | undefined {
    const content = this.getContent();
    return typeof content === 'string' ? content : undefined;
  }
}

export function getOriginApi(): string {
  return import.meta.env.VITE_HOST_API;
}
export function serverIcon(name: string = '', ext: string = 'svg'): IconModel {
  return new IconModel(name, ext);
}
export function serverRes(path: string): string {
  return `${import.meta.env.VITE_HOST_RES}/${path}`;
}
export function serverCloudinary(param: { url: string } = { url: '' }): string {
  let { url } = param;
  url = trimId(url);
  if (url === '') return '';
  return `${import.meta.env.VITE_CLOUDINARY_RES}/${url}`;
}
export function serverRequest(): Request {
  return new Request(import.meta.env.VITE_HOST_API);
}
