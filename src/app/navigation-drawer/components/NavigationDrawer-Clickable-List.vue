<script setup lang="ts">
  import LeftNavItem from "./NavigationDrawer-Item.vue";
  import type { NavigationParent, NavigationView } from "../NavigationDrawer";

  defineProps<{ item: NavigationParent | NavigationView; isWide?: boolean }>();
</script>

<template>
  <div class="NavigationDrawer-Clickable-List" :isWide="`${isWide}`">
    <LeftNavItem :item="item" :isWide="isWide" />
  </div>
</template>

<style lang="scss" scoped>
  .NavigationDrawer-Clickable-List {
    height: fit-content;
    width: 100%;
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 0.7rem 1rem;
  }

  .NavigationDrawer-Clickable-List[isWide="true"] {
    padding-right: 3rem;
  }
  .NavigationDrawer-Clickable-List[isWide="false"] {
    width: min-content;
    align-items: center;
    justify-content: center;
    padding: 0.7rem;
  }
</style>
