<script setup lang="ts">
  import Section from "./ViewerProduct-Section.vue";
  import Item from "./ViewerProduct-PriceEditor-Item.vue";
  import { ProductPrice } from "@/data/product/ProductPrice";
  import IconEdit from "@/assets/icon/edit-000000.svg";
  import { Product } from "@/data/product/Product";
  import { computed } from "vue";
  import type { Color } from "chroma-js";

  const props = defineProps<{ product?: Product; primaryColor?: Color }>();

  const price = computed(() => props.product?.price ?? null);
  const priceNormal = computed(() => {
    const normal = props.product?.getPriceNormal() ?? null;
    if (normal && normal.value >= 0) return normal;
    return new ProductPrice();
  });
  const pricePromotion = computed(() => {
    const promotion = props.product?.getPricePromotion() ?? null;
    if (promotion && promotion.value >= 0) return promotion;
    return new ProductPrice();
  });
</script>

<template>
  <Section
    class="ProductViewerPriceEditor"
    title="Price"
    :primaryColor="primaryColor"
    :menu="{
      title: 'Edit',
      icon: IconEdit,
      click: () => {
        $emit('click-product-priceUpdate', {
          product: product,
          price: price,
        });
      },
    }"
  >
    <div class="ProductViewerPriceEditor-body">
      <Item title="Normal" :content="priceNormal.toString()" />
      <Item title="Promotion" :content="pricePromotion.toString()" />
    </div>
  </Section>
</template>

<style lang="scss" scoped>
  .ProductViewerPriceEditor {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    .ProductViewerPriceEditor-body {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;

      gap: 3px;
      overflow: hidden;
    }
  }
</style>
