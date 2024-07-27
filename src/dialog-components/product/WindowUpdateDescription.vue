<script setup lang="ts">
import PanelAction from '@/components/panel/PanelAction.vue';
import TextArea from '@/components/input/InputTextArea.vue';
import type { PopupWindow } from '@/stores/popup-window/PopupWindow';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
  popupWindow: PopupWindow<{
    input: { product: string; description: string };
    onConfirm: (data: { product: string; description: string }) => void;
  }>;
}>();

const data = ref({ description: '' });

const isShowing = computed(() => props.popupWindow.isShowing);
const product = computed(() => props.popupWindow.data.input?.product ?? '');
const description = computed(() => data.value?.description ?? '');

function clickConfirm() {
  props.popupWindow.data.onConfirm({
    product: product.value,
    description: description.value,
  });
}

onMounted(() => {
  data.value = { description: props.popupWindow.data.input.description };
});
</script>

<template>
  <PanelAction
    class="WindowUpdateDescription"
    title="Update Description"
    :isShowing="isShowing"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => clickConfirm()"
  >
    <div class="WindowUpdateDescription-body">
      <TextArea type="text" label="Description" :isRequired="true" v-model="data.description" />
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
.WindowUpdateDescription-body {
  width: 26rem;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  & > * {
    background: hsla(0, 0%, 0%, 0.03);
    height: 18rem;
  }
}
</style>
