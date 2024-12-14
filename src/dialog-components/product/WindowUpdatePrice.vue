<script setup lang="ts">
import PanelAction from '@/components/panel/PanelAction.vue';
import Input from '@/components/input/Input.vue';
import type { PopupWindow } from '@/stores/popup-window/PopupWindow';
import { computed, onMounted, ref } from 'vue';
import type { Product } from '@/data/Product';
import { ProductPrices } from '@/data/ProductPrices';

export interface DataContent {
  product?: Product;
  price: ProductPrices;
}

export interface DataProps {
  input: DataContent;
  onConfirm(content: DataContent): void;
}

const props = defineProps<{ popupWindow: PopupWindow<DataProps> }>();

const isShowing = computed(() => props.popupWindow.isShowing);
const input = computed(() => props.popupWindow.data.input);
const product = computed(() => input.value?.product ?? null);

const normal = ref('');
const promotion = ref('');

function clickConfirm() {
  props.popupWindow.data.onConfirm({
    product: product.value ?? undefined,
    price: new ProductPrices({ normal: normal.value, promotion: promotion.value }),
  });
}

onMounted(() => {
  const normalValue = input.value.price.normal?.value ?? 0;
  const promotionValue = input.value.price.promotion?.value ?? 0;

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
