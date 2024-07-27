<script setup lang="ts">
import Label from './GlobalSearch-Item-Label.vue';
withDefaults(defineProps<{ labels?: string[] }>(), { labels: () => [] });
</script>

<template>
  <div class="GlobalSearch-Item-Labels">
    <Label v-for="label of labels.filter((str) => str.length)" :key="label">
      {{ label }}
    </Label>
  </div>
</template>

<style lang="scss" scoped>
.GlobalSearch-Item-Labels {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.2em;
}
</style>
