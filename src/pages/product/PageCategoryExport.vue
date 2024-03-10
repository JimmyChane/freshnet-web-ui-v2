<script setup lang="ts">
  import NavigationBar from "@/components/actionbar/NavigationBar.vue";
  import PrintContent from "@/components/PrintContent.vue";
  import Pixel from "@/data/Pixel";
  import Layout from "./PageCategoryExport-Layout.vue";

  import IconPrinter from "@/assets/icon/printer-000000.svg";
  import { computed, onMounted, ref } from "vue";
  import { useLoginStore } from "@/stores/login.store";
  import Product from "@/data/product/Product";
  import { useRoute } from "vue-router";
  import { useProductStore } from "@/data-stores/product.store";

  const user = computed(() => useLoginStore().user);
  const allowEdit = computed(
    () => user.value.isTypeAdmin() || user.value.isTypeStaff(),
  );

  const width = computed(() => Pixel.cm(210));
  const height = computed(() => Pixel.cm(297));

  const products = ref<Product[]>([]);
  const print = ref();

  async function invalidate() {
    const { id } = useRoute().query;
    const groups = await useProductStore().getGroupsByCategory();
    const group = groups.find((group) => group.category.id === id);
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
    <PrintContent
      class="PageCategoryExport-print"
      ref="print"
      :width="width"
      :height="height"
    >
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
