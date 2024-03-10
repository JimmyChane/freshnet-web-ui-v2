<script setup lang="ts">
  import { useSettingStore } from "@/data-stores/setting.store";
  import { useUserStore } from "@/data-stores/user.store";
  import { computed, onMounted, ref, watch } from "vue";
  import { SettingUI } from "../PageSetting";

  const props = defineProps<{ item: SettingUI }>();

  const values = ref([]);

  const isLoading = computed(() => useUserStore().isLoading);

  watch(() => useSettingStore().lastModified, invalidateValue);
  watch(() => props.item, invalidateValue);

  function invalidateValue() {
    const setting = props.item.findValue();
    values.value = setting?.value ?? [];
  }

  onMounted(() => invalidateValue());
</script>

<template>
  <div class="ItemSetting-List">
    <span class="ItemSetting-List-item" v-for="value of values" :key="value">{{
      value
    }}</span>
    <span class="ItemSetting-List-empty" v-if="!values.length">Empty</span>
  </div>
</template>

<style lang="scss" scoped>
  .ItemSetting-List {
    padding: 1rem;
    gap: 0.2rem;

    display: flex;
    flex-direction: column;
    align-items: stretch;
    background: white;

    .ItemSetting-List-item {
      border: 1px solid rgba(0, 0, 0, 0.2);
      padding: 0.5rem;
      border-radius: 0.3rem;
      font-size: 0.9rem;
    }
    .ItemSetting-List-empty {
      font-size: 0.8rem;
      color: hsl(0, 0%, 75%);
    }
  }
</style>
@/stores/data-stores/user.store