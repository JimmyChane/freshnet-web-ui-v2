<script setup lang="ts">
  import type { Color } from "chroma-js";
  import ProductViewerPriceEditor from "./ViewerProduct-PriceEditor.vue";
  import ProductViewerPriceViewer from "./ViewerProduct-PriceViewer.vue";
  import type { Product } from "@/data/product/Product";

  withDefaults(
    defineProps<{
      primaryColor: Color;
      allowEdit?: boolean;
      product?: Product;
    }>(),
    {
      allowEdit: false,
    },
  );
</script>

<template>
  <ProductViewerPriceEditor
    v-if="allowEdit"
    :product="product"
    :primaryColor="primaryColor"
    @click-product-priceUpdate="(x) => $emit('click-edit', x)"
  />
  <ProductViewerPriceViewer
    v-else
    :product="product"
    :primaryColor="primaryColor"
  />
</template>
