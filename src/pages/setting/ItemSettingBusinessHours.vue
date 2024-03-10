<script setup lang="ts">
  import SettingModule from "@/data/setting/Setting";
  import ItemSettingHeader from "./ItemSetting-Header.vue";
  import BusinessHoursItem from "./ItemSettingBusinessHours-Item.vue";
  import { onMounted, ref, watch } from "vue";
  import { useSettingStore } from "@/data-stores/setting.store";
  import WorkingDay from "@/data/working-day/WorkingDay";

  const key = ref(SettingModule.Key.CompanyWorkingHours);
  const title = ref("Business Hours (Readonly)");
  const values = ref<WorkingDay[]>([]);

  watch(() => useSettingStore().lastModified, invalidate);

  async function invalidate() {
    values.value = await useSettingStore().findValueOfKey({
      key: key.value,
      default: [],
    });
  }

  onMounted(() => invalidate());
</script>

<template>
  <div class="ItemSettingBusinessHours">
    <ItemSettingHeader :title="title" />

    <div class="ItemSettingBusinessHours-body">
      <BusinessHoursItem
        v-for="value of values"
        :key="value.title"
        :value="value as WorkingDay"
      />
      <span class="ItemSettingBusinessHours-empty" v-if="!values.length">
        Empty
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .ItemSettingBusinessHours {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-items: stretch;
    justify-content: flex-start;
    overflow: hidden;
    gap: 2px;
    border-radius: 1rem;

    .ItemSettingBusinessHours-body {
      padding: 1rem;
      gap: 0.2rem;

      display: flex;
      flex-direction: column;
      align-items: stretch;
      background: white;

      .ItemSettingBusinessHours-empty {
        font-size: 0.8rem;
        color: hsl(0, 0%, 75%);
      }
    }
  }
</style>
