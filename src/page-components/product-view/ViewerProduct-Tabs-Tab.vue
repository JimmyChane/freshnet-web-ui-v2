<script setup lang="ts">
import { computed } from 'vue';

export interface Tab {
  key: string;
  title: string;
  isSelected?: () => boolean;
}

const props = defineProps<{ item: Tab }>();

const isSelected = computed(() => {
  if (typeof props.item.isSelected === 'function') {
    return props.item.isSelected();
  }

  return false;
});

const styleClass = computed(() => {
  return isSelected.value ? 'Tabs-Tab-isSelected' : 'Tabs-Tab-isDeselected';
});
</script>

<template>
  <button :class="['Tabs-Tab', styleClass, 'transition']">
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
