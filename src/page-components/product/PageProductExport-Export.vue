<script setup lang="ts">
const emits = defineEmits<{ click: [void] }>();
</script>

<template>
  <button class="ExportExport transition" @click="() => emits('click')">
    <span>Export</span>
  </button>
</template>

<style lang="scss" scoped>
.ExportExport {
  background: #3e99cd;
  padding: 0.6rem 1.8rem;
  border-radius: 0.5rem;
  color: white;

  font-size: 1rem;
  border: none;
  cursor: pointer;

  &:hover {
    background: #257bad;
  }
}
</style>
