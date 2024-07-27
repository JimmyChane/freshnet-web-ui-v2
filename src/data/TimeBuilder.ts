export function getString(time: number): string {
  const timeStr = time.toString();
  return timeStr.length == 1 ? `0${timeStr}` : timeStr;
}
export function getCurrent(separator: string = ''): string {
  const now = new Date();

  const year = now.getUTCFullYear();
  const month = getString(now.getUTCMonth() + 1);
  const date = getString(now.getUTCDate());
  const hour = getString(now.getUTCHours() + 1);
  const minute = getString(now.getUTCMinutes() + 1);
  const second = getString(now.getUTCSeconds() + 1);

  return `${year}${separator}${month}${separator}${date}${separator}${hour}${separator}${minute}${separator}${second}`;
}
