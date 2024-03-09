<script setup lang="ts">
  import {
    Width,
    Corner,
    Alignment,
    type Menu,
  } from "@/stores/popup-menu/PopupMenu";
  import { usePopupMenuStore } from "@/stores/popup-menu/popup-menu.store";
  import { computed, ref, watch } from "vue";

  const emits = defineEmits<{
    mouseover: [MouseEvent];
    mouseleave: [MouseEvent];
    show: [void];
    hide: [void];
  }>();
  const props = withDefaults(
    defineProps<{
      width?: Width;
      corner?: Corner;
      alignment?: Alignment;

      menus?: Menu[];
      primaryColor?: string;
    }>(),
    {
      width: Width.AUTO,
      corner: Corner.AUTO,
      alignment: Alignment.AUTO,
    },
  );

  const popupMenu = ref();

  const isShowing = computed(() => {
    return popupMenu.value.isShowing;
  });

  const refSelf = ref<HTMLButtonElement>();

  watch(
    () => isShowing.value,
    (value) => {
      value ? emits("show") : emits("hide");
    },
  );

  function toggle() {
    if (isShowing.value) hide();
    else show();
  }
  async function show() {
    if (popupMenu.value) popupMenu.value.hide();

    const xMenus = Array.isArray(props.menus)
      ? props.menus
      : typeof props.menus === "object" && props.menus
      ? [props.menus]
      : [];

    for (const menu of xMenus) {
      const isLegacy =
        typeof menu.click !== "function" && typeof menu.interact === "function";
      if (isLegacy) menu.click = menu.interact;
    }

    popupMenu.value = await usePopupMenuStore().show({
      anchor: refSelf.value,
      menus: xMenus,
      option: {
        width: props.width,
        corner: props.corner,
        alignment: props.alignment,
        primaryColor: props.primaryColor,
      },
    });
  }
  function hide() {
    if (!popupMenu.value) return;
    popupMenu.value.hide();
  }
</script>

<template>
  <button
    ref="refSelf"
    class="Menu transition"
    @mouseover="(x) => emits('mouseover', x)"
    @mouseleave="(x) => emits('mouseleave', x)"
    @click="() => toggle()"
    @blur="() => hide()"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
  .Menu {
    background: none;
    border: none;
    cursor: pointer;
  }
</style>
