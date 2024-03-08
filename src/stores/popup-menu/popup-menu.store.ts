import { defineStore } from "pinia";
import { ref } from "vue";
import { TimeNowGetter } from "@/data/TimeNowGetter";
import { type Menu, type PopupMenu, Width, Corner } from "./PopupMenu";

export const usePopupMenuStore = defineStore("popupMenu", () => {
  const keyGetter = new TimeNowGetter();

  const popupMenus = ref<any[]>([]);
  function popupMenuShow(
    arg: {
      anchor: any;
      menus: Menu[];
      option: {
        width?: number;
        corner?: number;
        alignment?: number;
        primaryColor?: string;
      };
    } = {
      anchor: null,
      menus: [],
      option: {
        width: Width.AUTO,
        corner: Corner.AUTO,
        primaryColor: undefined,
      },
    },
  ) {
    const { anchor, menus = [], option = {} } = arg;

    const popupMenu: PopupMenu = {
      key: keyGetter.get(),
      anchor,
      menus,
      option,
      isShowing: true,
      isClosing: false,

      hide: () => {
        if (popupMenu.isClosing) return;
        popupMenu.isClosing = true;

        setTimeout(() => {
          popupMenu.isShowing = false;
          setTimeout(() => {
            const index = popupMenus.value.indexOf(popupMenu);
            popupMenus.value.splice(index, 1);
          }, 300);
        }, 300);
      },
    };

    popupMenus.value.push(popupMenu);

    return popupMenu;
  }

  return {
    popupMenus,
    popupMenuShow,
  };
});
