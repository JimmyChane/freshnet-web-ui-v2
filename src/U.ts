import chroma from "chroma-js";
import type { IconPack } from "./data/icon-pack/IconPack";
import { Icon } from "./data/icon/Icon";
import { serverIcon } from "./data/server/Server";
import type { User } from "./data/user/User";
import { NavViewGroup } from "./stores/page.store";

export interface Parse {
  key: string;
  value: any;
}

export function isObjectOnly(obj: any): boolean {
  return typeof obj === "object" && obj;
}

export function optString(str: any, fallback = ""): string {
  return typeof str === "string" ? str : fallback;
}
export function optNumber(num: any, fallback = 0): number {
  return typeof num === "number" ? num : fallback;
}
export function optBoolean(bool: any, fallback = false): boolean {
  return typeof bool === "boolean" ? bool : fallback;
}
export function optArray<T>(arr: T[] | undefined, fallback: T[] = []): T[] {
  if (arr === undefined) return fallback;
  return Array.isArray(arr) ? arr : fallback;
}
export function optObject(obj: any, fallback = {}): {} {
  return isObjectOnly(obj) ? obj : fallback;
}
export function optObjectOnly(obj: any, fallback = {}): {} {
  return isObjectOnly(obj) ? obj : fallback;
}

export function trimId(str: any): string {
  return replaceStringAll(str, " ", "");
}
export function trimText(str: any): string {
  return replaceStringAll(str, "  ", " ").trim();
}
export function trimStringAll(str = "", fallback = ""): string {
  str = trimText(str);
  return str.length ? str : fallback;
}
export function replaceStringAll(str = "", regex = "", replace = ""): string {
  str = optString(str);
  regex = optString(regex);
  replace = optString(replace);

  if (regex === replace) return str;

  while (str.includes(regex)) {
    str = str.replace(regex, replace);
  }

  return str;
}

export function isColorDark(color: any, threshold = 60): boolean {
  return chroma.deltaE(color, "000000") < threshold;
}

export function copyText(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  // @ts-ignore
  textarea.style = { position: "absolute", left: "-9999px" };
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}
export function openLink(link: string, target = "_blank") {
  const a = document.createElement("a");
  // @ts-ignore
  a.style = {
    position: "absolute",
    opacity: "0",
    "pointer-events": "none",
  };
  a.href = link;
  a.target = target;
  a.dispatchEvent(
    new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: false,
    }),
  );
  a.remove();
}
export function pushDownload(filename: string, content: any) {
  const element = document.createElement("a");
  element.href = `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`;
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function isValidKey(key: string | any): boolean {
  return typeof key === "string" && !key.includes(" ");
}
export function isValidValue(value: any): boolean {
  return value !== null && value !== undefined && value !== "";
}
export function replace(
  currentQuery: Record<string, any>,
  pendingQuery?: Record<string, any>,
) {
  const nextQueries = objectToArray(currentQuery);
  const pendingQueries = objectToArray(pendingQuery);
  let isChanged = false;

  for (const pendingQuery of pendingQueries) {
    if (!isObjectOnly(pendingQuery)) continue;

    const { key, value } = pendingQuery;
    if (!isValidKey(key)) continue;

    const nextQuery = nextQueries.find((nextQuery) => {
      return nextQuery.key === key;
    });

    if (!nextQuery) {
      nextQueries.push({ key, value });
      isChanged = true;
      continue;
    }

    if (nextQuery.value !== pendingQuery.value) {
      nextQuery.value = pendingQuery.value;
      isChanged = true;
      continue;
    }

    if (!isValidValue(nextQuery.value)) {
      nextQueries.splice(nextQueries.indexOf(nextQuery), 1);
      isChanged = true;
      continue;
    }
  }

  if (!isChanged) return;

  return nextQueries
    .filter((nextQuery) => {
      return isValidKey(nextQuery.key) && isValidValue(nextQuery.value);
    })
    .reduce((query: Record<string, any>, nextQuery) => {
      query[nextQuery.key] = nextQuery.value;
      return query;
    }, {});
}

export function textContains(text: string = "", keyword: string = ""): boolean {
  return (
    typeof text === "string" &&
    text.toLowerCase().replace(" ", "").includes(keyword)
  );
}

export function objectToArray<T>(object: Record<string, T> | any): Parse[] {
  return Object.keys(typeof object === "object" ? object : {}).map((key) => {
    return {
      key,
      value: object[key],
    };
  });
}

export interface IconAsset {
  light: string;
  dark: string;
}
export interface GroupAsset {
  key: string;
  title: string;
  icon?: IconPack;
  values?: any[];
  children?: GroupAsset[];
  userPermissions?: string[];
}

export function isPassed(user: User, permissions: any[] | any) {
  permissions = Array.isArray(permissions) ? permissions : [];

  if (permissions.length > 0) {
    if (user.isTypeAdmin() && !permissions.includes("admin")) return false;
    if (user.isTypeStaff() && !permissions.includes("staff")) return false;
  }

  return true;
}
export function parseIcon(icon: Record<string, Icon> | any): IconAsset | null {
  if (!isObjectOnly(icon)) return null;

  const light =
    icon.light instanceof Icon
      ? icon.light.toUrl()
      : serverIcon(icon.light).toUrl();
  const dark =
    icon.dark instanceof Icon
      ? icon.dark.toUrl()
      : serverIcon(icon.dark).toUrl();

  return { light, dark };
}
export function parseKey(str: string | any) {
  return optString(str).trim().replace(" ", "");
}
export function parseGroup2s(array: GroupAsset[]): NavViewGroup[] {
  return optArray(array).map((obj: GroupAsset) => {
    const navViewGroup = new NavViewGroup()
      .setKey(obj.key)
      .setTitle(obj.title)
      .setIcon(obj.icon)
      .setChildren(obj.children);
    if (obj.values) navViewGroup.setValues(obj.values);
    if (obj.userPermissions)
      navViewGroup.setUserPermissions(obj.userPermissions);

    return navViewGroup;
  });
}

function parseOrigin(protocol: string, hostname: string, port: string) {
  port = parsePort(port);
  return port === "80"
    ? `${protocol}//${hostname}`
    : `${protocol}//${hostname}:${port}`;
}
function getClientProtocol(): string {
  return window.location.protocol;
}
function getClientHostname(): string {
  return window.location.hostname;
}
function getClientPort(): string {
  return window.location.port;
}
function parsePort(port: string | any): string {
  if (typeof port !== "number") port = Number.parseInt(port);
  if (Number.isNaN(port)) port = 80;
  return `${port}`;
}

export function getOrigin() {
  return parseOrigin(getClientProtocol(), getClientHostname(), getClientPort());
}
