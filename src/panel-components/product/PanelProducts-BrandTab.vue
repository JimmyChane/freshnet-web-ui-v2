<script setup lang="ts">
import type { TabMenu } from '@/page-components/product/CategoryTab';
import { computed } from 'vue';

const props = defineProps<{ menu: TabMenu }>();

const title = computed(() => props.menu.title);
const count = computed(() => props.menu.count);

function isSelected() {
  if (typeof props.menu.isSelected !== 'function') return false;

  return props.menu.isSelected(props.menu);
}
function click() {
  if (typeof props.menu.click !== 'function') return;
  props.menu.click(props.menu);
}
</script>

<template>
  <button class="TabLayout-Tab" :isSelected="`${isSelected()}`" @click="() => click()">
    <span class="TabLayout-Tab-title">{{ title }}</span>
  </button>
</template>

<style lang="scss" scoped>
.TabLayout-Tab {
  height: 2.6em;
  border: none;
  border-radius: 0.8em;
  font-size: 0.8em;
  padding: 1em;

  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid hsla(0, 0%, 0%, 0.1);

  .TabLayout-Tab-title {
    text-align: start;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-weight: 600;
  }
}

.TabLayout-Tab[isSelected='true'] {
  background: #000000e6;
  color: white;
}
.TabLayout-Tab[isSelected='false'] {
  background: #ffffffe6;
  color: black;
  cursor: pointer;

  &:hover {
    background: #e2e2e2;
  }
}
</style>
