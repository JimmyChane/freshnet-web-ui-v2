<script setup lang="ts">
  import type { Tab } from "./Tab";

  defineProps<{ item: Tab }>();
</script>

<template>
  <button
    :class="[
      'Tabs-Tab',
      item.isSelected() ? 'Tabs-Tab-isSelected' : 'Tabs-Tab-isDeselected',
      'transition',
    ]"
  >
    {{ item.title }}
  </button>
</template>

<style lang="scss" scoped>
  .Tabs-Tab {
    min-width: max-content;
    border: none;
    background: none;
    font-weight: 600;
    font-size: 0.9rem;
    padding: 0.5rem 0.7rem;
  }
  .Tabs-Tab-isDeselected {
    transform: scale(0.8);
    color: hsla(0, 0%, 0%, 0.5);
    cursor: pointer;
  }
  .Tabs-Tab-isSelected {
    color: black;
  }
</style>
