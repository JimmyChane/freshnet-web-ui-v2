<script setup lang="ts">
  import Actionbar from "./Actionbar.vue";
  import IconHamburgerMenuLight from "@/assets/icon/hamburgerMenu-FFFFFF.svg";
  import IconHamburgerMenuDark from "@/assets/icon/hamburgerMenu-000000.svg";
  import { computed } from "vue";
  import type { Menu } from "@/stores/popup-menu/PopupMenu";
  import { useNavigationStore } from "@/stores/navigation/navigation.store";

  const props = withDefaults(
    defineProps<{
      title?: string;
      leftMenus?: Menu | Menu[];
      rightMenus?: Menu | Menu[];
      iconTheme?: string;
    }>(),
    {
      title: "",
      leftMenus: () => [],
      rightMenus: () => [],
      iconTheme: "black",
    },
  );

  const navigationStore = useNavigationStore();

  const moreLeftMenus = computed<Menu | Menu[]>((c) => {
    if (!navigationStore.isDrawer()) return props.leftMenus;

    const hamburgerMenuIcon =
      props.iconTheme === "white"
        ? IconHamburgerMenuLight
        : IconHamburgerMenuDark;
    return [
      {
        key: "hamburgerMenu",
        title: "Hamburger Menu",
        icon: hamburgerMenuIcon,
        click: () => navigationStore.openDrawer(),
      },
      ...(Array.isArray(props.leftMenus) ? props.leftMenus : [props.leftMenus]),
    ];
  });
</script>

<template>
  <Actionbar :title="title" :leftMenus="moreLeftMenus" :rightMenus="rightMenus">
    <slot />
  </Actionbar>
</template>
