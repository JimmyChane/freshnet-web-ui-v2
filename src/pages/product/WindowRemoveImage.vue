<script setup lang="ts">
  import PanelAction from "@/components/panel/PanelAction.vue";
  import type { PopupWindow } from "@/stores/popup-window/PopupWindow";
  import { computed } from "vue";

  const props = defineProps<{ popupWindow: PopupWindow }>();

  const isShowing = computed(() => props.popupWindow.isShowing);
  const input = computed(() => props.popupWindow.input);
  const product = computed(() => input.value?.product ?? null);
  const image = computed(() => input.value?.image ?? null);
</script>

<template>
  <PanelAction
    :title="`Delete image?`"
    :isShowing="isShowing"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => popupWindow.onConfirm({ product, image })"
  >
    <div>
      <div>
        <p>Once removed, cannot be undone</p>
      </div>
    </div>
  </PanelAction>
</template>
