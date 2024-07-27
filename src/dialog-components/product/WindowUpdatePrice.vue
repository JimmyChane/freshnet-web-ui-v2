<script setup lang="ts">
import PanelAction from '@/components/panel/PanelAction.vue';
import Input from '@/components/input/Input.vue';
import type { PopupWindow } from '@/stores/popup-window/PopupWindow';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{ popupWindow: PopupWindow }>();

const isShowing = computed(() => props.popupWindow.isShowing);
const input = computed(() => props.popupWindow.data);
const product = computed(() => input.value?.product ?? null);

const normal = ref('');
const promotion = ref('');

function clickConfirm() {
  let output = {
    product: product.value,
    price: { normal: normal.value, promotion: promotion.value },
  };

  props.popupWindow.data.onConfirm(output);
}

onMounted(() => {
  const { normal, promotion } = input.value.price;
  const { value: normalValue } = normal;
  const { value: promotionValue } = promotion;

  normal.value = normalValue === 0 ? '' : normalValue.toString();
  promotion.value = promotionValue === 0 ? '' : promotionValue.toString();
});
</script>

<template>
  <PanelAction
    title="Add Price"
    :isShowing="isShowing"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => clickConfirm()"
  >
    <div class="WindowUpdatePrice-body">
      <Input label="Normal (RM)" :isRequired="true" type="number" v-model="normal" />
      <Input label="Promotion (RM)" :isRequired="true" type="number" v-model="promotion" />
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
.WindowUpdatePrice-body {
  width: 26rem;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  & > * {
    padding-left: 0;
    padding-right: 0;
    background: hsla(0, 0%, 0%, 0.03);
  }
}
</style>
