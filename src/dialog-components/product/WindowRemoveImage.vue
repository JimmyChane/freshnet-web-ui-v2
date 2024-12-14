<script setup lang="ts">
import PanelAction from '@/components/panel/PanelAction.vue';
import type { Image } from '@/data/Image';
import type { Product } from '@/data/Product';
import type { PopupWindow } from '@/stores/popup-window/PopupWindow';
import { computed } from 'vue';

export interface DataContent {
  product: Product;
  image: Image;
}

export interface DataProps {
  input: DataContent;
  onConfirm(content: DataContent): void;
}

const props = defineProps<{ popupWindow: PopupWindow<DataProps> }>();

const isShowing = computed(() => props.popupWindow.isShowing);
const input = computed(() => props.popupWindow.data.input);
const product = computed(() => input.value?.product ?? null);
const image = computed(() => input.value?.image ?? null);
</script>

<template>
  <PanelAction
    :title="`Delete image?`"
    :isShowing="isShowing"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => popupWindow.data.onConfirm({ product, image })"
  >
    <div>
      <div>
        <p>Once removed, cannot be undone</p>
      </div>
    </div>
  </PanelAction>
</template>
