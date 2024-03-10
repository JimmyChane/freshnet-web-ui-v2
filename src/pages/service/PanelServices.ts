export interface LayoutMenu {
  key: string;
  title: string;
  icon: string;
  click?: (menu: this) => void;
}
export interface GroupMenu {
  key: string;
  title: string;
  click?: (menu: this) => void;
  isSelected?: () => boolean;
}
export interface SortMenu {
  key: string;
  title: string;
  click?: (menu: this) => void;
  isSelected?: () => boolean;
}
