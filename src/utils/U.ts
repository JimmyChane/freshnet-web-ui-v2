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
