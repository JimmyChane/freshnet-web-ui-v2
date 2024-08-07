import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { DataLoader } from '@/utils/DataLoader';
import { Processor } from '@/utils/Processor';
import { List } from '@/utils/List';
import { Category, CategoryRequest } from '@/data/Category';

export const useCategoryStore = defineStore('category', () => {
  const dataLoader = new DataLoader<Category>(1000 * 60 * 10) // 10min
    .processor(() => processor.value as Processor | undefined)
    .setData((data) => list.value.clear().addItems(data))
    .getData(() => list.value.items)
    .loadData(async () => {
      const api = await CategoryRequest.list();
      const content: any[] = api.optArrayContent();
      return content.map((content) => new Category(content));
    });

  const processor = ref(new Processor());
  const list = ref(new List<Category>());

  async function refresh() {
    dataLoader.doTimeout();
    await getItems();
  }
  async function getItems() {
    return dataLoader.data();
  }
  async function getItemOfId(id: string) {
    let items: Category[] = await getItems();
    return items.find((item) => item.id === id);
  }
  async function getItemOfKey(key: string) {
    const items: Category[] = await getItems();
    return items.find((item) => item.key === key);
  }

  return {
    isLoading: computed(() => processor.value.isLoading()),
    lastModified: computed(() => list.value.lastModified),
    items: computed(() => list.value.items),

    refresh,
    getItems,
    getItemOfId,
    getItemOfKey,
  };
});
