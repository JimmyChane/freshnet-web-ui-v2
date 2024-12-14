<script setup lang="ts">
import { optArray } from '@/utils/U';
import LeftNavClickableBody from './NavigationDrawer-Clickable-Body.vue';
import { computed } from 'vue';
import type { NavigationParent, NavigationView } from '../NavigationDrawer';

const emits = defineEmits<{
  click: [NavigationParent | NavigationView];
  clickExpand: [NavigationParent | NavigationView];
}>();
const props = withDefaults(
  defineProps<{
    item: NavigationParent | NavigationView;
    href?: string;
    hasGroup2s?: boolean;
  }>(),
  {
    href: '',
    hasGroup2s: false,
  },
);

const isSelected = computed(() => props.item?.isSelected());
const isWide = computed(() => props.item?.isWide());
const isExpand = computed(() => props.item?.isExpanded());

const hasChildren = computed(() => {
  if ('groups' in props.item && Array.isArray(props.item.groups)) {
    return optArray(props.item.groups).length > 0;
  }

  return false;
});

const styleClass = computed(() => {
  return isSelected.value
    ? 'NavigationDrawer-Clickable-isSlected'
    : 'NavigationDrawer-Clickable-notSelected';
});
</script>

<template>
  <router-link
    v-if="href"
    :class="['NavigationDrawer-Clickable', styleClass]"
    :isWide="`${isWide}`"
    :isExpand="`${isSelected && isExpand}`"
    :hasGroup2IsSelected="`${hasGroup2s && isSelected}`"
    :to="{ path: href }"
    @click="() => emits('click', item)"
  >
    <LeftNavClickableBody
      :item="item"
      :isSelected="isSelected"
      :isWide="isWide"
      :isExpand="isExpand"
      :hasChildren="hasChildren"
      @click-open="(item) => emits('clickExpand', item)"
    />
  </router-link>

  <button
    v-else
    :class="['LeftNavQuery', styleClass]"
    :isSelectedIsExpanded="`${isSelected && isExpand}`"
    :hasGroup2IsSelected="`${hasGroup2s && isSelected}`"
    :isWide="`${isWide}`"
    @click="() => emits('click', item)"
  >
    <LeftNavClickableBody
      :item="item"
      :isSelected="isSelected"
      :isWide="isWide"
      :isExpand="isExpand"
      :hasChildren="hasChildren"
      @click-open="(item) => emits('clickExpand', item)"
    />
  </button>
</template>

<style lang="scss" scoped>
.NavigationDrawer-Clickable {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  background: none;
  border: none;
  text-align: start;
}

.NavigationDrawer-Clickable-isSelected {
  cursor: default;
}
.NavigationDrawer-Clickable-notSelected {
  cursor: pointer;
}
</style>
