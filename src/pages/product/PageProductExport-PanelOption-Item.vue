<script setup lang="ts">
  import Selector from "@/components/selector/Selector.vue";
  import { computed } from "vue";
  import { Option } from "./PageProductExport";

  const props = defineProps<{ item: Option }>();

  const title = computed(() => props.item.title);
  const menus = computed(() => {
    return props.item.items.map((subItem) => {
      return {
        key: subItem.title,
        title: subItem.title,
        isSelected: () => subItem.isSelected(),
      };
    });
  });

  const selectedKey = computed(() => {
    const menu = menus.value.find((menu) => menu.isSelected());
    return menu?.key ?? "";
  });

  function clickMenu(key: string) {
    const menu = menus.value.find((menu) => menu.title === key);
    if (!menu) return;

    const item = props.item.items.find((item) => {
      return item.title === menu.key;
    });

    item?.click() ?? null;
  }
</script>

<template>
  <div class="PanelOption-Item">
    <span>{{ title }}</span>
    <Selector
      :list="menus"
      :keySelected="selectedKey"
      @callback-select="(key) => clickMenu(key)"
    />
  </div>
</template>

<style lang="scss" scoped>
  .PanelOption-Item {
    width: 100%;
    gap: 0.5rem;
    text-align: start;

    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
</style>
