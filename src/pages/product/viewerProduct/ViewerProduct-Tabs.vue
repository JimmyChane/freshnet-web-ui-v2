<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import TabVue from "./ViewerProduct-Tabs-Tab.vue";
  import type { Tab } from "./Tab";

  const emits = defineEmits<{ clickItem: [Tab] }>();
  const props = defineProps<{ items: Tab[] }>();

  const self = ref<HTMLDivElement>();
  const tabs = ref<(typeof TabVue)[]>();

  const item = computed(() =>
    props.items.find((item) => {
      if (typeof item.isSelected === "function") {
        return item.isSelected();
      }
      return false;
    }),
  );

  watch(() => item, onItemChange);

  function onItemChange() {
    const xItem = item.value;
    setTimeout(() => {
      if (xItem === item.value) scrollToItem();
    }, 300);
  }
  function scrollToItem() {
    const xItem = item.value;

    if (xItem === undefined) return;
    if (self.value === undefined) return;

    const element = self.value;
    const child = (tabs.value ?? [])[props.items.indexOf(xItem)];
    const childElement = child.$el ?? null;

    if (!childElement) return;

    const parentHalfWidth = element.offsetWidth / 2;
    const childCenter = childElement.offsetLeft + childElement.offsetWidth / 2;

    element.scrollTo({
      left: childCenter - parentHalfWidth,
      behavior: "smooth",
    });
  }
</script>

<template>
  <div class="ProductViewerTabs scrollbar" ref="self">
    <TabVue
      v-for="item of items"
      ref="tabs"
      :key="item.title"
      :item="item"
      @click="() => emits('clickItem', item)"
    />
  </div>
</template>

<style lang="scss" scoped>
  .ProductViewerTabs {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0 0.5rem;
  }
</style>
