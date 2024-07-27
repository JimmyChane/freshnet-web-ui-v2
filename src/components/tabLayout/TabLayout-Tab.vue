<script setup lang="ts">
import { computed } from 'vue';

export interface Tab {
  key: string;
  title: string;
  icon?: string;
  count: number;
  primaryColor?: string;
  primaryColorTint?: string;

  click?: (tab: this) => void;
  isSelected?: (tab: this) => boolean;
}

const props = withDefaults(
  defineProps<{
    menu: Tab;
    isScreenWide?: boolean;
  }>(),
  { isScreenWide: true },
);

const title = computed(() => props.menu.title);
const icon = computed(() => props.menu.icon);
const count = computed(() => props.menu.count);
const primaryColor = computed(() => props.menu.primaryColor ?? 'black');
const primaryColorTint = computed(() => props.menu.primaryColorTint ?? 'transparent');

function isSelected() {
  if (typeof props.menu.isSelected === 'function') return props.menu.isSelected(props.menu);

  return false;
}
function click() {
  if (typeof props.menu.click === 'function') props.menu.click(props.menu);
}
</script>

<template>
  <button
    :class="['TabLayout-Tab', 'transition']"
    :style="{
      '--primary-color': primaryColor,
      '--primary-color-tint': primaryColorTint,
    }"
    :isExpand="`${isSelected() || isScreenWide}`"
    :isSelected="`${isSelected()}`"
    @click="() => click()"
  >
    <img v-if="icon" class="TabLayout-Tab-icon" :src="icon" />
    <span v-if="title.length" :class="['TabLayout-Tab-title', 'transition']">
      {{ title }}
    </span>
    <span v-if="typeof count === 'number'" class="TabLayout-Tab-count">({{ count }})</span>
  </button>
</template>

<style lang="scss" scoped>
.TabLayout-Tab {
  --primary-color: inherit;

  height: 2.4rem;
  border: none;
  border-radius: 0.8rem;
  font-size: 1rem;
  padding: 0.6rem;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  transition-timing-function: cubic-bezier(1, 0, 0, 1);

  .TabLayout-Tab-icon {
    z-index: 2;
    width: 1.5rem;
    height: 1.5rem;
    padding: 0.25rem;
  }
  .TabLayout-Tab-title {
    z-index: 1;
    text-align: start;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-weight: 600;
    transition-timing-function: cubic-bezier(1, 0, 0, 1);
    font-size: 0.9em;
  }
  .TabLayout-Tab-count {
    min-width: max-content;
    font-size: 0.8em;
  }
}

.TabLayout-Tab[isExpand='true'] {
  width: 10rem;
  width: 9rem;
  gap: 0.2rem;
}
.TabLayout-Tab[isExpand='false'] {
  width: 4rem;
  gap: 0;
  .TabLayout-Tab-title {
    width: 0;
    height: 0;
    opacity: 0;
  }
}

.TabLayout-Tab[isSelected='true'] {
  background: var(--primary-color);
  color: white;
}
.TabLayout-Tab[isSelected='false'] {
  cursor: pointer;
  background: var(--primary-color-tint);
  color: var(--primary-color);

  &:hover {
    background: #e2e2e2;
  }
}
</style>
