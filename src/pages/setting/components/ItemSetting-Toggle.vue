<script setup lang="ts">
  import ToggleButton from "@/components/button/ToggleButton.vue";
  import { useSettingStore } from "@/data-stores/setting.store";
  import { useUserStore } from "@/data-stores/user.store";
  import { computed, onMounted, ref, watch } from "vue";
  import { SettingUI } from "../PageSetting";

  const props = defineProps<{ item: SettingUI }>();

  const toggleButtonRef = ref<typeof ToggleButton>();

  const value = ref();

  const isLoading = computed(() => useUserStore().isLoading);
  const title = computed(() => props.item.getTitle());

  watch(() => useSettingStore().lastModified, invalidateValue);
  watch(() => props.item, invalidateValue);

  function invalidateValue() {
    const setting = props.item.findValue();
    value.value = setting?.value ?? undefined;
  }

  onMounted(() => invalidateValue);
</script>

<template>
  <div
    class="ItemSetting-Toggle transition"
    @click="() => toggleButtonRef?.click()"
  >
    <span class="ItemSetting-Toggle-title" v-if="title">{{ title }}</span>
    <ToggleButton
      class="ItemSetting-Toggle-value"
      ref="toggleButtonRef"
      :isLoading="isLoading"
      :isToggled="value"
      @click-toggle="(toggle) => item.updateValue(toggle)"
    />
  </div>
</template>

<style lang="scss" scoped>
  .ItemSetting-Toggle {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    padding: 1rem 0.8rem;

    font-size: 0.9rem;
    background: white;
    cursor: pointer;

    &:hover {
      background: hsl(0, 0%, 90%);
    }
  }
</style>
@/stores/data-stores/user.store