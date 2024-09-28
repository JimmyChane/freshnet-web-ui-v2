<script setup lang="ts">
import Drawer from '@/components/drawer/Drawer.vue';
import BottomsheetWindow from '@/components/window/BottomsheetWindow.vue';
import { computed, onMounted, watch } from 'vue';
import { useWindowStore } from '@/stores/window.store';
import { Edge, Mode } from '../drawer/Drawer';

const emits = defineEmits<{
  clickCollapse: [void];
  onShowing: [boolean];
  onWide: [boolean];
}>();
const props = withDefaults(
  defineProps<{
    wideWidthThreshold?: number;
    isShowing?: boolean;
    titleEmpty?: string;
  }>(),
  {
    wideWidthThreshold: 1200,
    isShowing: false,
    titleEmpty: 'Select to view',
  },
);

const isWide = computed(() => useWindowStore().width > props.wideWidthThreshold);
const drawerEdge = computed(() => Edge.RIGHT);
const drawerMode = computed(() => {
  if (isWide.value) {
    return props.isShowing ? Mode.FIXED_EXPAND : Mode.FIXED_COLLAPSE;
  } else {
    return props.isShowing ? Mode.DRAWER_EXPAND : Mode.DRAWER_COLLAPSE;
  }
});

watch(() => props.isShowing, emitShowing);
watch(() => isWide.value, emitWide);

function emitShowing() {
  emits('onShowing', props.isShowing);
}
function emitWide() {
  emits('onWide', isWide.value);
}

onMounted(() => {
  emitShowing();
  emitWide();
});
</script>

<template>
  <div class="PanelRight" :isWide="`${isWide}`" v-if="isWide">
    <div class="PanelRight-empty">
      <span class="PanelRight-empty-text">{{ titleEmpty }}</span>
    </div>

    <Drawer
      class="PanelRight-Drawer"
      :edge="drawerEdge"
      :mode="drawerMode"
      @click-collapse="() => $emit('click-collapse')"
    >
      <slot></slot>
    </Drawer>
  </div>

  <BottomsheetWindow
    v-else
    class="PanelRight-Bottomsheet"
    :isShowing="isShowing"
    @click-dismiss="() => $emit('click-collapse')"
  >
    <slot></slot>
  </BottomsheetWindow>
</template>

<style lang="scss" scoped>
.PanelRight {
  position: relative;

  width: 100dvw;
  height: 100dvh;
  max-width: 100%;
  max-height: 100%;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  overflow: hidden;

  .PanelRight-empty {
    z-index: 1;
    background: hsla(0, 0%, 0%, 0.6);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;

    .PanelRight-empty-text {
      font-weight: 600;
      font-size: 1.2rem;
      color: hsl(0, 0%, 84%);
      background: hsla(0, 0%, 0%, 0.04);
      border-radius: 1rem;
      padding: 4rem 5rem;
    }
  }
  .PanelRight-Drawer {
    z-index: 2;
  }

  & > * {
    width: 100dvw;
    max-width: 100%;
  }
}
</style>
