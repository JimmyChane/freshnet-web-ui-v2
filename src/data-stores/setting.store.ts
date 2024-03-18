import { defineStore } from "pinia";
import { Setting } from "@/data/setting/Setting";
import { Contact } from "@/data/contact/Contact";
import { computed, ref } from "vue";
import { SettingRequest } from "@/data/setting/SettingRequest";
import { WorkingDay, type WorkingDayData } from "@/data/working-day/WorkingDay";
import { DataLoader } from "./tools/DataLoader";
import { Processor } from "@/stores/tools/Processor";
import { List } from "./tools/List";

const isPredefinedSetting = (key: string) => {
  return [
    Setting.Key.Contacts,
    Setting.Key.CompanyName,
    Setting.Key.CompanyCategory,
    Setting.Key.CompanyWorkingHours,
  ].includes(key);
};

export const useSettingStore = defineStore("setting", () => {
  const dataLoader = new DataLoader<Setting>(1000 * 60 * 10) // 10min
    .processor(() => processor.value as Processor | undefined)
    .setData((data) => list.value.clear().addItems(data))
    .getData(() => list.value.items)
    .loadData(async () => {
      const api = await SettingRequest.list();
      const list: any[] = api.optArrayContent();
      const items = list.map((content) => {
        return new Setting(content);
      });

      const contacts = [
        new Contact({
          title: "Beh Aik Keong",
          links: [
            { category: "call", id: "0167959444" },
            { category: "whatsapp", id: "0167959444" },
          ],
        }),
        new Contact({
          title: "Office (Mobile)",
          links: [
            { category: "call", id: "0146315353" },
            { category: "whatsapp", id: "0146315353" },
            { category: "telegram", id: "FreshnetEnterprise" },
          ],
        }),
        new Contact({
          title: "Office",
          links: [{ category: "telephone", id: "0332897297" }],
        }),
      ];

      const workingDayDatas: WorkingDayData[] = [
        { title: "Monday", timeStart: "0900", timeEnd: "1900" },
        { title: "Tuesday", timeStart: "0900", timeEnd: "1900" },
        { title: "Wednesday", timeStart: "0900", timeEnd: "1900" },
        { title: "Thursday", timeStart: "0900", timeEnd: "1900" },
        { title: "Friday", timeStart: "0900", timeEnd: "1900" },
        { title: "Saturday", timeStart: "0900", timeEnd: "1900" },
        { title: "Sunday", timeStart: "1000", timeEnd: "1830" },
      ];
      const days = workingDayDatas.reduce((workingDays: WorkingDay[], data) => {
        workingDays.push(new WorkingDay(data, workingDays));
        return workingDays;
      }, []);

      return [
        ...items.filter((item) => !isPredefinedSetting(item.key)),
        new Setting({
          key: Setting.Key.CompanyWorkingHours,
          visibility: Setting.Visibility.Protected,
          value: days,
        }),
        new Setting({
          key: Setting.Key.Contacts,
          visibility: Setting.Visibility.Protected,
          value: contacts,
        }),
        new Setting({
          key: Setting.Key.CompanyName,
          visibility: Setting.Visibility.Protected,
          value: "Freshnet Enterprise",
        }),
        new Setting({
          key: Setting.Key.CompanyCategory,
          visibility: Setting.Visibility.Protected,
          value: "Computer Store",
        }),
      ];
    });

  const processor = ref(new Processor());
  const list = ref(new List<Setting>());

  async function refresh() {
    dataLoader.doTimeout();
    await getItems();
  }
  async function getItems() {
    return dataLoader.data();
  }
  async function updateItem(arg: { key: string; value: string | boolean }) {
    const { key, value } = arg;

    if (isPredefinedSetting(key)) throw new Error("testing");

    const setting = new Setting({ key, value }).toData();
    const api = await SettingRequest.update(setting);
    const content = api.getObjectContent();

    list.value.updateItemById(content.key, (item) => {
      if (!item) return;
      item.value = content.value;
    });

    return list.value.items;
  }
  async function findItemOfKey(arg = { key: "" }) {
    const { key } = arg;
    const items: Setting[] = await getItems();
    return items.find((item) => item.key === key);
  }
  async function findValueOfKey(arg: { key: string; default?: any }) {
    const { key = "", default: defaultValue = "" } = arg;
    const item = await findItemOfKey({ key });
    return item?.value ?? defaultValue;
  }

  return {
    isLoading: computed(() => processor.value.isLoading()),
    lastModified: computed(() => list.value.lastModified),
    items: computed(() => list.value.items),

    refresh,
    getItems,
    updateItem,
    findItemOfKey,
    findValueOfKey,
  };
});
