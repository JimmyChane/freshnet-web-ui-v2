export interface WindowChangeOption<T = any> {
  title?: string;
  message?: string;
  data?: T;
  onConfirm: () => void;
}
