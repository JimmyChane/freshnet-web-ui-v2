import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { DataLoader } from '@/utils/DataLoader';
import { Processor } from '@/utils/Processor';
import { List } from '@/utils/List';
import { Ps2Disc, Ps2Request } from '@/data/Ps2Disc';

export const usePs2Store = defineStore('ps2', () => {
  const dataLoader = new DataLoader<Ps2Disc>(1000 * 60 * 10) // 10min
    .processor(() => processor.value as Processor | undefined)
    .setData((data) => list.value.clear().addItems(data))
    .getData(() => list.value.items)
    .loadData(async () => {
      const api = await Ps2Request.listDisc();
      const content: any[] = api.optArrayContent();
      const items = content.map((content) => {
        return new Ps2Disc(content);
      });
      return items.sort((a, b) => a.compare(b));
    });

  const processor = ref(new Processor());
  const list = ref(new List<Ps2Disc>());

  async function refresh() {
    dataLoader.doTimeout();
    await getItems();
  }
  async function getItems() {
    return dataLoader.data();
  }

  return {
    isLoading: computed(() => processor.value.isLoading()),
    lastModified: computed(() => list.value.lastModified),
    items: computed(() => list.value.items),

    refresh,
    getItems,
  };
});
