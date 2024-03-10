<script setup lang="ts">
  import PanelAction from "@/components/panel/PanelAction.vue";
  import LayoutFindCustomer from "./LayoutFindCustomer.vue";
  import BodyUser from "./WindowUpdateService-user.vue";
  import BodyCustomer from "./WindowUpdateService-customer.vue";
  import BodyDescription from "./WindowUpdateService-description.vue";
  import BodyBelongings from "./WindowUpdateService-belongings.vue";
  import BodyLine from "./WindowUpdateService-line.vue";
  import { computed, onMounted, ref, watch } from "vue";
  import { useLoginStore } from "@/stores/login.store";
  import { useServiceStore } from "@/data-stores/service.store";
  import Customer from "@/data/customer/Customer";
  import { useSnackbarStore } from "@/stores/snackbar/snackbar.store";
  import { PopupWindow } from "@/stores/popup-window/PopupWindow";

  const props = defineProps<{ popupWindow: PopupWindow }>();

  const nameOfUser = ref("unknown");
  const data = ref({
    customerName: "",
    customerPhoneNumber: "",
    belongings: [],
    description: "",
  });

  const isShowing = computed(() => props.popupWindow.isShowing);

  const user = computed(() => useLoginStore().user);
  const userIsDefault = computed(
    () => user.value.isDefault() || user.value.isDefault(),
  );

  const BelongingListEdit = ref();
  const bodyCustomer = ref();

  watch(
    () => user.value,
    () => {
      const xUser = user.value;
      if (!xUser.isTypeNone()) {
        nameOfUser.value = userIsDefault.value ? "" : xUser.name;
      }
    },
  );

  function clickCustomerSuggestion(customer: Customer) {
    data.value.customerName = customer.name;
    data.value.customerPhoneNumber = customer.phoneNumber
      ? customer.phoneNumber.toString()
      : "";
  }

  function onUser() {
    useLoginStore().refresh();
  }
  function onReset() {
    data.value = {
      customerName: "",
      customerPhoneNumber: "",
      belongings: [],
      description: "",
    };
  }
  function onCreate() {
    const xData: Record<string, any> = {
      customer: {
        name: data.value.customerName.trim(),
        phoneNumber: data.value.customerPhoneNumber.trim(),
      },
      description: data.value.description.trim(),
      belongings: BelongingListEdit.value.getResults(),
    };

    if (userIsDefault.value && !nameOfUser.value.trim()) {
      useSnackbarStore().show("You must specify your name");
      return;
    }
    if (!xData.customer.name) {
      useSnackbarStore().show("You must specify customer name");
      return;
    }
    if (!xData.description) {
      useSnackbarStore().show("You must specify description");
      return;
    }
    if (userIsDefault.value && nameOfUser.value.trim()) {
      xData.nameOfUser = nameOfUser.value;
    }

    const accept = () => {
      onReset();
      onUser();
      props.popupWindow.close();
    };
    const reject = () => {};
    props.popupWindow.data.onConfirm(accept, reject, xData);
  }

  function focus() {
    bodyCustomer.value?.focus();
  }

  onMounted(() => {
    onReset();
    onUser();
    focus();
  });
</script>

<template>
  <PanelAction
    title="Add Service"
    :isShowing="isShowing"
    :isLoading="useServiceStore().isLoading"
    :isClickable="!useServiceStore().isLoading"
    @click-ok="() => onCreate()"
    @click-cancel="
      () => {
        popupWindow.close();
        onUser();
        onReset();
      }
    "
    @click-dismiss="() => popupWindow.close()"
  >
    <div class="WindowService-body">
      <BodyUser
        :name="nameOfUser"
        @input-name="(value) => (nameOfUser = value)"
      />

      <BodyCustomer
        ref="bodyCustomer"
        :name="data.customerName"
        :phoneNumber="data.customerPhoneNumber"
        @input-name="(value) => (data.customerName = value)"
        @input-phoneNumber="(value) => (data.customerPhoneNumber = value)"
      />
      <LayoutFindCustomer
        class="WindowService-findCustomers"
        :inputName="data.customerName"
        :inputPhoneNumber="data.customerPhoneNumber"
        @click-item="(customer) => clickCustomerSuggestion(customer)"
      />
      <BodyLine />

      <BodyDescription
        :description="data.description"
        @input-description="(value) => (data.description = value)"
      />
      <BodyLine />

      <BodyBelongings :belongings="data.belongings" ref="BelongingListEdit" />
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
  .WindowService-body {
    width: 35rem;
    max-width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;

    .WindowService-findCustomers {
      width: 100%;
      max-height: 20rem;
    }
  }
</style>
