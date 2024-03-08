export enum Width {
  AUTO = 0,
  MIN = 1,
  MAX = 2,
  SAME = 3,
}
export enum Corner {
  AUTO = 0,

  TOP = 1,
  RIGHT = 2,
  BOTTOM = 3,
  LEFT = 4,

  TOP_LEFT = 5,
  TOP_RIGHT = 6,
  BOTTOM_LEFT = 7,
  BOTTOM_RIGHT = 8,
}
export enum Alignment {
  AUTO = 0,
  DIANGLE = 1,
  VERTICAL = 2,
  HORIZONTAL = 3,
}

export interface PopupMenu {
  key: number;
  anchor: HTMLElement;
  menus: any[];
  option: any;
  isShowing: boolean;
  isClosing: boolean;

  hide: () => void;
}

export interface Menu {
  key?: string;
  icon?: any;
  title?: string;
  href?: string;
  target?: string;
  to?: any;
  color?: string;
  click?: (menu: this) => void;
  interact?: () => void;
  isHidden?: boolean;
  isSelected?: () => boolean;
}
