<script setup lang="ts">
import PanelAction from '@/components/panel/PanelAction.vue';
import type { PopupWindow } from '@/stores/popup-window/PopupWindow';
import { computed, onMounted, ref } from 'vue';
import { Specification } from '@/data/Specification';
import { optArray } from '@/utils/U';
import type { Product } from '@/data/Product';
import SpecificationInputs from '@/page-components/customer/SpecificationInputs.vue';

export interface DataContent {
  product?: Product;
  specifications?: Specification[];
}

export interface DataProps {
  input: DataContent;
  onConfirm: (data: DataContent) => void;
}

const props = defineProps<{ popupWindow: PopupWindow<DataProps> }>();

const data = ref<{ specifications: Specification[] }>({ specifications: [] });

const isShowing = computed(() => props.popupWindow.isShowing);
const input = computed(() => props.popupWindow.data.input);
const product = computed(() => input.value?.product ?? undefined);
const inputSpecifications = computed(() => {
  return optArray(input.value?.specifications);
});
const specifications = computed(() => data.value?.specifications ?? []);

function clickConfirm() {
  props.popupWindow.data.onConfirm({
    product: product.value,
    specifications: specifications.value,
  });
}

onMounted(() => {
  data.value.specifications = inputSpecifications.value
    .map((specification) => {
      specification.typeKey = specification.type?.key;
      return specification;
    })
    .map((specification) => {
      return new Specification(specification);
    });
});
</script>

<template>
  <PanelAction
    class="WindowUpdateSpecifications"
    title="Update Specifications"
    :isShowing="isShowing"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => clickConfirm()"
  >
    <div class="WindowUpdateSpecifications-body">
      <SpecificationInputs :items="specifications" />
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
.WindowUpdateSpecifications-body {
  width: 40rem;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
</style>
