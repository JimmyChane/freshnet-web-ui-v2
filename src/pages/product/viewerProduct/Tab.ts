export interface Tab {
  key: string;
  title: string;
  isSelected?: () => boolean;
}
