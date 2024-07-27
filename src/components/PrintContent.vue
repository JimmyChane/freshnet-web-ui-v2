<script setup lang="ts">
import { printElement } from '@/data/Print';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';

const props = withDefaults(defineProps<{ width?: number; height?: number }>(), {
  width: 0,
  height: 0,
});

const parent = ref<HTMLDivElement>();
const canvas = ref<HTMLDivElement>();

const parentWidth = ref(0);
const parentHeight = ref(0);

const scaleWidth = computed(() => parentWidth.value / props.width);
const scaleHeight = computed(() => parentHeight.value / props.height);
const scale = computed(() =>
  scaleWidth.value > scaleHeight.value ? scaleHeight.value : scaleWidth.value,
);

function invalidateCard(repeatTimeout: number = 300) {
  if (!parent.value) return;

  parentWidth.value = parent.value.offsetWidth;
  parentHeight.value = parent.value.offsetHeight;

  if (repeatTimeout) {
    setTimeout(() => invalidateCard(0), repeatTimeout);
  }
}
function print() {
  if (canvas.value) printElement(canvas.value);
}
function listenerResize() {
  invalidateCard();
}

onBeforeMount(() => {
  window.addEventListener('resize', listenerResize);
});
onMounted(() => {
  invalidateCard();
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', listenerResize);
});

defineExpose({ print });
</script>

<template>
  <div class="PrintContent" ref="parent">
    <div
      class="PrintContent-canvas"
      ref="canvas"
      :style="{
        '--width': `${width}px`,
        '--height': `${height}px`,
        '--scale': `${scale}`,
      }"
    >
      <slot :scale="scale" :width="width" :height="height" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.PrintContent {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .PrintContent-canvas {
    width: var(--width);
    height: var(--height);
    min-width: var(--width);
    min-height: var(--height);
    max-width: var(--width);
    max-height: var(--height);

    background: white;
    box-shadow: 0 0 1rem hsla(0, 0%, 0%, 0.2);
    transform: scale(var(--scale));
    position: absolute;
    top: calc(0 - var(--height) * var(--scale));
    left: calc(0 - var(--width) * var(--scale));
    overflow: hidden;
  }
}
</style>
