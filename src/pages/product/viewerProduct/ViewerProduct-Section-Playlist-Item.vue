<script setup lang="ts">
  import ImageView from "@/components/image-viewer/ImageView.vue";
  import type { Product } from "@/data/product/Product";
  import { computed, onMounted, ref, watch } from "vue";
  import type { RouteRecordRaw } from "vue-router";

  const props = withDefaults(
    defineProps<{
      title?: string;
      item?: Product;
      to: Partial<RouteRecordRaw> | { query: Record<string, string> };
    }>(),
    { title: "" },
  );

  const itemTitle = ref("");

  const itemThumbnail = computed(() => props.item?.toImageThumbnail());

  watch(() => props.item, invalidateItem);

  async function invalidateItem() {
    itemTitle.value = "";
    if (!props.item) return;
    itemTitle.value = await props.item.fetchFullTitle();
  }

  onMounted(() => invalidateItem());
</script>

<template>
  <router-link class="ItemProductSuggest2 transition" :to="to" replace>
    <div class="ItemProductSuggest2-header">
      <span class="ItemProductSuggest2-title" v-if="title.length">{{
        title
      }}</span>
      <span>{{ itemTitle }}</span>
    </div>
    <ImageView
      class="ItemProductSuggest2-thumbnail"
      v-if="itemThumbnail"
      :src="itemThumbnail"
    />
  </router-link>
</template>

<style lang="scss" scoped>
  .ItemProductSuggest2 {
    width: 100%;
    height: 6rem;
    min-height: 6rem;
    border: none;
    background: hsla(0, 0%, 100%, 0.6);

    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    text-decoration: none;
    color: inherit;

    &:hover {
      background: hsla(0, 0%, 100%, 0.8);
    }

    .ItemProductSuggest2-header {
      width: fit-content;
      height: 100%;
      padding: 0 2rem;
      gap: 0.5rem;
      line-height: 1rem;
      font-size: 1rem;
      flex-grow: 1;

      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;

      .ItemProductSuggest2-title {
        font-weight: 600;
        font-size: 1.2rem;
      }
    }
    .ItemProductSuggest2-thumbnail {
      height: 6rem;
      aspect-ratio: 16/10;
      overflow: hidden;
      background: white;
      align-items: center;
      justify-content: center;
      object-fit: cover;
    }
  }
</style>
