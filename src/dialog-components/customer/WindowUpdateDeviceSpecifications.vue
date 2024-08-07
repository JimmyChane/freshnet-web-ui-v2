<script setup lang="ts">
import PanelAction from '@/components/panel/PanelAction.vue';
import WindowSection from './WindowSection.vue';
import SpecificationInputs from './SpecificationInputs.vue';
import {
  CustomerDeviceSpecification,
  type CustomerDeviceSpecificationData,
} from '@/data/CustomerDeviceSpecification';
import type { PopupWindow } from '@/stores/popup-window/PopupWindow';
import { computed, onMounted, ref, watch } from 'vue';
import { useCustomerStore } from '@/data-stores/customer.store';

const props = defineProps<{ popupWindow: PopupWindow }>();

const data = ref<CustomerDeviceSpecificationData[]>([]);

const isShowing = computed(() => props.popupWindow.isShowing);
const param = computed(() => props.popupWindow.data);
const isLoading = computed(() => useCustomerStore().isLoading);
const isClickable = computed(() => !useCustomerStore().isLoading);
const customer = computed(() => param.value?.customer ?? undefined);
const device = computed(() => param.value?.device ?? undefined);

const specifications = computed(() => {
  const specifications = param.value?.specifications;
  return Array.isArray(specifications) ? [...specifications] : [];
});

watch(() => param.value, invalidateData);

onMounted(() => {
  invalidateData();
});

function invalidateData() {
  data.value = specifications.value.map((specification) => {
    return new CustomerDeviceSpecification(specification).toData();
  });
}
function clickOk() {
  useCustomerStore()
    .updateDeviceSpecifications({
      _id: device.value.id,
      specifications: data.value,
    })
    .then((item) => props.popupWindow.close());
}
</script>

<template>
  <PanelAction
    class="WindowUpdateDeviceSpecifications"
    :title="`Update Device Specifications${customer ? ` for ${customer.name}` : ''}`"
    :isShowing="isShowing"
    :isLoading="isLoading"
    :isClickable="isClickable"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => clickOk()"
  >
    <div class="WindowUpdateDeviceSpecifications-body">
      <WindowSection class="WindowUpdateDeviceSpecifications-description">
        <SpecificationInputs :items="data" />
      </WindowSection>
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
.WindowUpdateDeviceSpecifications-reuse-input {
  font-size: 1rem;
  border: none;
  background: hsla(0, 0%, 0%, 0.03);
  border-bottom: 1px solid hsl(0, 0%, 70%);
  border-radius: 0.2rem;
  padding: 0.2rem 0.4rem;
}

.WindowUpdateDeviceSpecifications {
  width: 100%;
  height: 100%;
  .WindowUpdateDeviceSpecifications-body {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 40px;

    .WindowUpdateDeviceSpecifications-customer {
      .WindowUpdateDeviceSpecifications-customer-body {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        .WindowUpdateDeviceSpecifications-customer-part {
          width: 100%;
          min-height: 2.5rem;
          display: flex;
          flex-direction: row;
          column-gap: 1rem;
          .WindowUpdateDeviceSpecifications-customer-title {
            flex-grow: 0;
            max-width: 120px;
            min-width: 120px;
          }
          .WindowUpdateDeviceSpecifications-reuse-input {
            flex-grow: 1;
          }
        }
      }
    }
    .WindowUpdateDeviceSpecifications-description {
      .WindowUpdateDeviceSpecifications-reuse-input {
        height: 6rem;
        resize: none;
      }
    }
  }
}
</style>
@/stores/data-stores/customer.store
