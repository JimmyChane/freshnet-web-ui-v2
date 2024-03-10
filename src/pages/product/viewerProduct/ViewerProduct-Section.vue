<script setup lang="ts">
  import { computed } from "vue";
  import ButtonIcon from "@/components/button/ButtonIcon.vue";
  import { type Color } from "chroma-js";
  import type { Menu } from "@/stores/popup-menu/PopupMenu";

  const props = withDefaults(
    defineProps<{ title?: string; menu?: Menu; primaryColor?: Color }>(),
    { title: "" },
  );

  const titleColor = computed(() => {
    return props.primaryColor?.mix("000000", 0.9).toString() ?? "#4E504D";
  });
</script>

<template>
  <div class="ProductViewerSection">
    <div class="ProductViewerSection-header" v-if="title || menu">
      <span class="ProductViewerSection-title" v-if="title">{{ title }}</span>
      <ButtonIcon
        v-if="menu"
        :src="menu.icon"
        @click="
          () => {
            if (menu && typeof menu.click === 'function') menu.click(menu);
          }
        "
      />
    </div>
    <div class="ProductViewerSection-body">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .ProductViewerSection {
    width: 100%;
    gap: 2px;

    display: flex;
    flex-direction: column;
    align-items: stretch;

    .ProductViewerSection-header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      gap: 0.5rem;
      padding-right: 0.6rem;

      .ProductViewerSection-title {
        font-weight: 600;
        font-size: 1.3rem;
        padding: 1.2rem;
        padding-left: 0;
        padding-right: 1.2rem;
        color: black;
      }
    }
    .ProductViewerSection-body {
      display: flex;
      flex-direction: column;
      border-radius: 1rem;
      overflow: hidden;
    }
  }
</style>
