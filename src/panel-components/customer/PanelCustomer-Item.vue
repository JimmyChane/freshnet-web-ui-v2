<script setup lang="ts">
withDefaults(defineProps<{ to?: unknown; title?: string }>(), { title: '' });
</script>

<template>
  <router-link v-if="to" :class="['PanelCustomer-item', 'transition']" :isHoverable="true" :to="to">
    <span v-if="title.length" class="PanelCustomer-item-title">{{ title }}</span>
    <slot></slot>
  </router-link>

  <div v-else class="PanelCustomer-item">
    <span v-if="title.length" class="PanelCustomer-item-title">{{ title }}</span>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.PanelCustomer-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.2rem;

  border-radius: 1rem;
  background: white;
  font-size: 1rem;
  text-align: start;
  text-decoration: none;
  color: inherit;

  .PanelCustomer-item-title {
    font-weight: 600;
  }
}
.PanelCustomer-item[isHoverable='true'] {
  cursor: pointer;
  &:hover {
    background: hsl(0, 0%, 96%);
  }
}
</style>
