import { type Component } from 'vue';

export interface PopupWindowOption<T = any> {
  data?: T;
  component: Component;
  onOpened?: (popupWindow: this) => void;
  onClosed?: (popupWindow: this) => void;
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
