<script setup lang="ts">
import type { Color } from 'chroma-js';
import ProductViewerPriceEditor from './ViewerProduct-PriceEditor.vue';
import ProductViewerPriceViewer from './ViewerProduct-PriceViewer.vue';
import type { Product } from '@/data/Product';
import type { ProductPrices } from '@/data/ProductPrices';

const emits = defineEmits<{
  clickEdit: [{ product: Product; price: ProductPrices }];
}>();

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
    @click-product-priceUpdate="(x) => emits('clickEdit', { product: x.product, price: x.price })"
  />
  <ProductViewerPriceViewer v-else :product="product" :primaryColor="primaryColor" />
</template>
