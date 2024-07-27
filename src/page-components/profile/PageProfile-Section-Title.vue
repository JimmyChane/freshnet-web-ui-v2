<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), { title: '' });
</script>

<template>
  <span class="PageProfile-section-title">{{ title }}</span>
</template>

<style lang="scss" scoped>
.PageProfile-section-title {
  font-size: 1rem;
}
</style>
