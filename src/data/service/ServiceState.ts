import IconPendingWhite from "@/assets/icon/pending-white.svg";
import IconPendingColor from "@/assets/icon/pending-color.svg";
import IconWaitingWhite from "@/assets/icon/waiting-white.svg";
import IconWaitingColor from "@/assets/icon/waiting-color.svg";
import IconCompletedWhite from "@/assets/icon/completed-white.svg";
import IconCompletedColor from "@/assets/icon/completed-color.svg";
import IconRejectedWhite from "@/assets/icon/rejected-white.svg";
import IconRejectedColor from "@/assets/icon/rejected-color.svg";

export class ServiceState {
  static PENDING = new ServiceState(
    "pending",
    "Working",
    { white: IconPendingWhite, color: IconPendingColor },
    "#f4a60d",
  );
  static WAITING = new ServiceState(
    "waiting",
    "Waiting for Pickup",
    { white: IconWaitingWhite, color: IconWaitingColor },
    "#c336d9",
  );
  static COMPLETED = new ServiceState(
    "completed",
    "Finished & Pickup",
    { white: IconCompletedWhite, color: IconCompletedColor },
    "#25ad86",
  );
  static REJECTED = new ServiceState(
    "rejected",
    "Rejected & Pickup",
    { white: IconRejectedWhite, color: IconRejectedColor },
    "#d94136",
  );

  private static readonly LIST = [
    ServiceState.PENDING,
    ServiceState.WAITING,
    ServiceState.COMPLETED,
    ServiceState.REJECTED,
  ];

  static findByKey(key: string): ServiceState | undefined {
    return this.LIST.find((state) => state.key === key);
  }
  static indexOfKey(key: string): number {
    const state = this.findByKey(key);
    if (state === undefined) return -1;
    return this.LIST.indexOf(state);
  }
  static map(call: (state: ServiceState) => any): any[] {
    return this.LIST.map(call);
  }
  static count(): number {
    return this.LIST.length;
  }

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
