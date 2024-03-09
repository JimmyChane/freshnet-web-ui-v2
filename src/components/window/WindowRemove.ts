export interface WindowRemoveOption<T = any> {
  title?: string;
  message?: string;
  data?: T;
  onConfirm: (accept: () => void, reject: () => void) => void;
}
