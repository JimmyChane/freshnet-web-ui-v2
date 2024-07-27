<script setup lang="ts">
import { optArray } from '@/utils/U';
import { onMounted, ref, watch } from 'vue';

interface Menu {
  key: string;
  color: string;
  title: string;
}

const emits = defineEmits<{ clickItemKey: [string] }>();
const props = defineProps<{ items: Menu[] }>();

const selectedKey = defineModel<string>({ default: '' });

const list = ref<Menu[]>([]);

watch(() => props.items, onInvalidateList);

function onInvalidateList() {
  list.value = optArray(props.items).map((item) => item);
}

function selectKey(key: string) {
  selectedKey.value = key;
  emits('clickItemKey', selectedKey.value);
}

onMounted(() => {
  onInvalidateList();
});
</script>

<template>
  <div class="TypeSelector">
    <div class="TypeSelector-list">
      <button
        v-for="item of list"
        :key="item.key"
        :class="[
          item.key === selectedKey ? 'TypeSelector-item-selected' : '',
          'TypeSelector-item',
          'transition',
        ]"
        :style="{
          '--primary-color': item.color ? item.color : 'var(--primary-color)',
        }"
        @click="selectKey(item.key)"
      >
        {{ item.title }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.TypeSelector {
  display: flex;
  flex-direction: column;
}
.TypeSelector-list {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 0.2rem;
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
  overflow-x: auto;
  .TypeSelector-separator {
    min-width: 1px;
    height: 100%;
    max-height: calc(100% - 0.8rem);
    background: hsl(0, 0%, 90%);
    margin-left: 0.8rem;
    margin-right: 0.8rem;
  }
  .TypeSelector-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 7.5rem;
    min-width: max-content;
    border-width: 1px;
    border-style: solid;
    border-color: var(--primary-color);
    border-radius: 2rem;
    font-weight: 600;
    color: var(--primary-color);
    padding: 8px 24px;
    background: white;
    cursor: pointer;
    &:hover,
    &:focus {
      background: var(--primary-color);
      color: white;
    }
  }
  .TypeSelector-item-selected {
    background: var(--primary-color);
    color: white;
    cursor: initial;
  }
}
</style>
