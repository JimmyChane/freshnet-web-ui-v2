<script setup lang="ts">
import chroma from 'chroma-js';
import IconArrowDownLight from '@/assets/icon/arrowDown-white.svg';
import IconArrowDownDark from '@/assets/icon/arrowDown-black.svg';
import { computed } from 'vue';
import { isColorDark } from '@/utils/U';

const Direction = { Left: 1, Right: 2 };

const props = withDefaults(
  defineProps<{
    primaryColor: Object;
    direction?: number;
    isShowing?: boolean;
  }>(),
  { direction: Direction.Left, isShowing: false },
);

const isLeft = computed(() => props.direction === Direction.Left);
const isRight = computed(() => props.direction === Direction.Right);

const primaryColorIsDark = computed(() => {
  const xPrimaryColor = chroma.valid(props.primaryColor) ? props.primaryColor : chroma('ffffff');
  return isColorDark(xPrimaryColor, 60);
});

const rotation = computed(() => {
  if (isLeft.value) return '90deg';
  if (isRight.value) return '-90deg';
  return 'unset';
});
const arrowIcon = computed(() =>
  primaryColorIsDark.value ? IconArrowDownLight : IconArrowDownDark,
);
</script>

<template>
  <button
    :class="['PanelProductsGroupArrow', 'transition']"
    :style="{
      '--rotation': rotation,
      left: isLeft ? '0' : 'unset',
      right: isRight ? '0' : 'unset',
    }"
    :isShowing="`${isShowing}`"
    @click="() => $emit('click')"
  >
    <img class="PanelProductsGroupArrow-arrow" :src="arrowIcon" />
  </button>
</template>

<style lang="scss" scoped>
.PanelProductsGroupArrow {
  --rotation: 90deg;

  --size: 3rem;
  width: var(--size);
  height: var(--size);
  min-width: var(--size);
  min-height: var(--size);
  max-width: var(--size);
  max-height: var(--size);
  aspect-ratio: 1;

  position: sticky;
  top: calc(50% - var(--size));
  bottom: 0;

  border-radius: 0.5rem;
  overflow: hidden;

  background: hsla(0, 0%, 100%, 0.9);
  box-shadow: 0 0 2rem hsla(0, 0%, 0%, 0.2);
  border: 1px solid hsla(0, 0%, 0%, 0.2);
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  .PanelProductsGroupArrow-arrow {
    --size: 0.8rem;
    width: var(--size);
    height: var(--size);
    opacity: 0.66;
    pointer-events: none;
    transform: rotate(var(--rotation));
  }

  &:hover {
    transform: scale(1.05);
  }
}
.PanelProductsGroupArrow[isShowing='false'] {
  opacity: 0;
  pointer-events: none;
}
</style>
