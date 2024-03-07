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
