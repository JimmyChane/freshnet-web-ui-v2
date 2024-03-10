<script setup lang="ts">
  import PanelSearch from "@/components/panel/PanelSearch.vue";
  import ItemSearchProduct from "./ItemSearchProduct.vue";
  import { PopupWindow } from "@/stores/popup-window/PopupWindow";
  import { computed, onMounted, ref, watch } from "vue";
  import Product from "@/data/product/Product";

  const props = defineProps<{ popupWindow: PopupWindow }>();

  const windowSearch = ref<typeof PanelSearch>();

  const search = ref("");
  const results = ref<Product[]>([]);

  const isShowing = computed(() => props.popupWindow.isShowing);
  const items = computed(() => props.popupWindow.items);

  watch(
    () => search.value,
    () => {
      results.value = inputText(search.value);
    },
  );

  function blur() {
    windowSearch.value?.blur();
  }
  function focus() {
    windowSearch.value?.focus();
  }

  function inputText(text: string) {
    const str = text;

    if (!str) return [];

    const strs = str
      .toLowerCase()
      .split(/[\s,]+/)
      .filter((text) => text);

    return items.value
      .reduce((results: { count: number; product: Product }[], product) => {
        try {
          const count = product.toCount(strs);
          if (count > 0) results.push({ count, product });
        } catch (error) {
          console.error("one of search result failed");
          console.error(error);
        }
        return results;
      }, [])
      .sort((result1, result2) => result2.count - result1.count)
      .map((result) => result.product);
  }
  function clickDismiss() {
    blur();
    props.popupWindow.close();
  }

  onMounted(() => {
    results.value = inputText(search.value);
    focus();
  });
</script>

<template>
  <PanelSearch
    class="WindowSearch"
    ref="windowSearch"
    placeholder="Search products"
    @input-text="(text) => (search = text)"
    @click-dismiss="() => clickDismiss()"
  >
    <ItemSearchProduct
      class="ActionbarProduct-search-item"
      v-for="item in results"
      :key="item.id"
      :item="item"
      @click="() => clickDismiss()"
    />
  </PanelSearch>
</template>

<style lang="scss" scoped>
  .ActionbarProduct-search-item-link {
    text-decoration: none;
    display: flex;
    width: 100%;
    .ActionbarProduct-search-item {
      width: 100%;
    }
  }
</style>
