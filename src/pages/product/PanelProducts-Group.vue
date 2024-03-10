<script setup lang="ts">
  import Arrow from "./PanelProducts-Group-Arrow.vue";
  import ItemProduct from "./ItemProduct.vue";
  import { computed, ref } from "vue";
  import Product from "@/data/product/Product";

  const props = withDefaults(
    defineProps<{
      group: {
        id: string;
        key: string;
        title: string;
        icon: string;
        items: Product[];
      };

      currentProductId?: string;
      queryBrandId?: string;
      queryStock?: string;
      queryGroupKey?: string;
    }>(),
    {
      currentProductId: "",
      queryBrandId: "",
      queryStock: "",
      queryGroupKey: "",
    },
  );

  const scrollLeft = ref(0);
  const layoutMode = ref(ItemProduct.Mode.List);

  const id = computed(() => props.group.id);
  const key = computed(() => props.group.key);
  const icon = computed(() => props.group.icon);
  const title = computed(() => props.group.title);
  const items = computed(() => props.group.items);
  const refScroll = ref();

  function clickPrevious() {
    refScroll.value.scrollTo({
      left: refScroll.value.scrollLeft - refScroll.value.offsetWidth,
      behavior: "smooth",
    });
  }
  function clickNext() {
    refScroll.value.scrollTo({
      left: refScroll.value.scrollLeft + refScroll.value.offsetWidth,
      behavior: "smooth",
    });
  }
</script>

<template>
  <div class="PanelProducts-category">
    <span class="PanelProducts-category-title">{{ title }}</span>

    <div
      class="PanelProducts-category-items"
      ref="scroll"
      :style="{ 'z-index': '1' }"
      @scroll="(e) => (scrollLeft = (e.target as HTMLDivElement).scrollLeft)"
    >
      <router-link
        class="PanelProducts-category-items-item"
        v-for="item of items"
        :key="item.id"
        :to="{
          query: {
            productId: item.id,
            brand: queryBrandId ? queryBrandId : undefined,
            stock: queryStock ? queryStock : undefined,
            category: queryGroupKey ? queryGroupKey : undefined,
          },
        }"
      >
        <ItemProduct
          :mode="layoutMode"
          :item="item"
          :isSelected="item.id === currentProductId"
        />
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .PanelProducts-category {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 1rem 0;

    .PanelProducts-category-title {
      display: flex;
      flex-direction: row;
      align-items: center;

      font-size: 2rem;
      font-weight: 500;
      gap: 0.5em;
      padding: 0 1.2rem;
    }
    .PanelProducts-category-items {
      width: 100%;
      padding: 0.5rem 0.9rem;
      gap: 0.5rem;

      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));

      .PanelProducts-category-items-item {
        text-decoration: none;
        & > * {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
