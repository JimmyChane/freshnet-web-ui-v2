<script setup lang="ts">
import Item from './PopupMenu-Item.vue';
import chroma, { type Color } from 'chroma-js';
import { computed, onMounted, ref, watch } from 'vue';
import { type PopupMenu, Width, Corner, Alignment } from '../PopupMenu';

const props = defineProps<{ popupMenu: PopupMenu }>();

const width = ref(0);
const height = ref(0);
const halfWidth = ref(0);
const halfHeight = ref(0);
const x = ref(0);
const y = ref(0);
const classDirection = ref('');
const style = ref<Record<string, string>>({});

const selfIsShowing = ref(false);
const selfIsShown = ref(false);

const scroll = ref();

const isShowing = computed(() => props.popupMenu.isShowing);
const anchor = computed(() => props.popupMenu.anchor);
const menus = computed(() => props.popupMenu.menus);
const option = computed(() => props.popupMenu.option);

const preferWidth = computed(() => option.value.width);
const corner = computed(() => option.value.corner);
const alignment = computed(() => option.value.alignment);
const primaryColor = computed<Color>(() => {
  const primaryColor = option.value.primaryColor;
  if (chroma.valid(primaryColor)) return chroma(primaryColor);

  return chroma('cccccc');
});
const primaryColorBackground = computed(() => primaryColor.value.mix('ffffff', 0.8));
const primaryColorBackgroundHover = computed(() => primaryColor.value.mix('ffffff', 0.6));
const primaryColorBackgroundSelected = computed(() => primaryColor.value.mix('ffffff', 0.4));
const textAlign = computed(() => {
  if (menus.value.length > 1) return 'start';
  if (menus.value.length === 1 && menus.value[0].icon) return 'start';
  return 'center';
});

watch(() => isShowing.value, invalidateShowing);

function calculateCorner(corner: Corner, rect: DOMRect) {
  switch (corner) {
    case Corner.TOP:
      classDirection.value = 'PopupMenu-Top';
      x.value = rect.left + halfWidth.value;
      y.value = rect.top;
      break;
    case Corner.RIGHT:
      classDirection.value = 'PopupMenu-Right';
      x.value = rect.left + width.value;
      y.value = rect.top + halfHeight.value;
      break;
    case Corner.BOTTOM:
      classDirection.value = 'PopupMenu-Bottom';
      x.value = rect.left + halfWidth.value;
      y.value = rect.top + height.value;
      break;
    case Corner.LEFT:
      classDirection.value = 'PopupMenu-Left';
      x.value = rect.left;
      y.value = rect.top + halfHeight.value;
      break;
    case Corner.TOP_LEFT:
      classDirection.value = 'PopupMenu-TopLeft';
      x.value = rect.left;
      y.value = rect.top;
      break;
    case Corner.TOP_RIGHT:
      classDirection.value = 'PopupMenu-TopRight';
      x.value = rect.left + width.value;
      y.value = rect.top;
      break;
    case Corner.BOTTOM_LEFT:
      classDirection.value = 'PopupMenu-BottomLeft';
      x.value = rect.left;
      y.value = rect.top + height.value;
      break;
    case Corner.BOTTOM_RIGHT:
      classDirection.value = 'PopupMenu-BottomRight';
      x.value = rect.left + width.value;
      y.value = rect.top + height.value;
      break;
    default:
    case Corner.AUTO:
      const screenWidthHalf = window.innerWidth / 2;
      const screenHeightHalf = window.innerHeight / 2;

      let vertical;
      let horizontal;

      switch (alignment.value) {
        case Alignment.VERTICAL:
          vertical = rect.top > screenHeightHalf ? Corner.TOP : Corner.BOTTOM;
          break;
        case Alignment.HORIZONTAL:
          horizontal = rect.left > screenWidthHalf ? Corner.LEFT : Corner.RIGHT;
          break;
        default:
        case Alignment.AUTO:
        case Alignment.DIANGLE:
          vertical = rect.top > screenHeightHalf ? Corner.TOP : Corner.BOTTOM;
          horizontal = rect.left > screenWidthHalf ? Corner.LEFT : Corner.RIGHT;
          break;
      }

      if (vertical === Corner.TOP && horizontal === undefined) {
        return calculateCorner(Corner.TOP, rect);
      }
      if (vertical === Corner.BOTTOM && horizontal === undefined) {
        return calculateCorner(Corner.BOTTOM, rect);
      }
      if (vertical === undefined && horizontal === Corner.LEFT) {
        return calculateCorner(Corner.LEFT, rect);
      }
      if (vertical === undefined && horizontal === Corner.RIGHT) {
        return calculateCorner(Corner.RIGHT, rect);
      }
      if (vertical === Corner.TOP && horizontal === Corner.LEFT) {
        return calculateCorner(Corner.TOP_LEFT, rect);
      }
      if (vertical === Corner.TOP && horizontal === Corner.RIGHT) {
        return calculateCorner(Corner.TOP_RIGHT, rect);
      }
      if (vertical === Corner.BOTTOM && horizontal === Corner.LEFT) {
        return calculateCorner(Corner.BOTTOM_LEFT, rect);
      }
      if (vertical === Corner.BOTTOM && horizontal === Corner.RIGHT) {
        return calculateCorner(Corner.BOTTOM_RIGHT, rect);
      }

      break;
  }
}

function invalidateShowing() {
  isShowing.value ? show() : hide();
}
function show() {
  if (selfIsShown.value && selfIsShowing.value) {
    return;
  }

  window.addEventListener('scroll', hide, true);
  selfIsShowing.value = true;
  setTimeout(() => {
    selfIsShowing.value = false;
    selfIsShown.value = true;
    style.value['pointer-events'] = 'initial';
  }, 1);
}
function hide(event?: Event) {
  if (!selfIsShown.value) return;
  if (event?.target === scroll.value) return;

  props.popupMenu.hide();
  selfIsShown.value = false;
  window.removeEventListener('scroll', hide, true);
  style.value['pointer-events'] = 'none';
}
function clickMenu(menu?: any) {
  if (typeof menu.click === 'function') {
    menu.click(menu);
    hide();
  }
}

onMounted(() => {
  const rect = anchor.value.getBoundingClientRect();
  width.value = rect.width;
  height.value = rect.height;
  halfWidth.value = rect.width / 2;
  halfHeight.value = rect.height / 2;

  calculateCorner(corner.value, rect);

  style.value = {
    '--x': `${x.value}px`,
    '--y': `${y.value}px`,
    '--width': `${width.value}px`,
    '--height': `${height.value}px`,
    '--halfWidth': `${halfWidth.value}px`,
    '--halfHeight': `${halfHeight.value}px`,
    '--primary-color-background': `${primaryColorBackground.value}`,
    'text-align': textAlign.value,
    'pointer-events': 'none',
  };

  switch (preferWidth.value) {
    case Width.MIN:
      style.value['min-width'] = 'min-content';
      style.value['width'] = 'min-content';
      break;
    case Width.MAX:
      style.value['min-width'] = `${width.value}px`;
      style.value['width'] = 'max-content';
      break;
    case Width.SAME:
      style.value['min-width'] = `${width.value}px`;
      style.value['width'] = `${width.value}px`;
      break;
  }

  show();
});
</script>

<template>
  <div
    :class="['PopupMenu', 'transition', classDirection]"
    :style="style"
    :isShowing="`${selfIsShown}`"
  >
    <div class="PopupMenu-scroll scrollbar" ref="scroll">
      <Item
        class="transition"
        v-for="menu of menus"
        :key="menu.key"
        :menu="menu"
        :primaryColorBackgroundHover="primaryColorBackgroundHover"
        :primaryColorBackgroundSelected="primaryColorBackgroundSelected"
        @click="(menu) => clickMenu(menu)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.PopupMenu {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  overflow: hidden;

  min-width: 10em;
  width: max-content;
  height: max-content;
  max-height: 20em;
  text-align: center;

  border-radius: 1em;
  box-shadow: 0.1em 0.2em 1em hsla(0, 0%, 0%, 0.4);
  box-shadow: 0 0 2em hsla(0, 0%, 0%, 0.4);
  border: 1px solid hsla(0, 0%, 0%, 0.1);
  --transition-timing: cubic-bezier(1, 0, 0, 1);

  .PopupMenu-scroll {
    --padding-horizontal: 0.5em;

    padding: var(--padding-horizontal) 0;
    padding-right: 1px;
    min-width: inherit;
    width: inherit;
    height: inherit;
    max-height: inherit;
    height: 100%;
    max-height: 100%;

    overflow-x: hidden;
    overflow-y: auto;
    --scrollbar-size: 0.4em;
    --scrollbar-thumb-radius: 0.4em;
    --scrollbar-thumb-color: hsla(0, 0%, 0%, 0.1);
    --scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.6);
    --scrollbar-track-margin: var(--padding-horizontal);

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    background: var(--primary-color-background);
  }

  position: absolute;
  top: var(--y);
  left: var(--x);
}

.PopupMenu[isShowing='true'] {
  opacity: 1;
  transform: var(--transform-end);
}
.PopupMenu[isShowing='false'] {
  opacity: 0;
  transform: var(--transform-start);
}

.PopupMenu-Top {
  --transform-start: translateX(calc(0px - 50%)) translateY(calc(0px - 100% + var(--halfHeight)));
  --transform-end: translateX(calc(0px - 50%)) translateY(calc(0px - 100%));
}
.PopupMenu-Right {
  --transform-start: translateX(calc(0px - var(--halfWidth))) translateY(calc(0px - 50%));
  --transform-end: translateX(calc(0px)) translateY(calc(0px - 50%));
}
.PopupMenu-Bottom {
  --transform-start: translateX(calc(0px - 50%)) translateY(calc(0px - var(--halfHeight)));
  --transform-end: translateX(calc(0px - 50%)) translateY(0px);
}
.PopupMenu-Left {
  --transform-start: translateX(calc(0px - 100% + var(--halfWidth))) translateY(calc(0px - 50%));
  --transform-end: translateX(calc(0px - 100%)) translateY(calc(0px - 50%));
}

.PopupMenu-TopLeft {
  --transform-start: translateX(calc(0px - 100% + var(--halfWidth)))
    translateY(calc(0px - 100% + var(--halfHeight)));
  --transform-end: translateX(calc(0px - 100% + calc(var(--halfWidth) * 0.5)))
    translateY(calc(0px - 100% + calc(var(--halfHeight) * 0.5)));
}
.PopupMenu-TopRight {
  --transform-start: translateX(calc(0px - var(--halfWidth)))
    translateY(calc(0px - 100% + var(--halfHeight)));
  --transform-end: translateX(calc(0px - calc(var(--halfWidth) * 0.5)))
    translateY(calc(0px - 100% + calc(var(--halfHeight) * 0.5)));
}
.PopupMenu-BottomLeft {
  --transform-start: translateX(calc(0px - 100% + var(--halfWidth)))
    translateY(calc(0px - var(--halfHeight)));
  --transform-end: translateX(calc(0px - 100% + calc(var(--halfWidth) * 0.5)))
    translateY(calc(0px - calc(var(--halfHeight) * 0.5)));
}
.PopupMenu-BottomRight {
  --transform-start: translateX(calc(0px - var(--halfWidth)))
    translateY(calc(0px - var(--halfHeight)));
  --transform-end: translateX(calc(0px - calc(var(--halfWidth) * 0.5)))
    translateY(calc(0px - calc(var(--halfHeight) * 0.5)));
}
</style>
