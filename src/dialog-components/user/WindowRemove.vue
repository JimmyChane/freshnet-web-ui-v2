<script setup lang="ts">
import PanelAction from '@/components/panel/PanelAction.vue';
import { computed } from 'vue';
import type { WindowRemoveOption } from './WindowRemove';
import type { PopupWindow } from '@/stores/popup-window/PopupWindow';

const props = defineProps<{ popupWindow: PopupWindow<WindowRemoveOption> }>();

const isShowing = computed(() => props.popupWindow.isShowing);
</script>

<template>
  <PanelAction
    title="Add User"
    :isShowing="isShowing"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => popupWindow.data.onConfirm()"
  >
    <div class="PageUsers-window">
      <div class="PageUsers-window-main">
        <p class="PageUsers-window-text">Once removed, cannot be undone</p>
      </div>
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
.PageUsers-window {
  width: 20rem;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .PageUsers-window-main {
    display: flex;
    flex-direction: column;
    gap: 10px;
    .PageUsers-window-title {
      font-size: 1.1rem;
      font-weight: 600;
    }
    .PageUsers-window-inputText {
      flex-grow: 1;
      font-size: 1rem;
      border: none;
      border-bottom: 1px solid hsl(0, 0%, 70%);
      background: none;
      padding: 4px 0;
    }
    .PageUsers-window-text {
      flex-grow: 1;
      font-size: 1rem;
      padding: 4px 0;
    }
    .PageUsers-window-required {
      color: hsl(0, 50%, 50%);
      font-size: 0.8rem;
    }
  }
}
</style>
