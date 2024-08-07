<script setup lang="ts">
import PopupWindow from '@/stores/popup-window/components/PopupWindow.vue';
import Actionbar from '@/components/actionbar/Actionbar.vue';
import Loading from '@/components/loading/Loading.vue';
import WindowBottom from './WindowBottom.vue';

import IconClose from '@/assets/icon/close-000000.svg';
import { ref, watch } from 'vue';

const emits = defineEmits<{
  clickOk: [void];
  clickDismiss: [void];
  clickCancel: [void];
}>();
const props = withDefaults(
  defineProps<{
    title?: string;
    isShowing?: boolean;
    isLoading?: boolean;
    isClickable?: boolean;
  }>(),
  {},
);

const scrollTop = ref(0);

const PopupWindowActionBody = ref();

watch(
  () => props.isShowing,
  () => {
    if (PopupWindowActionBody.value && props.isShowing) {
      PopupWindowActionBody.value.scrollTop = 0;
    }
  },
);
</script>

<template>
  <PopupWindow class="WindowAction" :isShowing="isShowing" @click-dismiss="emits('clickDismiss')">
    <div
      class="WindowAction-body"
      ref="PopupWindowActionBody"
      :isClickable="`${isClickable}`"
      @scroll="(event) => (scrollTop = (event.target as HTMLDivElement).scrollTop)"
    >
      <Actionbar
        class="WindowAction-header"
        :isScrollUp="`${scrollTop > 0}`"
        :title="title"
        :leftMenus="{ icon: IconClose, click: () => emits('clickDismiss') }"
      />

      <div class="WindowAction-main">
        <slot></slot>
      </div>

      <WindowBottom
        class="WindowAction-bottom"
        @click-cancel="emits('clickCancel')"
        @click-ok="emits('clickOk')"
      />

      <div :class="['transition', 'WindowAction-foreground']"></div>

      <Loading class="WindowAction-loading" :isShowing="isLoading" />
    </div>
  </PopupWindow>
</template>

<style lang="scss" scoped>
.WindowAction {
  z-index: 3;

  .WindowAction-body {
    width: 100%;
    height: 100%;

    font-size: 1rem;
    font-weight: 400;
    color: black;
    position: relative;

    display: flex;
    flex-direction: column;
    overflow-y: auto;

    scroll-padding-bottom: 4rem;

    .WindowAction-header {
      z-index: 3;
      text-align: center;
      border: 1px solid;
      border-color: transparent;
      background: hsl(0, 0%, 92%);
    }
    .WindowAction-header[isScrollUp='true'] {
      border-color: hsl(0, 0%, 90%);
    }

    .WindowAction-main {
      z-index: 1;
      width: 100%;
      height: fit-content;
      padding: 1.8rem;
      padding-top: 1rem;
      display: flex;
      flex-direction: column;
    }

    .WindowAction-bottom {
      z-index: 2;
    }

    .WindowAction-foreground {
      z-index: 4;
      width: 100%;
      height: 100%;
      position: absolute;
      background: white;
      opacity: 0;
      pointer-events: none;
    }

    .WindowAction-loading {
      z-index: 5;
      position: absolute;
      width: 100%;
      pointer-events: none;
    }
  }

  .WindowAction-body[isClickable='false'] {
    pointer-events: none;
    .WindowAction-foreground {
      opacity: 0.5;
    }
  }
}
</style>
