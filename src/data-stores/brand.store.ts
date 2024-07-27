import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { DataLoader } from '@/utils/DataLoader';
import { Processor } from '@/utils/Processor';
import { List } from '@/utils/List';
import { Brand, BrandRequest } from '@/data/Brand';

export const useBrandStore = defineStore('brand', () => {
  const dataLoader = new DataLoader<Brand>(1000 * 60 * 10) // 10min
    .processor(() => processor.value as Processor | undefined)
    .setData((data) => list.value.clear().addItems(data))
    .getData(() => list.value.items)
    .loadData(async () => {
      const api = await BrandRequest.list();
      const content: any[] = api.optArrayContent();
      return content.map((content) => {
        return new Brand(content);
      });
    });

  const processor = ref(new Processor());
  const list = ref(new List<Brand>());

  async function refresh() {
    dataLoader.doTimeout();
    await getItems();
  }
  async function getItems() {
    return dataLoader.data();
  }
  async function getItemOfId(id: string) {
    let items: Brand[] = await getItems();
    return items.find((item) => item.id === id);
  }

  return {
    isLoading: computed(() => processor.value.isLoading()),
    lastModified: computed(() => list.value.lastModified),
    items: computed(() => list.value.items),

    refresh,
    getItems,
    getItemOfId,
  };
});
