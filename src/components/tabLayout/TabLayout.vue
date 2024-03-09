<script setup lang="ts">
  import { type Tab } from "./TabLayout";
  import TabVue from "./TabLayout-Tab.vue";

  withDefaults(defineProps<{ menus?: Tab[]; isScreenWide?: boolean }>(), {
    menus: () => [],
    isScreenWide: true,
  });
</script>

<template>
  <div :class="['TabLayout', 'scrollbar']">
    <div>
      <TabVue
        v-for="menu of menus"
        :key="menu.title"
        :menu="menu"
        :isScreenWide="isScreenWide"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .TabLayout {
    z-index: 1;
    width: 100%;
    height: max-content;
    padding: 0.4rem;
    overflow-x: auto;

    --scrollbar-size: 0.2rem;
    --scrollbar-thumb-color: hsla(0, 0%, 0%, 0.05);
    --scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.1);
    --scrollbar-track-color: transparent;
    --scrollbar-track-color-hover: transparent;
    --scrollbar-track-margin: 1rem;

    display: flex;
    flex-direction: column;
    align-items: flex-start;

    & > * {
      gap: 0.1rem;

      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
    }
  }
</style>
