<script setup lang="ts">
import LoadingDots from '@/components/loading/LoadingDots.vue';
import { Product } from '@/data/Product';
import { computed, onMounted, ref, watch } from 'vue';
import { useProductStore } from '@/data-stores/product.store';
import { useRoute } from 'vue-router';
import { useWindowStore } from '@/stores/window.store';
import { useNavigationStore } from '@/stores/navigation.store';
import { Layout, useAppLayoutStore } from '@/stores/app-layout.store';
import ViewerProduct from '@/page-components/product-view/ViewerProduct.vue';

const route = useRoute();

const appLayoutStore = useAppLayoutStore();
const navigationStore = useNavigationStore();

const product = ref<Product>();

const isLoading = computed(() => useProductStore().isLoading);
const isOver1200px = computed(() => useWindowStore().width > 1200);
const productId = computed(() => route.query.productId);

watch(() => productId.value, invalidate);

async function invalidate() {
  const products = await useProductStore().getItems();
  product.value = products.find((product) => {
    return product.id === productId.value;
  });

  if (!product.value) return;

  document.title = await product.value.fetchFullTitle();
}

onMounted(() => {
  appLayoutStore.setLayout(Layout.FULL);
  navigationStore.disableDrawer();

  invalidate();
});
</script>

<template>
  <div class="PageProductView">
    <ViewerProduct
      :product="product"
      :isWide="isOver1200px"
      :isEditable="false"
      :isActionbarHidden="true"
    />

    <LoadingDots style="z-index: 2" :isShowing="isLoading" />
  </div>
</template>

<style lang="scss" scoped>
.PageProductView {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
</style>
