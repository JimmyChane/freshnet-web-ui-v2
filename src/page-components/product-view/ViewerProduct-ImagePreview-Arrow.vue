<script setup lang="ts">
import IconDynamic from '@/components/IconDynamic.vue';
import chroma, { type Color } from 'chroma-js';

import IconArrowDownWhite from '@/assets/icon/arrowDown-white.svg';
import IconArrowDownDark from '@/assets/icon/arrowDown-black.svg';
import { Direction } from './Arrow';
import { computed } from 'vue';
import { isColorDark } from '@/utils/U';
import { serverIcon } from '@/data/Server';

const props = withDefaults(
  defineProps<{
    primaryColor?: Color;
    direction?: Direction;
    isShowing?: boolean;
  }>(),
  {
    direction: Direction.Left,
    isShowing: false,
  },
);

const isLeft = computed(() => props.direction === Direction.Left);
const isRight = computed(() => props.direction === Direction.Right);

const primaryColorIsDark = computed(() => {
  const primaryColor = chroma.valid(props.primaryColor) ? props.primaryColor : chroma('ffffff');
  return isColorDark(primaryColor, 60);
});

const rotation = computed(() => {
  if (isLeft.value) return '90deg';
  if (isRight.value) return '-90deg';
  return 'unset';
});
const arrowIcon = computed(() =>
  serverIcon(primaryColorIsDark.value ? 'arrowDown-white' : 'arrowDown-black').toUrl(),
);
</script>

<template>
  <button
    :class="['transition', 'ImagePreviewArrow', isShowing ? '' : 'ImagePreviewArrow-isHidden']"
    :style="{
      '--rotation': rotation,
      left: isLeft ? '0' : 'unset',
      right: isRight ? '0' : 'unset',
    }"
    @click="() => $emit('click')"
  >
    <IconDynamic
      class="ImagePreviewArrow-arrow transition"
      :primaryColor="primaryColor"
      :srcLight="IconArrowDownWhite"
      :srcDark="IconArrowDownDark"
    />
  </button>
</template>

<style lang="scss" scoped>
.ImagePreviewArrow {
  --rotation: 90deg;

  position: absolute;
  top: 3.5rem;
  bottom: 0;

  width: 4rem;
  height: calc(100% - 7rem);

  background: none;
  border: none;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  .ImagePreviewArrow-arrow {
    font-size: 1.8rem;
    padding: 0;

    opacity: 0.8;
    pointer-events: none;

    transform: rotate(var(--rotation));
  }

  &:hover {
    .ImagePreviewArrow-arrow {
      transform: rotate(var(--rotation)) scale(1.3);
    }
  }
}
.ImagePreviewArrow-isHidden {
  opacity: 0;
  pointer-events: none;
}
</style>
