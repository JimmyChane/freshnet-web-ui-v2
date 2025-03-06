import { IconModel } from '@/model/Icon.model';
import type { IconPackModel } from '@/model/IconPack.model';
import { serverIcon } from '@/model/Server';
import type { UserModel } from '@/model/User.model';

export function isObjectOnly(obj: any): boolean {
  return typeof obj === 'object' && obj;
}

export function optString(str: any, fallback = ''): string {
  return typeof str === 'string' ? str : fallback;
}
export function optNumber(num: any, fallback = 0): number {
  return typeof num === 'number' ? num : fallback;
}
export function optBoolean(bool: any, fallback = false): boolean {
  return typeof bool === 'boolean' ? bool : fallback;
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
  return replaceStringAll(str, ' ', '');
}
export function trimText(str: any): string {
  return replaceStringAll(str, '  ', ' ').trim();
}
export function trimStringAll(str = '', fallback = ''): string {
  str = trimText(str);
  return str.length ? str : fallback;
}
export function replaceStringAll(str = '', regex = '', replace = ''): string {
  str = optString(str);
  regex = optString(regex);
  replace = optString(replace);

  if (regex === replace) return str;

  while (str.includes(regex)) {
    str = str.replace(regex, replace);
  }

  return str;
}

export function textContains(text: string = '', keyword: string = ''): boolean {
  return (
    typeof text === 'string' &&
    text.toLowerCase().replace(' ', '').includes(keyword)
  );
}

export interface IconAsset {
  light: string;
  dark: string;
}
export interface GroupAsset {
  key: string;
  title: string;
  icon?: IconPackModel;
  values?: any[];
  children?: GroupAsset[];
  userPermissions?: string[];
}

export function isPassed(user: UserModel, permissions: any[] | any) {
  permissions = Array.isArray(permissions) ? permissions : [];

  if (permissions.length > 0) {
    if (user.isTypeAdmin() && !permissions.includes('admin')) return false;
    if (user.isTypeStaff() && !permissions.includes('staff')) return false;
  }

  return true;
}
export function parseIcon(
  icon: Record<string, IconModel> | any,
): IconAsset | null {
  if (!isObjectOnly(icon)) return null;

  const light =
    icon.light instanceof IconModel
      ? icon.light.toUrl()
      : serverIcon(icon.light).toUrl();
  const dark =
    icon.dark instanceof IconModel
      ? icon.dark.toUrl()
      : serverIcon(icon.dark).toUrl();

  return { light, dark };
}
export function parseKey(str: string | any) {
  return optString(str).trim().replace(' ', '');
}
