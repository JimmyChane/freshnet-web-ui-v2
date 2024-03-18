<script setup lang="ts">
  import NavigationBar from "@/components/actionbar/NavigationBar.vue";
  import SearchInput from "@/components/search/SearchInput.vue";
  import ItemSearchProduct from "./ItemSearchProduct.vue";
  import Searcher from "@/data/Searcher";
  import type { Menu } from "@/stores/popup-menu/PopupMenu";
  import IconSearch from "@/assets/icon/search-000000.svg";
  import IconRefresh from "@/assets/icon/refresh-000000.svg";
  import { Product } from "@/data/product/Product";
  import { computed, ref } from "vue";
  import { useCategoryStore } from "@/data-stores/category.store";
  import { useProductStore } from "@/data-stores/product.store";
  import { usePageStore } from "@/stores/page.store";
  import { useWindowStore } from "@/stores/window.store";

  const emits = defineEmits<{ clickSearch: [void] }>();
  const props = withDefaults(
    defineProps<{
      products?: Product[];
      leftMenus?: Menu[];
      rightMenus?: Menu[];
    }>(),
    { products: () => [], leftMenus: () => [], rightMenus: () => [] },
  );

  const searchText = ref("");

  const isOver550px = computed(() => useWindowStore().innerWidth > 550);
  const paths = computed(() => usePageStore().paths);
  const lastPath = computed(() => {
    if (!Array.isArray(paths.value)) return "";
    if (!paths.value.length) return "";
    return paths.value[paths.value.length - 1];
  });
  const productSearches = computed(() => {
    return Searcher.withItems(props.products).search(searchText.value);
  });
  const initRightMenus = computed(() => {
    const menus = [];

    if (!isOver550px.value) {
      menus.push({
        title: "Search",
        icon: IconSearch,
        click: () => emits("clickSearch"),
      });
    }
    if (Array.isArray(props.rightMenus)) menus.push(...props.rightMenus);
    if (
      !Array.isArray(props.rightMenus) &&
      props.rightMenus !== null &&
      props.rightMenus !== undefined
    ) {
      menus.push(props.rightMenus);
    }

    menus.push({
      key: "refresh",
      title: "Refresh",
      icon: IconRefresh,
      click: () => {
        useCategoryStore().refresh();
        useProductStore().refresh();
      },
    });

    return menus;
  });
</script>

<template>
  <NavigationBar
    class="ActionbarProduct"
    :leftMenus="leftMenus"
    :rightMenus="initRightMenus"
  >
    <SearchInput
      v-if="isOver550px"
      class="ActionbarProduct-search"
      placeholder="Search products"
      :list="productSearches"
      @callback-search="(text) => (searchText = text)"
      v-slot="{ list }"
    >
      <ItemSearchProduct
        class="ActionbarProduct-search-item"
        v-for="product in list as Product[]"
        :key="product.id"
        :item="product"
      />
    </SearchInput>
  </NavigationBar>
</template>

<style lang="scss" scoped>
  .ActionbarProduct {
    border-bottom: 1px solid hsl(0, 0%, 80%);
    .ActionbarProduct-search {
      flex-grow: 1;
      z-index: 1;
      max-width: 30rem;
      border: none;
      margin: 0 0.5rem;
      --border-radius: 2rem;

      .ActionbarProduct-search-item-link {
        text-decoration: none;
        display: flex;
        width: 100%;
        .ActionbarProduct-search-item {
          width: 100%;
        }
      }
    }
  }
</style>
