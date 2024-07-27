<script setup lang="ts">
import Tab from './PagePrint-Tabs-Tab.vue';
import Arrow from './PagePrint-Tabs-Arrow.vue';
import { computed, ref, watch } from 'vue';

interface Item {
  title: string;
  isSelected: () => boolean;
  click: () => void;
}

const props = defineProps<{ items: Item[] }>();

const scrollRef = ref<HTMLDivElement>();
const scrollLeft = ref(0);

const selectedItem = computed(() => {
  return props.items.find((item) => item.isSelected());
});

watch(() => selectedItem.value, onItemChange);

function onItemChange() {
  if (!selectedItem.value) return;
  const xSelectedItem = selectedItem.value;

  setTimeout(() => {
    if (xSelectedItem === selectedItem.value) scrollToItem(selectedItem.value);
  }, 300);
}
function scrollToItem(item: Item) {
  if (!scrollRef.value) return;

  const element = scrollRef.value;
  const childElement = scrollRef.value.children[props.items.indexOf(item)] as
    | HTMLElement
    | undefined;
  if (!childElement) return;

  const parentHalfWidth = element.offsetWidth / 2;
  const childCenter = childElement.offsetLeft + childElement.offsetWidth / 2;

  element.scrollTo({
    left: childCenter - parentHalfWidth,
    behavior: 'smooth',
  });
}

function clickPrevious() {
  if (!selectedItem.value) return;
  const currentIndex = props.items.indexOf(selectedItem.value);
  scrollToIndex(currentIndex - 1);
}
function clickNext() {
  if (!selectedItem.value) return;
  const currentIndex = props.items.indexOf(selectedItem.value);
  scrollToIndex(currentIndex + 1);
}
function scrollToIndex(index: number) {
  if (index > props.items.length - 1) return;
  if (index <= 0) return;

  const item = props.items[index];
  item.click();
}
</script>

<template>
  <div class="PagePrintTabs">
    <div
      class="PagePrintTabs-items scrollbar"
      :style="{ 'z-index': '1' }"
      ref="scrollRef"
      @scroll="(e) => (scrollLeft = (e.target as HTMLDivElement).scrollLeft)"
    >
      <Tab
        v-for="item of items"
        :key="item.title"
        :item="item"
        @click="() => $emit('click-item', item)"
      />
    </div>

    <Arrow
      v-if="items.length"
      :style="{ 'z-index': '2' }"
      direction="left"
      :isShowing="scrollLeft > 0"
      @click="() => clickPrevious()"
    />
    <Arrow
      v-if="items.length"
      :style="{ 'z-index': '2' }"
      direction="right"
      :isShowing="true"
      @click="() => clickNext()"
    />
  </div>
</template>

<style lang="scss" scoped>
.PagePrintTabs {
  width: 100%;
  min-height: 2.5rem;
  position: relative;

  display: flex;
  flex-direction: row;
  align-items: center;

  .PagePrintTabs-items {
    width: inherit;
    min-height: inherit;
    padding: 0 0.5rem;
    padding-right: 50%;

    display: flex;
    flex-direction: row;
    align-items: center;

    overflow-x: scroll;
    overflow-y: hidden;

    scroll-snap-type: x proximity;

    & > * {
      scroll-snap-align: center;
    }
  }
}
</style>
