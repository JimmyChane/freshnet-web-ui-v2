<script setup lang="ts">
  import PanelAction from "@/components/panel/PanelAction.vue";
  import WindowSection from "./WindowSection.vue";
  import { Customer } from "@/data/customer/Customer";
  import Input from "@/components/input/Input.vue";
  import { computed, onMounted, ref, watch } from "vue";
  import { useCustomerStore } from "@/data-stores/customer.store";
  import type { PopupWindow } from "@/stores/popup-window/PopupWindow";

  const props = defineProps<{ popupWindow: PopupWindow }>();

  const Requirement = ref(Customer.Requirement);
  const data = ref({ name: "", phoneNumber: "" });

  const isShowing = computed(() => props.popupWindow.isShowing);
  const item = computed(() => props.popupWindow.item);
  const isLoading = computed(() => useCustomerStore().isLoading);
  const isClickable = computed(() => !useCustomerStore().isLoading);

  const CustomerName = ref();

  watch(
    () => isShowing.value,
    () => {
      if (!isShowing.value) return;
      if (CustomerName.value) CustomerName.value.focus();
    },
  );
  watch(() => item.value, bindData);

  onMounted(() => {
    bindData();
  });

  function bindData() {
    if (item.value) {
      const { name, phoneNumber } = item.value;
      data.value.name = name;
      data.value.phoneNumber = phoneNumber?.toString() ?? "";
    }
  }
  function clickOk() {
    data.value.name = data.value.name.trim();
    data.value.phoneNumber = data.value.phoneNumber.trim();

    if (Requirement.value.name.isRequired && !data.value.name) {
      useSnackbarStore().show('You must specify the "Name"');
      return;
    }
    if (Requirement.value.phoneNumber.isRequired && !data.value.phoneNumber) {
      useSnackbarStore().show('You must specify the "Phone Number"');
      return;
    }

    useCustomerStore()
      .updateNamePhoneNumberOfItemId({
        _id: item.value.id,
        name: data.value.name,
        phoneNumber: data.value.phoneNumber,
      })
      .then((item) => props.popupWindow.close());
  }
</script>

<template>
  <PanelAction
    class="WindowUpdateCustomer"
    :title="`Update Customer${item ? ` for ${item.name}` : ''}`"
    :isShowing="isShowing"
    :isLoading="isLoading"
    :isClickable="isClickable"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="clickOk()"
  >
    <div class="WindowUpdateCustomer-body">
      <WindowSection class="WindowUpdateCustomer-customer">
        <div class="WindowUpdateCustomer-customer-body">
          <Input
            class="WindowUpdateCustomer-customer-part"
            label="Name"
            type="text"
            :isRequired="true"
            :bindValue="data.name"
            @input="(value: string) => (data.name = value)"
          />
          <Input
            class="WindowUpdateCustomer-customer-part"
            label="Phone Number"
            type="text"
            :bindValue="data.phoneNumber"
            @input="(value: string) => (data.phoneNumber = value)"
          />
        </div>
      </WindowSection>
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
  .WindowUpdateCustomer-reuse-input {
    font-size: 1rem;
    border: none;
    background: hsla(0, 0%, 0%, 0.03);
    border-bottom: 1px solid hsl(0, 0%, 70%);
    border-radius: 0.2rem;
    padding: 0.2rem 0.4rem;
  }

  .WindowUpdateCustomer {
    width: 100%;
    height: 100%;
    .WindowUpdateCustomer-body {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 40px;

      .WindowUpdateCustomer-customer {
        .WindowUpdateCustomer-customer-body {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          .WindowUpdateCustomer-customer-part {
            width: 100%;
            min-height: 2.5rem;
          }
        }
      }
    }
  }
</style>
@/stores/data-stores/customer.store
