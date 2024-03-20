<script setup lang="ts">
  import type { Item } from "@/data/Item";
  import ItemSearchProduct from "./ItemSearchProduct.vue";
  import { Product } from "@/data/product/Product";

  defineProps<{ item: Item }>();
</script>

<template>
  <ItemSearchProduct
    v-if="item instanceof Product"
    class="ActionbarProduct-search-item"
    :item="item"
  />
</template>
