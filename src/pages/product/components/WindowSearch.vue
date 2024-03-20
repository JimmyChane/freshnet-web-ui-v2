<script setup lang="ts">
  import PanelSearch from "@/components/panel/PanelSearch.vue";
  import ItemSearchProduct from "./ItemSearchProduct.vue";
  import type { PopupWindow } from "@/stores/popup-window/PopupWindow";
  import { computed, onMounted, ref, watch } from "vue";
  import type { Item } from "@/data/Item";
  import ItemSearch from "./WindowSearch-ItemSearch.vue";

  const props = defineProps<{ popupWindow: PopupWindow<Item[]> }>();

  const windowSearch = ref<typeof PanelSearch>();

  const search = ref("");
  const results = ref<Item[]>([]);

  const items = computed(() => props.popupWindow.data);

  watch([search.value], () => {
    results.value = inputText(search.value);
  });

  function blur() {
    windowSearch.value?.blur();
  }
  function focus() {
    windowSearch.value?.focus();
  }

  function inputText(text: string): Item[] {
    const str = text;

    if (!str) return [];

    const strs = str
      .toLowerCase()
      .split(/[\s,]+/)
      .filter((text) => text);

    return items.value
      .reduce((results: { count: number; item: Item }[], item) => {
        try {
          const count = item.toCount(strs);
          if (count > 0) results.push({ count, item });
        } catch (error) {
          console.error("one of search result failed");
          console.error(error);
        }
        return results;
      }, [])
      .sort((result1, result2) => result2.count - result1.count)
      .map((result) => result.item);
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
    <ItemSearch
      class="ActionbarProduct-search-item"
      v-for="item in results"
      :key="item.getUnique()"
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
