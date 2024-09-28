<script setup lang="ts">
import type { Item } from '@/data/Item';
import { Product } from '@/data/Product';
import ItemSearchProduct from '@/page-components/product/ItemSearchProduct.vue';

defineProps<{ item: Item }>();
</script>

<template>
  <ItemSearchProduct
    v-if="item instanceof Product"
    class="ActionbarProduct-search-item"
    :item="item"
  />
</template>
