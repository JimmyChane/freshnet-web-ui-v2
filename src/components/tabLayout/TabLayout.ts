export interface Tab {
  key: string;
  title: string;
  icon?: string;
  count: number;
  primaryColor?: string;
  primaryColorTint?: string;

  click?: (tab: this) => void;
  isSelected?: (tab: this) => boolean;
}
