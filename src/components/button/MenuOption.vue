<script setup lang="ts">
  import { computed } from "vue";
  import MenuIcon from "@/components/menu/MenuIcon.vue";
  import chroma from "chroma-js";

  import IconOptionLight from "@/assets/icon/option-FFFFFF.svg";
  import IconOptionDark from "@/assets/icon/option-000000.svg";
  import type { Menu } from "@/stores/popup-menu/PopupMenu";
  import { isColorDark } from "@/U";

  const props = withDefaults(
    defineProps<{
      menus?: Menu[];
      primaryColor: chroma.Color;
    }>(),
    {
      primaryColor: () => chroma("ffffff"),
    },
  );

  const isDark = computed(() => isColorDark(props.primaryColor, 60));
</script>

<template>
  <MenuIcon
    :menus="menus"
    :src="isDark ? IconOptionLight : IconOptionDark"
    @show="() => $emit('show')"
    @hide="() => $emit('hide')"
  />
</template>
