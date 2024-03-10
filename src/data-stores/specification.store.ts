import { defineStore } from "pinia";
import { SpecificationRequest } from "@/data/specification/SpecificationRequest";
import { Type } from "@/data/specification/Specification";
import { computed, ref } from "vue";
import { DataLoader } from "./tools/DataLoader";
import { Processor } from "@/stores/tools/Processor";
import { List } from "./tools/List";

export const useSpecificationStore = defineStore("specification", () => {
  const dataLoader = new DataLoader<Type>(1000 * 60 * 10) // 10min
    .processor(() => processor.value as Processor | undefined)
    .setData((data) => list.value.clear().addItems(data))
    .getData(() => list.value.items)
    .loadData(async () => {
      const api = await SpecificationRequest.list();
      const content: any[] = api.optArrayContent();

      return content.map((content) => {
        return new Type().fromData(content);
      });
    });

  const processor = ref(new Processor());
  const list = ref(new List<Type>());

  async function refresh() {
    dataLoader.doTimeout();
    await getItems();
  }
  async function getItems() {
    return dataLoader.data();
  }
  async function getItemOfKey(key: string) {
    const items: Type[] = await getItems();
    return items.find((item) => item.key === key);
  }

  return {
    isLoading: computed(() => processor.value.isLoading()),
    lastModified: computed(() => list.value.lastModified),
    items: computed(() => list.value.items),

    refresh,
    getItems,
    getItemOfKey,
  };
});