<script setup lang="ts">
import Actionbar from '@/components/actionbar/Actionbar.vue';
import WindowBottom from './WindowBottom.vue';
import { type PopupWindow } from '@/stores/popup-window/PopupWindow';
import { computed } from 'vue';

export interface WindowRemoveOption<T = any> {
  title?: string;
  message?: string;
  data?: T;
  onConfirm: (accept: () => void, reject: () => void) => void;
}

const props = defineProps<{
  popupWindow: PopupWindow<WindowRemoveOption>;
}>();

const title = computed(() => props.popupWindow.data.title);
const message = computed(() => props.popupWindow.data.message);

function onOK() {
  const accept = () => props.popupWindow.close();
  const reject = () => {};
  props.popupWindow.data.onConfirm(accept, reject);
}
</script>

<template>
  <div class="WindowRemove">
    <Actionbar class="WindowRemove-header" :title="title" />

    <div class="WindowRemove-main">
      <span class="WindowRemove-body">{{ message }}</span>
    </div>

    <WindowBottom @click-cancel="() => popupWindow.close()" @click-ok="() => onOK()" />
  </div>
</template>

<style lang="scss" scoped>
.WindowRemove {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;

  .WindowRemove-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: none;
  }
  .WindowRemove-main {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 1.8rem 2.5rem;
    margin-bottom: 1.2rem;
  }
}
</style>
