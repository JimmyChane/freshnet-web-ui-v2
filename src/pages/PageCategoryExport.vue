<script setup lang="ts">
import NavigationBar from '@/components/actionbar/NavigationBar.vue';
import PrintContent from '@/components/PrintContent.vue';
import Layout from '@/page-components/product/PageCategoryExport-Layout.vue';
import IconPrinter from '@/assets/icon/printer-000000.svg';
import { computed, onMounted, ref } from 'vue';
import { Product } from '@/data/Product';
import { useRoute } from 'vue-router';
import { useProductStore } from '@/data-stores/product.store';
import { cm } from '@/data/Pixel';

const width = computed(() => cm(210));
const height = computed(() => cm(297));

const products = ref<Product[]>([]);
const print = ref();

async function invalidate() {
  const { id } = useRoute().query;
  const groups = await useProductStore().getGroupsByCategory();
  const group = groups.find((group) => group.parent?.id === id);
  products.value = group?.items ?? [];
}

onMounted(() => {
  invalidate();
});
</script>

<template>
  <div class="PageCategoryExport">
    <NavigationBar
      :rightMenus="[
        {
          title: 'Print',
          icon: IconPrinter,
          click: () => print.print(),
        },
      ]"
    />
    <PrintContent class="PageCategoryExport-print" ref="print" :width="width" :height="height">
      <Layout :width="width" :height="height" :products="products" />
    </PrintContent>
  </div>
</template>

<style lang="scss" scoped>
.PageCategoryExport {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  .PageCategoryExport-print {
    margin: 1rem;
    height: 100%;
  }
}
</style>
