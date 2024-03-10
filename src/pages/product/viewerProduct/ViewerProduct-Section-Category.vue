<script setup lang="ts">
  import { computed, onMounted, ref, watch } from "vue";
  import type { Category } from "@/data/category/Category";
  import Section from "./ViewerProduct-Section.vue";
  import IconEdit from "@/assets/icon/edit-000000.svg";
  import type { Color } from "chroma-js";
  import type { Product } from "@/data/product/Product";

  const props = withDefaults(
    defineProps<{
      primaryColor: Color;
      allowEdit?: boolean;
      product?: Product;
    }>(),
    { allowEdit: false },
  );

  const category = ref<Category>();

  const categoryId = computed(() => props.product?.categoryId ?? "");
  const categoryTitle = computed(() => category.value?.title ?? "");
  const categoryIconUrl = computed(() => category.value?.icon?.toUrl() ?? "");

  watch(() => props.product, invalidate);
  watch(() => categoryId.value, invalidate);

  async function invalidate() {
    category.value = undefined;
    if (!props.product) return;
    category.value = await props.product.fetchCategory();
  }

  onMounted(() => invalidate());
</script>

<template>
  <Section
    v-if="allowEdit"
    title="Category"
    :primaryColor="primaryColor"
    :menu="{
      title: 'Edit',
      icon: IconEdit,
      click: () => {
        $emit('click-edit', {
          product,
          categoryId: categoryId,
        });
      },
    }"
  >
    <div class="SectionCategory">
      <div class="SectionCategory-item" v-if="category">
        <img
          class="SectionCategory-item-icon"
          v-if="categoryIconUrl"
          :src="categoryIconUrl"
        />
        <span class="SectionCategory-item-title" v-if="categoryTitle">{{
          categoryTitle
        }}</span>
      </div>

      <span class="SectionCategory-noContent" v-else>No Category</span>
    </div>
  </Section>
</template>

<style lang="scss" scoped>
  .SectionCategory {
    grid-area: category;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    .SectionCategory-item {
      width: 100%;
      padding: 1.2rem;
      gap: 1.2rem;
      background: hsla(0, 0%, 100%, 0.6);

      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;

      .SectionCategory-item-icon {
        width: 1.6rem;
        height: 1.6rem;
      }
      .SectionCategory-item-title {
        font-size: 1rem;
        font-weight: 600;
      }
    }
    .SectionCategory-noContent {
      opacity: 0.6;
      font-style: italic;
    }
  }
</style>
