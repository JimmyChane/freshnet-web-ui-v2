<script setup lang="ts">
import type { Option } from '../product-export/PageProductExport';
import Item from './PageProductExport-PanelOption-Item.vue';

withDefaults(defineProps<{ items?: Option[] }>(), {});
</script>

<template>
  <div class="PanelOption">
    <Item v-for="item of items" :key="item.title" :item="item" />
  </div>
</template>

<style lang="scss" scoped>
.PanelOption {
  width: 100%;
  height: 100%;
  background: white;
  gap: 1rem;
  padding: 1rem;
  padding-bottom: 4rem;

  overflow-y: auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
</style>
