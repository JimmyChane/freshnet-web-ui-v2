<script setup lang="ts">
  import { isColorDark } from "@/U";
  import chroma, { Color } from "chroma-js";
  import { computed } from "vue";

  const props = withDefaults(
    defineProps<{ title?: string; primaryColor?: Color }>(),
    { title: "", primaryColor: () => chroma("#ffffff") },
  );
  const isPrimaryColorDark = computed(() => isColorDark(props.primaryColor));
</script>

<template>
  <span
    class="ItemProduct-Label"
    :style="{
      '--primary-color': primaryColor.toString(),
      color: isPrimaryColorDark ? 'white' : 'black',
    }"
    :key="title"
    >{{ title }}</span
  >
</template>

<style lang="scss" scoped>
  .ItemProduct-Label {
    min-width: max-content;
    width: max-content;
    padding: 0.45em 0.7em;
    background: var(--primary-color);
    border-radius: 1em;
    font-size: 0.6rem;
    font-weight: 400;
    line-height: 1em;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
</style>
