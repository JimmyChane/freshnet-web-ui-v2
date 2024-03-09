<script setup lang="ts">
  enum State {
    Expand = 1,
    Collapse = 2,
  }

  import chroma, { type Color } from "chroma-js";
  import MenuVue from "@/components/menu/Menu.vue";

  import IconArrowDown from "@/assets/icon/arrowDown-505050.svg";
  import { computed, ref } from "vue";
  import type { Menu } from "@/stores/popup-menu/PopupMenu";

  const props = withDefaults(
    defineProps<{
      primaryColor?: Color;
      title?: string;
      menu?: Menu;
      menus?: Menu | Menu[];
    }>(),
    { primaryColor: () => chroma("2ead87"), title: "", menus: () => [] },
  );

  const isExpand = ref(false);

  const menuCorner = computed(() => MenuVue.Corner.BOTTOM);
  const menuWidth = computed(() => MenuVue.Width.SAME);

  const parsedMenus = computed(() => {
    return (Array.isArray(props.menus) ? props.menus : [props.menus])
      .filter((menu) => {
        return typeof menu === "object" && menu !== null;
      })
      .map((menu) => {
        menu.isSelected = () => props.menu === menu;
        return menu;
      });
  });

  const menuKey = computed(() => props.menu?.key ?? "");
  const menuTitle = computed(() => props.menu?.title ?? "");
  const menuIcon = computed(() => props.menu?.icon ?? "");

  const primaryColorBackground = computed(() =>
    props.primaryColor.mix("ffffff", 0.8),
  );
  const primaryColorBackgroundHover = computed(() =>
    props.primaryColor.mix("ffffff", 0.6),
  );
  const primaryColorBackgroundSelected = computed(() =>
    props.primaryColor.mix("ffffff", 0.4),
  );
</script>

<template>
  <div>
    <MenuVue
      :class="[
        'transition',
        'LabelMenus',
        `LabelMenus-${isExpand ? 'isExpand' : 'isCollapse'}`,
      ]"
      :style="{ '--primary-color': primaryColor.toString() }"
      :menus="parsedMenus"
      :corner="menuCorner"
      :width="menuWidth"
      :primaryColor="primaryColor.toString()"
      @show="() => (isExpand = true)"
      @hide="() => (isExpand = false)"
    >
      <span class="LabelMenus-title">{{ title }}</span>
      <span class="LabelMenus-content">
        <img class="LabelMenus-content-icon" v-if="menuIcon" :src="menuIcon" />
        {{ menuTitle }}</span
      >
      <img class="LabelMenus-arrow transition" :src="IconArrowDown" />
    </MenuVue>
  </div>
</template>

<style lang="scss" scoped>
  .LabelMenus {
    --primary-color: #2ead87;
    --border-radius: 1rem;

    width: max-content;
    position: relative;
    overflow: visible;

    width: max-content;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
    justify-content: stretch;
    position: relative;

    z-index: 1;
    border: none;
    background: none;
    cursor: pointer;
    border: 1px solid var(--primary-color);
    border-radius: var(--border-radius);
    --transition-duration: 100ms;
    background: var(--primary-color);

    &:hover,
    &:focus {
      transform: scale(1.02);
    }

    .LabelMenus-title {
      min-width: max-content;
      padding: 0.4rem 0.6rem;
      color: white;
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: var(--border-radius) 0 0 var(--border-radius);
      margin: -1px;
    }
    .LabelMenus-content {
      min-width: max-content;
      background: white;
      padding: 0.4rem 1.2rem;
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: 0 var(--border-radius) var(--border-radius) 0;
      color: black;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;

      .LabelMenus-content-icon {
        height: 12px;
      }
    }
    .LabelMenus-arrow {
      --size: 5px;
      width: var(--size);
      height: var(--size);
      position: absolute;
      top: calc(50% - var(--size) * 0.5);
      bottom: 0;
      right: calc(var(--size) * 1.5);
    }
  }
  .LabelMenus-isExpand {
    .LabelMenus-arrow {
      transform: rotate(360deg);
    }
  }
  .LabelMenus-isCollapse {
    .LabelMenus-arrow {
      transform: rotate(180deg);
    }
  }
</style>
