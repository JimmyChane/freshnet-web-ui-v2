<script setup lang="ts">
import PanelAction from '@/components/panel/PanelAction.vue';
import type { Product } from '@/data/Product';
import type { PopupWindow } from '@/stores/popup-window/PopupWindow';
import { computed } from 'vue';

export interface DataContent {
  product: Product;
  title: string;
}

export interface DataProps {
  input: DataContent;
  onConfirm(content: DataContent): void;
}

const props = defineProps<{
  popupWindow: PopupWindow<DataProps>;
}>();

const isShowing = computed(() => props.popupWindow.isShowing);
const input = computed(() => props.popupWindow.data.input);
const product = computed(() => input.value?.product ?? undefined);
const title = computed(() => product.value?.title ?? '');
</script>

<template>
  <PanelAction
    :title="`Delete ${title}?`"
    :isShowing="isShowing"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => popupWindow.data.onConfirm({ product, title })"
  >
    <div>
      <div>
        <p>Once removed, cannot be undone</p>
      </div>
    </div>
  </PanelAction>
</template>
