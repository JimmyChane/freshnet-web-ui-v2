<script setup lang="ts">
import PanelSearch from '@/components/panel/PanelSearch.vue';
import type { PopupWindow } from '@/stores/popup-window/PopupWindow';
import { computed, onMounted, ref, watch } from 'vue';
import { Item } from '@/data/Item';
import { Service } from '@/data/Service';
import ItemService from './item-service/ItemService.vue';

export interface DataProps {
  items: Item[];
  clickItem: (item: Item) => void;
}

const props = defineProps<{ popupWindow: PopupWindow<DataProps> }>();

const search = ref('');
const results = ref<Item[]>([]);

const isShowing = computed(() => props.popupWindow.isShowing);
const items = computed(() => props.popupWindow.data.items);

watch(() => search.value, invalidate);

async function invalidate() {
  results.value = [];
  results.value = inputText(search.value);
}

function inputText(text: string) {
  const strs = text
    .toLowerCase()
    .split(/[\s,]+/)
    .filter((text) => text.trim().replace(' ', '').length);

  if (!strs.length) return [];

  let countHighest = 0;

  let filters = items.value.reduce((filters: { count: number; item: Item }[], item) => {
    try {
      const count = item.toCount(strs);
      if (count < 1) return filters;
      if (countHighest < count) countHighest = count;
      filters.push({ count, item });
    } catch (error) {
      console.error(error);
    }

    return filters;
  }, []);

  if (filters.length > 10) {
    const valueToPass = countHighest / 2;
    filters = filters.filter((filter) => filter.count >= valueToPass);
  }

  return filters
    .sort((filter1, filter2) => filter2.count - filter1.count)
    .map((filter) => filter.item);
}
function clickItem(item: Item) {
  props.popupWindow.close();
  props.popupWindow.data.clickItem(item);
}

onMounted(() => invalidate());
</script>

<template>
  <PanelSearch
    :isShowing="isShowing"
    placeholder="Search services"
    @input-text="(text) => (search = text)"
    @click-dismiss="() => popupWindow.close()"
  >
    <ItemService
      v-for="item in results"
      :key="item.getUnique()"
      :item="item as Service"
      @click="() => clickItem(item)"
    />
  </PanelSearch>
</template>
