<script setup lang="ts">
import { Product } from '@/data/Product';
import ItemProduct from './ItemProduct.vue';
import { computed } from 'vue';
import { Mode } from './ItemProduct';

defineProps<{ item: Product }>();
const mode = computed(() => Mode.List);
</script>

<template>
  <div @click="() => $emit('click')">
    <router-link
      :style="{
        border: 'none',
        background: 'none',
        'text-decoration': 'none',
      }"
      :to="{ path: '/product', query: { productId: item.id } }"
    >
      <ItemProduct :item="item" :mode="mode" />
    </router-link>
  </div>
</template>
