<script setup lang="ts">
  import ViewerProduct from "@/pages/product/viewerProduct/ViewerProduct.vue";
  import LoadingDots from "@/components/LoadingDots.vue";
  import Product from "@/data/product/Product";
  import { computed, onMounted, ref, watch } from "vue";
  import { useProductStore } from "@/data-stores/product.store";
  import { useStore } from "@/stores/store";
  import { useRoute } from "vue-router";
  import { useWindowStore } from "@/stores/window.store";
  import AppLayout from "@/stores/app-layout/AppLayout";
  import { useNavigationStore } from "@/stores/navigation/navigation.store";
  import { useAppLayoutStore } from "@/stores/app-layout/app-layout.store";

  const route = useRoute();

  const appLayoutStore = useAppLayoutStore();
  const navigationStore = useNavigationStore();

  const product = ref<Product>();

  const isLoading = computed(() => useProductStore().isLoading);
  const isOver1200px = computed(() => useWindowStore().innerWidth > 1200);
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
    appLayoutStore.appLayout.setLayout(AppLayout.Layout.FULL);
    navigationStore.navigation.disableNavigationDrawer();

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
