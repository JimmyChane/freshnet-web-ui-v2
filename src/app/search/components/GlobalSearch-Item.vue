<script setup lang="ts">
const emits = defineEmits<{ click: [void] }>();

defineProps<{ to: Object }>();
</script>

<template>
  <router-link class="GlobalSearch-item transition" :to="to" @click.native="() => emits('click')">
    <slot></slot>
  </router-link>
</template>

<style lang="scss" scoped>
.GlobalSearch-item {
  width: 100%;
  gap: 0.5em;
  padding: 0.5em;
  cursor: pointer;

  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;

  color: black;
  text-align: start;
  text-decoration: none;
  border: none;
  background: none;
  border-radius: 0.8em;

  &:hover {
    background: rgba(255, 255, 255, 0.5);
  }
}
</style>
