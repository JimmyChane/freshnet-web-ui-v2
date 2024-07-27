<script setup lang="ts">
import { optObjectOnly } from '@/utils/U';
import Menus from './Actionbar-Menus.vue';
import { computed, useSlots } from 'vue';

const props = withDefaults(
  defineProps<{
    title?: string;
    leftMenus?: Object | any[];
    rightMenus?: Object | any[];
  }>(),
  { title: '', leftMenus: () => [], rightMenus: () => [] },
);
const LeftMenus = computed(() => parseMenus(props.leftMenus));
const RightMenus = computed(() => parseMenus(props.rightMenus));

const slots = useSlots();
const hasSlot = computed(() => {
  return !!slots.default;
});

function parseMenus(menus: Object | any[]) {
  if (Array.isArray(menus)) {
    return menus.filter((menu) => optObjectOnly(menu));
  }
  if (typeof menus === 'object') {
    return [menus];
  }
  return [];
}
</script>

<template>
  <div class="Actionbar transition">
    <Menus :style="{ 'justify-content': 'flex-start' }" :menus="LeftMenus" />
    <span class="Actionbar-title" v-if="title">{{ title }}</span>
    <slot v-if="hasSlot" />
    <Menus :style="{ 'justify-content': 'flex-end' }" :menus="RightMenus" />
  </div>
</template>

<style lang="scss" scoped>
.Actionbar {
  color: black;
  background: white;
  border-bottom: 1px solid hsl(0, 0%, 90%);

  position: sticky;
  top: 0;

  --height: 3.8rem;

  width: 100%;
  height: var(--height);
  min-height: var(--height);
  max-height: var(--height);
  padding: 0.4rem;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;

  .Actionbar-title {
    font-size: 1.5rem;
    white-space: nowrap;
    text-overflow: clip;
    color: inherit;

    margin: 0 0.8rem;
    overflow: hidden;

    display: flex;
    flex-direction: row;
    flex-grow: 1;
    align-items: center;
    justify-content: flex-start;
  }
}
</style>
