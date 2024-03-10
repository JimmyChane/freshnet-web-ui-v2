<script setup lang="ts">
  import chroma, { type Color } from "chroma-js";
  import { computed, ref } from "vue";
  import { State } from "./WindowAddEvent-LabelMenus";

  interface Menu {
    key: string;
    title: string;
    icon: string;
    click?: (menu: this) => void;
  }

  const props = withDefaults(
    defineProps<{
      primaryColor?: Color;
      menu?: Menu;
      menus?: Menu[];
    }>(),
    { primaryColor: () => chroma("2ead87"), menus: () => [] },
  );
  const state = ref(State.Collapse);

  const parsedMenus = computed(() => {
    const menus = Array.isArray(props.menus) ? props.menus : [props.menus];
    return menus.filter((menu) => {
      return typeof menu === "object" && menu !== null;
    });
  });
  const isExpand = computed(() => state.value === State.Expand);

  const menuKey = computed(() => props.menu?.key ?? "");
  const menuTitle = computed(() => props.menu?.title ?? "");
  const menuIcon = computed(() => props.menu?.icon ?? "");

  const primaryColorBackground = ref(() =>
    props.primaryColor.mix("ffffff", 0.8),
  );
  const primaryColorBackgroundHover = ref(() =>
    props.primaryColor.mix("ffffff", 0.6),
  );
  const primaryColorBackgroundSelected = ref(() =>
    props.primaryColor.mix("ffffff", 0.4),
  );

  function toggle() {
    isExpand.value ? collapse() : expand();
  }
  function expand() {
    state.value = State.Expand;
  }
  function collapse(timeout = 0) {
    if (timeout > 0) {
      setTimeout(() => collapse(), timeout);
      return;
    }
    state.value = State.Collapse;
  }
</script>

<template>
  <div
    :class="[
      'LabelMenus',
      `LabelMenus-${isExpand ? 'isExpand' : 'isCollapse'}`,
    ]"
    :style="{ '--primary-color': primaryColor.toString() }"
  >
    <button
      class="LabelMenus-main"
      @click="() => toggle()"
      @blur="() => collapse(200)"
    >
      <span class="LabelMenus-content">
        <img class="LabelMenus-content-icon" v-if="menuIcon" :src="menuIcon" />
        {{ menuTitle }}</span
      >
      <img
        class="LabelMenus-arrow transition"
        src="@/assets/icon/arrowDown-FFFFFF.svg"
      />
    </button>

    <div
      class="LabelMenus-menus scrollbar transition"
      :style="{ 'background-color': primaryColorBackground.toString() }"
    >
      <button
        class="LabelMenus-menu transition"
        :style="{
          '--background-color-hover': primaryColorBackgroundHover.toString(),
          '--background-color-selected':
            primaryColorBackgroundSelected.toString(),
        }"
        :key="menu.title"
        v-for="menu in parsedMenus"
        :class="[
          menu.key === menuKey
            ? 'LabelMenus-menu-isSelected'
            : 'LabelMenus-menu-isDeselected',
        ]"
        @click="
          () => {
            if (typeof menu.click === 'function') menu.click(menu);
          }
        "
      >
        <img
          class="LabelMenus-menu-icon"
          v-if="menu.icon"
          :src="menu.icon ? menu.icon : ''"
        />
        <span>{{ menu.title }}</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .LabelMenus {
    --primary-color: #2ead87;

    width: max-content;
    position: relative;
    overflow: visible;
    border-radius: 2rem 0 0 2rem;
    margin: -1px;

    .LabelMenus-main {
      width: max-content;
      height: 100%;
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

      .LabelMenus-content {
        min-width: max-content;
        background: var(--primary-color);
        padding: 0.4rem 1.2rem;
        font-size: 0.8rem;
        font-weight: 600;
        border-radius: 2rem 0 0 2rem;
        color: white;
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

    .LabelMenus-menus {
      z-index: 2;
      width: max-content;
      min-width: 100%;
      max-height: 25rem;
      display: flex;
      flex-direction: column;

      overflow-y: auto;
      position: absolute;
      background: white;
      transform: translateY(-1.25rem);
      border-radius: 0.2rem;
      --transition-timing: cubic-bezier(1, 0, 0, 1);
      padding: 0.625rem 0;
      box-shadow: 0 0 0.625rem 0 hsla(0, 0%, 30%, 0.7);

      --scrollbar-size: 0.3rem;
      --scrollbar-thumb-color: hsla(0, 0%, 0%, 0.2);
      --scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.2);
      --scrollbar-track-color: hsla(0, 0%, 0%, 0.08);
      --scrollbar-track-color-hover: hsla(0, 0%, 0%, 0.1);

      .LabelMenus-menu {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;

        row-gap: 0.1;
        column-gap: 0.5rem;
        padding: 0.8rem 1.2rem;
        border: none;
        background: none;
        text-align: start;
        font-size: 0.8rem;
        font-weight: 600;

        --background-color-hover: hsl(0, 0%, 90%);
        --background-color-selected: hsl(0, 0%, 70%);

        .LabelMenus-menu-icon {
          height: 12px;
        }
      }

      .LabelMenus-menu-isSelected {
        background: var(--background-color-selected);
      }
      .LabelMenus-menu-isDeselected {
        cursor: pointer;
        &:hover,
        &:focus {
          background: var(--background-color-hover);
        }
      }
    }
  }
  .LabelMenus-isExpand {
    .LabelMenus-main {
      .LabelMenus-arrow {
        transform: rotate(360deg);
      }
    }
    .LabelMenus-menus {
      transform: translateY(0.25rem);
      opacity: 1;
    }
  }
  .LabelMenus-isCollapse {
    .LabelMenus-main {
      .LabelMenus-arrow {
        transform: rotate(180deg);
      }
    }
    .LabelMenus-menus {
      transform: translateY(-1.25rem);
      pointer-events: none;
      opacity: 0;
    }
  }
</style>
