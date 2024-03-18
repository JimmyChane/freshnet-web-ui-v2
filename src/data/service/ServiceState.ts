import IconPendingWhite from "@/assets/icon/pending-white.svg";
import IconPendingColor from "@/assets/icon/pending-color.svg";
import IconWaitingWhite from "@/assets/icon/waiting-white.svg";
import IconWaitingColor from "@/assets/icon/waiting-color.svg";
import IconCompletedWhite from "@/assets/icon/completed-white.svg";
import IconCompletedColor from "@/assets/icon/completed-color.svg";
import IconRejectedWhite from "@/assets/icon/rejected-white.svg";
import IconRejectedColor from "@/assets/icon/rejected-color.svg";

export class ServiceState {
  key: string;
  title: string;
  icon: { white: string; color: string };
  primaryColor: string;

  constructor(
    key: string = "",
    title: string = "",
    icon: { white: string; color: string } = { white: "", color: "" },
    primaryColor: string = "",
  ) {
    this.key = key;
    this.title = title;
    this.icon = icon;
    this.primaryColor = primaryColor;
  }
}

export const PENDING = new ServiceState(
  "pending",
  "Working",
  { white: IconPendingWhite, color: IconPendingColor },
  "#f4a60d",
);
export const WAITING = new ServiceState(
  "waiting",
  "Waiting for Pickup",
  { white: IconWaitingWhite, color: IconWaitingColor },
  "#c336d9",
);
export const COMPLETED = new ServiceState(
  "completed",
  "Finished & Pickup",
  { white: IconCompletedWhite, color: IconCompletedColor },
  "#25ad86",
);
export const REJECTED = new ServiceState(
  "rejected",
  "Rejected & Pickup",
  { white: IconRejectedWhite, color: IconRejectedColor },
  "#d94136",
);

const LIST = [PENDING, WAITING, COMPLETED, REJECTED];

export function findByKey(key: string): ServiceState | undefined {
  return LIST.find((state) => state.key === key);
}
export function indexOfKey(key: string): number {
  const state = findByKey(key);
  if (state === undefined) return -1;
  return LIST.indexOf(state);
}
export function map(call: (state: ServiceState) => any): any[] {
  return LIST.map(call);
}
export function count(): number {
  return LIST.length;
}
