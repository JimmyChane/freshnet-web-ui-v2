import { type Component } from "vue";

export interface PopupWindowOption<T = any> {
  data?: T;
  component: Component;
  onOpened?: (popupWindow: this) => void;
  onClosed?: (popupWindow: this) => void;
}
export interface RemovePopupWindowOption<T = any> {
  title?: string;
  message?: string;

  data?: T;
  onOpened?: (popupWindow: PopupWindowOption<T>) => void;
  onClosed?: (popupWindow: PopupWindowOption<T>) => void;
  onConfirm: () => void;
}

export interface PopupWindow<T = any> {
  data: T;
  component: Component;
  onOpened?: ((popupWindow: this) => void) | undefined;
  onClosed?: ((popupWindow: this) => void) | undefined;

  key: number;
  isShowing: boolean;
  isClosing: boolean;

  open: () => void;
  close: () => void;
}
