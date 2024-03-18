<script setup lang="ts">
  import NavigationBar from "@/components/actionbar/NavigationBar.vue";
  import ExportButton from "./components/PageProductExport-Export.vue";
  import LayoutOne from "./components/PageProductExport-Layout-One.vue";
  import LayoutTwo from "./components/PageProductExport-Layout-Two.vue";
  import PanelOption from "./components/PageProductExport-PanelOption.vue";
  import PrintContent from "@/components/PrintContent.vue";
  import {
    computed,
    onBeforeMount,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
  } from "vue";
  import { useLoginStore } from "@/stores/login.store";
  import { useRoute, useRouter } from "vue-router";
  import { useProductStore } from "@/data-stores/product.store";
  import {
    GridCount,
    Layout,
    Option,
    Orientation,
    Size,
  } from "./PageProductExport";

  const route = useRoute();
  const router = useRouter();

  const canvasRef = ref<typeof PrintContent>();

  const product = ref();

  const options = ref([
    new Option("Orientation", [Orientation.Portrait, Orientation.Landscape], 0),
    new Option("Size", [Size.A5, Size.A4], 1),
    new Option("Rows", [new GridCount("1", 1), new GridCount("2", 2)], 1),
    new Option("Columns", [new GridCount("1", 1), new GridCount("2", 2)], 0),
    new Option("Layouts", [Layout.One, Layout.Two], 0),
  ]);
  const layouts = ref([
    { title: "Layout 1" },
    { title: "Layout 2" },
    { title: "Layout 3" },
  ]);

  const bodyWidth = ref(0);
  const bodyHeight = ref(0);

  const user = computed(() => useLoginStore().user);
  const allowEdit = computed(
    () => user.value.isTypeAdmin() || user.value.isTypeStaff(),
  );

  const productId = computed(() => route.query.productId);

  const orientation = computed(
    () => options.value[0].selectedItem as Orientation | undefined,
  );
  const size = computed(
    () => options.value[1].selectedItem as Size | undefined,
  );
  const row = computed(
    () => options.value[2].selectedItem as GridCount | undefined,
  );
  const column = computed(
    () => options.value[3].selectedItem as GridCount | undefined,
  );
  const layout = computed(
    () => options.value[4].selectedItem as Layout | undefined,
  );

  const isPortrait = computed(() => orientation.value === Orientation.Portrait);
  const isLandscape = computed(
    () => orientation.value === Orientation.Landscape,
  );

  const canvasWidth = computed(() =>
    isPortrait.value ? size.value?.width : size.value?.height,
  );
  const canvasHeight = computed(() =>
    isPortrait.value ? size.value?.height : size.value?.width,
  );
  const canvasRowCount = computed(() => row.value?.count);
  const canvasColumnCount = computed(() => column.value?.count);

  const itemWidth = computed(() => {
    if (
      canvasWidth.value === undefined ||
      canvasColumnCount.value === undefined
    )
      return 0;
    return canvasWidth.value / canvasColumnCount.value;
  });
  const itemHeight = computed(() => {
    if (canvasHeight.value === undefined || canvasRowCount.value === undefined)
      return 0;
    return canvasHeight.value / canvasRowCount.value;
  });

  const isLayoutOne = computed(() => layout.value === Layout.One);
  const isLayoutTwo = computed(() => layout.value === Layout.Two);

  watch(() => productId.value, invalidateProduct);
  watch(
    () => user.value,
    (userNow, userWas) => {
      if (userWas && !userNow) redirectToLogin();
    },
  );

  function listenKeyDown(event: KeyboardEvent) {
    if (event.key === "p" && event.ctrlKey) {
      if (event.preventDefault) event.preventDefault();
      if (event.stopPropagation) event.stopPropagation();
      clickExport();
    }
  }

  async function invalidateProduct() {
    product.value = undefined;

    if (typeof productId.value !== "string") return;

    const xProduct = await useProductStore().getItemOfId(productId.value);
    if (!xProduct) return;

    document.title = await xProduct.fetchFullTitle();

    product.value = xProduct;
  }

  function clickExport() {
    if (canvasRef.value) canvasRef.value.print();
  }

  function redirectToLogin() {
    router.replace({
      path: "/login",
      query: { redirect: router.currentRoute.value.fullPath },
    });
  }

  onBeforeMount(() => {
    document.addEventListener("keydown", listenKeyDown);
  });

  onMounted(async () => {
    try {
      const user = await useLoginStore().getUser();
      if (user.isTypeNone()) redirectToLogin();
    } catch (error) {
      redirectToLogin();
    }

    invalidateProduct();
  });
  onBeforeUnmount(() => {
    document.removeEventListener("keydown", listenKeyDown);
  });
</script>

<template>
  <div class="PageProductExport" v-if="allowEdit">
    <NavigationBar :style="{ 'grid-area': 'toolbar' }">
      <div class="PageProductExport-toolbar">
        <ExportButton @click="() => clickExport()" />
      </div>
    </NavigationBar>

    <div class="PageProductExport-body">
      <PrintContent
        ref="canvasRef"
        :width="canvasWidth"
        :height="canvasHeight"
        :style="{
          margin: '1rem',
          'grid-area': 'preview',
        }"
      >
        <LayoutOne
          v-if="isLayoutOne"
          :width="itemWidth"
          :height="itemHeight"
          :product="product"
        />
        <LayoutTwo
          v-if="isLayoutTwo"
          :width="itemWidth"
          :height="itemHeight"
          :product="product"
        />
      </PrintContent>

      <PanelOption
        class="PageProductExport-panelOption"
        :style="{ 'grid-area': 'panelOption' }"
        :items="options"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .PageProductExport {
    width: 100%;
    height: 100%;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;

    .PageProductExport-toolbar {
      flex-grow: 1;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      gap: 0.5rem;
      padding: 0.5rem;

      .PageProductExport-options {
        gap: 0.5rem;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
      }
    }
    .PageProductExport-body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      display: grid;
      grid-template-areas: "layouts preview panelOption";
      grid-template-rows: 1fr;
      grid-template-columns: 14rem 1fr;

      grid-template-areas: "preview panelOption";
      grid-template-rows: 1fr;
      grid-template-columns: 1fr 14rem;

      .PageProductExport-layouts {
        background: white;
        gap: 0.5rem;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
      }
    }
  }
</style>
