<script setup lang="ts">
  import { computed } from "vue";
  import ItemVue from "./PagePrint-Item.vue";
  import { Subcategory } from "../PagePrint";

  const props = defineProps<{
    preview: Subcategory;
  }>();

  const title = computed(() => props.preview.title);
  const icon = computed(() => props.preview.icon);
</script>

<template>
  <div class="PagePrint-card">
    <div class="PagePrint-card-header" v-if="icon || title">
      <img class="PagePrint-card-icon" v-if="icon" :src="icon" />
      <span class="PagePrint-card-title" v-if="title">{{ title }}</span>
    </div>

    <div class="PagePrint-items">
      <ItemVue
        class="PagePrint-item"
        v-for="item of preview.items"
        :key="item.title"
        :item="item"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .PagePrint-card {
    background: white;

    padding: 1rem;
    gap: 1rem;
    border-radius: 1rem;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    .PagePrint-card-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;

      .PagePrint-card-icon {
        --size: 3rem;
        width: var(--size);
        height: var(--size);
      }
      .PagePrint-card-title {
        font-size: 1.2rem;
        font-weight: 500;
      }
    }
    .PagePrint-items {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      gap: 0.5rem;
    }
  }
</style>
