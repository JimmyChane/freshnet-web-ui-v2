<script setup lang="ts">
  import chroma, { type Color } from "chroma-js";
  import IconArrowDownLight from "@/assets/icon/arrowDown-white.svg";
  import IconArrowDownDark from "@/assets/icon/arrowDown-black.svg";
  import { computed } from "vue";

  const props = withDefaults(
    defineProps<{
      primaryColor?: Color;
      direction: "left" | "right";
      isShowing?: boolean;
    }>(),
    { isShowing: false },
  );

  const primaryColorIsDark = computed((c) => {
    if (!props.primaryColor) return chroma("ffffff");

    const primaryColor = chroma.valid(props.primaryColor)
      ? props.primaryColor
      : chroma("ffffff");
    return chroma.deltaE(primaryColor, "000000") < 60;
  });

  const rotation = computed(() => {
    if (props.direction === "left") return "90deg";
    if (props.direction === "right") return "-90deg";
    return "unset";
  });
  const arrowIcon = computed(() => {
    return primaryColorIsDark.value ? IconArrowDownLight : IconArrowDownDark;
  });
</script>

<template>
  <button
    :class="[
      'PagePrintTabsArrow',
      isShowing ? '' : 'PagePrintTabsArrow-isHidden',
      'transition',
    ]"
    :style="{
      '--rotation': rotation,
      left: direction === 'left' ? '1rem' : 'unset',
      right: direction === 'right' ? '1rem' : 'unset',
    }"
    @click="() => $emit('click')"
  >
    <img class="PagePrintTabsArrow-arrow transition" :src="arrowIcon" />
  </button>
</template>

<style lang="scss" scoped>
  .PagePrintTabsArrow {
    --rotation: 90deg;

    position: absolute;
    top: 0;
    bottom: 0;

    --size: 2.2rem;
    width: var(--size);
    height: var(--size);
    aspect-ratio: 1;

    border-radius: 0.5rem;
    overflow: hidden;

    background: hsla(0, 0%, 100%, 0.9);
    border: none;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    .PagePrintTabsArrow-arrow {
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
  .PagePrintTabsArrow-isHidden {
    opacity: 0;
    pointer-events: none;
  }
</style>
