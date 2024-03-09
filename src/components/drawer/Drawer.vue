<script setup lang="ts">
  import { type StyleValue, computed, ref } from "vue";
  import { Mode, Edge } from "./Drawer";

  const emits = defineEmits<{ clickCollapse: [void] }>();
  const props = withDefaults(defineProps<{ mode?: Mode; edge?: Edge }>(), {
    mode: Mode.DRAWER_COLLAPSE,
    edge: Edge.NONE,
  });

  const isDragging = ref(false);
  const dragStart = ref(0);
  const dragEnd = ref(0);
  const dragPercent = ref(0);
  const dragX = ref(0);
  const dragY = ref(0);

  const isLeft = computed(() => props.edge === Edge.LEFT);
  const isRight = computed(() => props.edge === Edge.RIGHT);

  const isFixedExpand = computed(
    () => props.mode === Mode.FIXED_EXPAND || props.mode === Mode.FIXED,
  );
  const isFixedCollapse = computed(() => props.mode === Mode.FIXED_COLLAPSE);
  const isDrawer = computed(
    () => isDrawerExpand.value || isDrawerCollapse.value,
  );
  const isDrawerExpand = computed(() => props.mode === Mode.DRAWER_EXPAND);
  const isDrawerCollapse = computed(() => props.mode === Mode.DRAWER_COLLAPSE);

  const refBody = ref<HTMLDivElement>();

  const point = computed(() => {
    if (isLeft.value) {
      return { xStart: "-100%", xEnd: "0%", yStart: "0%", yEnd: "0%" };
    }
    if (isRight.value) {
      return { xStart: "100%", xEnd: "0%", yStart: "0%", yEnd: "0%" };
    }
    return { xStart: "0%", xEnd: "0%", yStart: "0%", yEnd: "0%" };
  });

  const classEdge = computed(() => {
    if (isLeft.value) return "Drawer-DIRECTION_LEFT";
    if (isRight.value) return "Drawer-DIRECTION_RIGHT";
    return "";
  });
  const classModes = computed(() => {
    if (isFixedExpand.value) return ["Drawer-FIXED", "Drawer-FIXED_EXPAND"];
    if (isFixedCollapse.value) return ["Drawer-FIXED", "Drawer-FIXED_COLLAPSE"];
    if (isDrawerExpand.value) return ["Drawer-DRAWER", "Drawer-DRAWER_EXPAND"];
    if (isDrawerCollapse.value)
      return ["Drawer-DRAWER", "Drawer-DRAWER_COLLAPSE"];
    return "";
  });

  const style = computed(() => {
    const style: StyleValue = {
      "--x-start": point.value.xStart,
      "--y-start": point.value.yStart,
      "--x-end": point.value.xEnd,
      "--y-end": point.value.yEnd,
    };

    if (!isDragging.value) {
      style["--body-transition-duration"] = "var(--transition-duration)";
      style["--body-transition-timing-function"] = "cubic-bezier(1, 0, 0, 1)";
    }

    if (isDragging.value) {
      style["--drag-x"] = `${dragX.value}px`;
      style["--drag-y"] = `${dragY.value}px`;
      style["--drag-percent"] = `${dragPercent.value}`;
      style["--body-shadow"] = "box-shadow: 0 0 1rem hsl(0, 0%, 0%);";
    }
    if (!isDragging.value && isDrawerExpand.value) {
      style["--drag-percent"] = 1;
    }
    if (!isDragging.value && isDrawerCollapse.value) {
      style["--drag-percent"] = 0;
    }

    return style;
  });
  const styleBody = computed(() => {
    if (!isDragging.value && isDrawer.value) return "none";
    // if (this.isLeft) return { "border-right": "1px solid hsl(0, 0%, 80%)" };
    // if (this.isRight) return { "border-left": "1px solid hsl(0, 0%, 80%)" };
    return "none";
  });

  function onDragStart(x: number, y: number) {
    if (!isDrawerCollapse.value) return;

    const Body = refBody.value;
    if (!Body) return;

    isDragging.value = true;
    dragStart.value = -Body.offsetWidth;
    dragEnd.value = 0;
    dragX.value = x;
    dragY.value = y;
  }
  function onDragMove(x: number, y: number) {
    if (!isDragging.value) return;

    dragPercent.value = Math.abs(x / dragStart.value);

    dragX.value = x;
    dragY.value = y;
  }
  function onDragEnd(x: number, y: number) {
    if (!isDragging.value) return;
    isDragging.value = false;
    dragX.value = 0;
    dragY.value = 0;
  }

  defineExpose({ onDragStart, onDragMove, onDragEnd });
</script>

<template>
  <div
    :class="['transition', 'Drawer', classEdge, ...classModes]"
    :style="style"
  >
    <div class="Drawer-body" ref="refBody" :style="styleBody"><slot /></div>

    <div
      class="Drawer-dismissableBox"
      v-if="isDrawer"
      @click="$emit('click-collapse')"
    ></div>

    <div class="Drawer-background transition" v-if="isDrawer"></div>
  </div>
</template>

<style lang="scss" scoped>
  .Drawer {
    display: flex;

    .Drawer-body {
      z-index: 3;
      flex-shrink: 1;
      width: 100%;
      height: 100%;
      max-width: max-content;
      max-height: max-content;
      display: flex;
      flex-direction: column;
    }
    .Drawer-dismissableBox {
      z-index: 2;
      flex-grow: 1;
      width: 100%;
    }
    .Drawer-background {
      z-index: 1;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;

      background: hsla(0, 0%, 0%, 0.7);
      pointer-events: none;

      @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
        font-size: 1rem;
        -webkit-backdrop-filter: blur(calc(0.4em * var(--dragPercent)));
        backdrop-filter: blur(calc(0.4em * var(--dragPercent)));
      }
    }
  }

  .Drawer-DIRECTION_LEFT {
    flex-direction: row;
    top: 0;
    bottom: 0;
    left: 0;
  }
  .Drawer-DIRECTION_RIGHT {
    flex-direction: row-reverse;
    top: 0;
    bottom: 0;
    right: 0;
  }

  .Drawer-FIXED {
    width: max-content;
    height: 100%;
    position: sticky;

    .Drawer-body {
      transition-duration: var(--transition-duration);
      transition-timing-function: cubic-bezier(1, 0, 0, 1);
    }
  }
  .Drawer-FIXED_EXPAND {
    .Drawer-body {
      transform: translateX(var(--x-end)) translateY(var(--y-end));
    }
  }
  .Drawer-FIXED_COLLAPSE {
    .Drawer-body {
      transform: translateX(var(--x-start)) translateY(var(--y-start));
      box-shadow: 0 0 1rem hsla(0, 0%, 0%, 0.2);
    }
  }

  .Drawer-DRAWER {
    height: 100%;
    width: 100%;
    position: absolute;

    --drag-x: 0px;
    --drag-y: 0px;
    --drag-percent: 0;
    --body-shadow: unset;
    --body-transition-duration: unset;
    --body-transition-timing-function: unset;
    .Drawer-body {
      box-shadow: var(--body-shadow);
      transition-duration: var(--body-transition-duration);
      transition-timing-function: var(--body-transition-timing-function);
    }
    .Drawer-background {
      opacity: var(--drag-percent);
      @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
        font-size: 1rem;
        -webkit-backdrop-filter: blur(calc(0.4em * var(--dragPercent)));
        backdrop-filter: blur(calc(0.4em * var(--dragPercent)));
      }
    }
  }
  .Drawer-DRAWER_EXPAND {
    position: absolute;
    .Drawer-body {
      transform: translateX(var(--x-end)) translateY(var(--y-end));
    }
    .Drawer-dismissableBox {
      display: block;
    }
  }
  .Drawer-DRAWER_COLLAPSE {
    pointer-events: none;
    .Drawer-body {
      transform: translateX(calc(var(--x-start) + var(--drag-x)))
        translateY(var(--y-start));
    }
    .Drawer-dismissableBox {
      display: none;
    }
  }
</style>
