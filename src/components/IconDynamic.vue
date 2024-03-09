<script setup lang="ts">
  import { computed } from "vue";
  import chroma, { type Color } from "chroma-js";
  import Icon from "./Icon.vue";
  import { isColorDark } from "@/U";

  const props = withDefaults(
    defineProps<{
      srcLight?: string;
      srcDark?: string;
      primaryColor?: Color;
      alt?: string;
    }>(),
    {
      srcLight: "",
      srcDark: "",
      primaryColor: () => chroma("ffffff"),
      alt: "",
    },
  );

  const isDark = computed(() => isColorDark(props.primaryColor, 60));
</script>

<template>
  <Icon :src="isDark ? srcLight : srcDark" :alt="alt" />
</template>
