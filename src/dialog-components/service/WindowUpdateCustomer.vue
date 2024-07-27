<script setup lang="ts">
import PanelAction from '@/components/panel/PanelAction.vue';
import Input from '@/components/input/Input.vue';
import type { PopupWindow } from '@/stores/popup-window/PopupWindow';
import { computed, onMounted, ref, watch } from 'vue';
import { useServiceStore } from '@/data-stores/service.store';
import { optString } from '@/utils/U';
import { PhoneNumber } from '@/data/PhoneNumber';

const props = defineProps<{
  popupWindow: PopupWindow<{
    name: string;
    phoneNumber: PhoneNumber;
    onConfirm: any;
  }>;
}>();

const customerName = ref('');
const customerPhoneNumber = ref('');

const isShowing = computed(() => props.popupWindow.isShowing);
const value = computed(() => props.popupWindow.data);

const InputName = ref();

watch(() => value.value, onNewValue);

function onNewValue() {
  const xValue = value.value ?? {};
  customerName.value = optString(xValue.name);
  customerPhoneNumber.value = xValue.phoneNumber?.toString() ?? '';
}
function onChange() {
  const accept = () => {
    props.popupWindow.close();
  };
  const reject = () => {};
  props.popupWindow.data.onConfirm(accept, reject, {
    name: customerName.value,
    phoneNumber: customerPhoneNumber.value,
  });
}

function focus() {
  InputName.value.focus();
}

onMounted(() => {
  onNewValue();
  focus();
});
</script>

<template>
  <PanelAction
    title="Edit Customer"
    :isShowing="isShowing"
    :isLoading="useServiceStore().isLoading"
    :isClickable="!useServiceStore().isLoading"
    @click-ok="onChange"
    @click-cancel="() => popupWindow.close()"
    @click-dismiss="() => popupWindow.close()"
  >
    <div class="WindowCustomer-body">
      <Input
        label="Name"
        ref="InputName"
        autocapitalize="words"
        :isRequired="true"
        v-model="customerName"
      />
      <Input
        ref="WindowCustomerPhoneNumber"
        label="Phone Number"
        type="tel"
        v-model="customerPhoneNumber"
      />
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
.WindowCustomer-body {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem 0;

  & > * {
    max-width: 100%;
    width: 35rem;
    padding: 0.6rem 0.4rem;
    font-size: 1rem;
    margin-top: 0;

    border: none;
    border-bottom: 1px solid hsl(0, 0%, 70%);
    border-radius: 0.2rem;
    background: hsla(0, 0%, 0%, 0.03);
  }
}
</style>
