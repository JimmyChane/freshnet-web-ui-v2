<script setup lang="ts">
  import PanelAction from "@/components/panel/PanelAction.vue";
  import { PopupWindow } from "@/stores/popup-window/PopupWindow";
  import { computed } from "vue";

  const props = defineProps<{ popupWindow: PopupWindow }>();

  const isShowing = computed(() => props.popupWindow.isShowing);
  const input = computed(() => props.popupWindow.input);
  const product = computed(() => input.value?.product ?? null);
  const title = computed(() => product.value?.title ?? "");
</script>

<template>
  <PanelAction
    :title="`Delete ${title}?`"
    :isShowing="isShowing"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => popupWindow.onConfirm({ productId: product.id })"
  >
    <div>
      <div>
        <p>Once removed, cannot be undone</p>
      </div>
    </div>
  </PanelAction>
</template>
