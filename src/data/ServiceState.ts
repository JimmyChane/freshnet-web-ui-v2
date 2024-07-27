import IconPendingWhite from '@/assets/icon/pending-white.svg';
import IconPendingColor from '@/assets/icon/pending-color.svg';
import IconWaitingWhite from '@/assets/icon/waiting-white.svg';
import IconWaitingColor from '@/assets/icon/waiting-color.svg';
import IconCompletedWhite from '@/assets/icon/completed-white.svg';
import IconCompletedColor from '@/assets/icon/completed-color.svg';
import IconRejectedWhite from '@/assets/icon/rejected-white.svg';
import IconRejectedColor from '@/assets/icon/rejected-color.svg';

export enum ServiceStateId {
  PENDING = 'pending',
  WORKING = 'working',
  WAITING = 'waiting',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

export class ServiceState {
  key: ServiceStateId;
  title: string;
  icon: { white: string; color: string };
  primaryColor: string;

  constructor(
    key: ServiceStateId,
    title: string,
    icon: { white: string; color: string } = { white: '', color: '' },
    primaryColor: string,
  ) {
    this.key = key;
    this.title = title;
    this.icon = icon;
    this.primaryColor = primaryColor;
  }
}

export const PENDING = new ServiceState(
  ServiceStateId.PENDING,
  'Working',
  { white: IconPendingWhite, color: IconPendingColor },
  '#f4a60d',
);
export const WAITING = new ServiceState(
  ServiceStateId.WAITING,
  'Waiting for Pickup',
  { white: IconWaitingWhite, color: IconWaitingColor },
  '#c336d9',
);
export const COMPLETED = new ServiceState(
  ServiceStateId.COMPLETED,
  'Finished & Pickup',
  { white: IconCompletedWhite, color: IconCompletedColor },
  '#25ad86',
);
export const REJECTED = new ServiceState(
  ServiceStateId.REJECTED,
  'Rejected & Pickup',
  { white: IconRejectedWhite, color: IconRejectedColor },
  '#d94136',
);

export const LIST: ServiceState[] = [PENDING, WAITING, COMPLETED, REJECTED];

export function findByKey(key: string): ServiceState | undefined {
  return LIST.find((state) => state.key === key);
}
export function indexOfKey(key: ServiceStateId): number {
  const state = findByKey(key);
  if (state === undefined) return -1;
  return LIST.indexOf(state);
}
