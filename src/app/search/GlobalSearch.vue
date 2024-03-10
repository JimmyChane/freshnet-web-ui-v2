<script setup lang="ts">
  import SearchInput from "@/components/search/SearchInput.vue";
  import ItemSearchProduct from "./components/GlobalSearch-Item-Product.vue";
  import ItemSearchCategory from "./components/GlobalSearch-Item-Category.vue";
  import ItemSearchBrand from "./components/GlobalSearch-Item-Brand.vue";
  import ItemSearchPs2Disc from "./components/GlobalSearch-Item-Ps2Disc.vue";
  import ItemSearchService from "./components/GlobalSearch-Item-Service.vue";
  import { useBrandStore } from "@/data-stores/brand.store";
  import { computed, onMounted, ref, watch } from "vue";
  import { useLoginStore } from "@/stores/login.store";
  import { useCategoryStore } from "@/data-stores/category.store";
  import { useProductStore } from "@/data-stores/product.store";
  import { usePs2Store } from "@/data-stores/ps2.store";
  import { useServiceStore } from "@/data-stores/service.store";
  import { Product } from "@/data/product/Product";
  import { Category } from "@/data/category/Category";
  import { Brand } from "@/data/brand/Brand";
  import { Ps2Disc } from "@/data/ps2/Ps2Disc";
  import { Service } from "@/data/service/Service";
  import { Item } from "@/data/Item";

  defineProps<{ placeholder?: string }>();

  const loginStore = useLoginStore();
  const categoryStore = useCategoryStore();
  const productStore = useProductStore();
  const brandStore = useBrandStore();
  const ps2Store = usePs2Store();
  const serviceStore = useServiceStore();

  const searchinput = ref();

  const searchText = ref("");
  const searches = ref<{ dataType: string; item: Item }[]>([]);

  const user = computed(() => loginStore.user);
  const categories = computed(() => categoryStore.items);
  const products = computed(() => {
    return productStore.items.filter((product) => {
      return product.isStockAvailable();
    });
  });
  const brands = computed(() => brandStore.items);
  const ps2Discs = computed(() => ps2Store.items);
  const services = computed(() => {
    if (user.value.isTypeNone()) return [];
    return serviceStore.items;
  });

  watch(
    () => user.value,
    () => {
      if (!user.value.isTypeNone()) serviceStore.getItems();
      search(searchText.value);
    },
  );

  function search(text: string) {
    text = searchText.value = text.toLowerCase();
    let texts = text.split(/[\s,]+/).filter((text) => text.trim().length);

    let productSearches = products.value.map((product) => {
      return {
        dataType: "product",
        item: product,
        count: product.toCount(texts),
      };
    });
    let categorySearches = categories.value.map((category) => {
      return {
        dataType: "category",
        item: category,
        count: category.toCount(texts),
      };
    });
    let brandSearches = brands.value.map((brand) => {
      return {
        dataType: "brand",
        item: brand,
        count: brand.toCount(texts),
      };
    });
    let ps2DiscSearches = ps2Discs.value.map((ps2Disc) => {
      return {
        dataType: "ps2Disc",
        item: ps2Disc,
        count: ps2Disc.toCount(texts),
      };
    });
    let serviceSearches = services.value.map((service) => {
      return {
        dataType: "service",
        item: service,
        count: service.toCount(texts),
      };
    });

    const xSearches = [
      ...productSearches,
      ...categorySearches,
      ...brandSearches,
      ...ps2DiscSearches,
      ...serviceSearches,
    ];
    const highCount = xSearches.reduce((highCount, x) => {
      return highCount < x.count ? x.count : highCount;
    }, 0);
    const valueToAccept = highCount * 0.5;

    if (valueToAccept)
      searches.value = xSearches
        .filter((x) => x.count >= valueToAccept)
        .sort((x1, x2) => x2.count - x1.count);
    else searches.value = [];
  }
  function focus() {
    searchinput.value?.focus();
  }

  onMounted(() => {
    ps2Store.getItems();
    brandStore.getItems();
    categoryStore.getItems();
    categoryStore.refresh();
    productStore.refresh();
    if (user.value.isTypeAdmin() || user.value.isTypeStaff())
      serviceStore.getItems();
  });

  defineExpose({ focus });
</script>

<template>
  <SearchInput
    ref="searchinput"
    class="GlobalSearch"
    :list="searches"
    :placeholder="placeholder"
    @callback-search="(text) => search(text)"
    @expand="() => $emit('expand')"
    @collapse="() => $emit('collapse')"
    v-slot="{ collapse }"
  >
    <div
      class="GlobalSearch-item"
      v-for="x in searches"
      :key="x.item.getUnique()"
    >
      <ItemSearchProduct
        v-if="x.dataType === 'product'"
        :item="x.item as Product"
        @click="() => collapse()"
      />
      <ItemSearchCategory
        v-if="x.dataType === 'category'"
        :item="x.item as Category"
        @click="() => collapse()"
      />
      <ItemSearchBrand
        v-if="x.dataType === 'brand'"
        :item="x.item as Brand"
        @click="() => collapse()"
      />
      <ItemSearchPs2Disc
        v-if="x.dataType === 'ps2Disc'"
        :item="x.item as Ps2Disc"
        @click="() => collapse()"
      />
      <ItemSearchService
        v-if="x.dataType === 'service'"
        :item="x.item as Service"
        @click="() => collapse()"
      />
    </div>
  </SearchInput>
</template>

<style lang="scss" scoped>
  .GlobalSearch {
    --background-color: hsl(0, 0%, 94%);
    --border-radius: 4rem;
    --border: 1px solid transparent;
    --border-focus: 1px solid hsla(0, 0%, 0%, 0.15);
    --dropdown-height: calc(100dvh - 10rem);

    .GlobalSearch-item {
      width: 100%;
      display: flex;
    }
  }
</style>
@/stores/data-stores/brand.store
