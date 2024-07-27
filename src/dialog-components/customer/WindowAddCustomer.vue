<script setup lang="ts">
import PanelAction from '@/components/panel/PanelAction.vue';
import Input from '@/components/input/Input.vue';
import TextArea from '@/components/input/InputTextArea.vue';
import { Requirement as CustomerRequirement } from '@/data/Customer';
import { computed, ref, watch } from 'vue';
import { useCustomerStore } from '@/data-stores/customer.store';
import { useSnackbarStore } from '@/stores/snackbar/snackbar.store';
import type { PopupWindow } from '@/stores/popup-window/PopupWindow';

const props = defineProps<{ popupWindow: PopupWindow }>();

const Requirement = ref(CustomerRequirement);
const data = ref({ name: '', phoneNumber: '', description: '' });

const isShowing = computed(() => props.popupWindow.isShowing);
const isLoading = computed(() => useCustomerStore().isLoading);
const isClickable = computed(() => useCustomerStore().isLoading);

const CustomerName = ref();

watch(
  () => isShowing.value,
  () => {
    if (!isShowing.value) return;
    if (CustomerName.value) CustomerName.value.focus();
  },
);

function clickOk() {
  data.value.name = data.value.name.trim();
  data.value.phoneNumber = data.value.phoneNumber.trim();
  data.value.description = data.value.description.trim();

  if (Requirement.value.name.isRequired && !data.value.name) {
    useSnackbarStore().show('You must specify the "Name"');
    return;
  }
  if (Requirement.value.phoneNumber.isRequired && !data.value.phoneNumber) {
    useSnackbarStore().show('You must specify the "Phone Number"');
    return;
  }
  if (Requirement.value.description.isRequired && !data.value.description) {
    useSnackbarStore().show('You must specify the "Description"');
    return;
  }

  useCustomerStore()
    .addItem(data.value)
    .then((item) => props.popupWindow.close());
}
</script>

<template>
  <PanelAction
    class="WindowAddCustomer"
    title="Add New Customer"
    :isShowing="isShowing"
    :isLoading="isLoading"
    :isClickable="isClickable"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="clickOk()"
  >
    <div class="WindowAddCustomer-body">
      <Input
        class="WindowAddCustomer-customer-input"
        label="Name"
        type="text"
        autocapitalize="words"
        :isRequired="true"
        v-model="data.name"
      />
      <Input
        class="WindowAddCustomer-customer-input"
        label="Phone Number"
        type="text"
        v-model="data.phoneNumber"
      />
      <TextArea
        class="WindowAddCustomer-description-input"
        type="text"
        label="Description"
        v-model="data.description"
      />
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
.WindowAddCustomer {
  width: 100%;
  height: 100%;
  .WindowAddCustomer-body {
    width: 26rem;
    max-width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.7rem;

    .WindowAddCustomer-customer-input {
      background: hsla(0, 0%, 0%, 0.03);
    }
    .WindowAddCustomer-description-input {
      height: 7rem;
      background: hsla(0, 0%, 0%, 0.03);
    }
  }
}
</style>
@/stores/data-stores/customer.store
