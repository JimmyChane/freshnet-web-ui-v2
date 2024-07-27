import { TimeNowGetter } from '@/data/TimeNowGetter';
import { defineStore } from 'pinia';
import { defineAsyncComponent, ref } from 'vue';
import type { PopupWindow, PopupWindowOption, RemovePopupWindowOption } from './PopupWindow';
import type { WindowRemoveOption } from '@/components/window/WindowRemove';

const WindowRemove = defineAsyncComponent(() => import('@/components/window/WindowRemove.vue'));

export const usePopupWindowStore = defineStore('popupWindow', () => {
  const keyGetter = new TimeNowGetter();

  const items = ref<any[]>([]);
  function open<T>(option: PopupWindowOption<T>) {
    const popupWindow: PopupWindow<T> = {
      data: option.data === undefined ? (undefined as any) : option.data,
      component: option.component,

      key: keyGetter.get(),
      isShowing: false,
      isClosing: false,

      open: () => {
        if (popupWindow.isShowing) return;
        if (popupWindow.isClosing) return;
        popupWindow.isShowing = true;

        if (popupWindow.onOpened) {
          popupWindow.onOpened(popupWindow);
        }
      },
      close: () => {
        if (!popupWindow.isShowing) return;
        if (popupWindow.isClosing) return;
        popupWindow.isClosing = true;

        setTimeout(() => {
          popupWindow.isShowing = false;
          if (popupWindow.onClosed) {
            popupWindow.onClosed(popupWindow);
          }
          setTimeout(() => {
            const index = items.value.indexOf(popupWindow);
            items.value.splice(index, 1);
          }, 300);
        }, 300);
      },
    };

    items.value.push(popupWindow);

    setTimeout(() => popupWindow.open(), 300);

    return popupWindow;
  }

  function openWindowRemove(option: RemovePopupWindowOption) {
    const popupWindow = open<WindowRemoveOption>({
      component: WindowRemove,
      data: {
        title: option.title,
        message: option.message,
        data: option.data,
        onConfirm: () => {
          option.onConfirm();
        },
      },
      onClosed: option.onClosed,
      onOpened: option.onOpened,
    });

    return popupWindow;
  }

  return {
    items,
    open,
    openWindowRemove,
  };
});
