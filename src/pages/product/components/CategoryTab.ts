export interface TabMenu {
  title: string;
  icon?: string;
  background?: string;
  count?: number;
  isSelected: (tab: this) => void;
  click: (tab: this) => void;
}
