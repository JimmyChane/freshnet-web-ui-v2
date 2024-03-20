<script setup lang="ts">
  import PanelAction from "@/components/panel/PanelAction.vue";
  import TypeSelector from "@/components/selector/TypeSelector.vue";
  import LayoutFindCustomer from "./LayoutFindCustomer.vue";
  import BodyUser from "./WindowUpdateService-user.vue";
  import BodyCustomer from "./WindowUpdateService-customer.vue";
  import BodyDescription from "./WindowUpdateService-description.vue";
  import BodyBelongings from "./WindowUpdateService-belongings.vue";
  import BodyLine from "./WindowUpdateService-line.vue";
  import { computed, onMounted, ref } from "vue";
  import { useLoginStore } from "@/stores/login.store";
  import { useServiceStore } from "@/data-stores/service.store";
  import { useSnackbarStore } from "@/stores/snackbar/snackbar.store";
  import type { PopupWindow } from "@/stores/popup-window/PopupWindow";
  import { PENDING, ServiceState, map } from "@/data/service/ServiceState";
  import { Customer } from "@/data/customer/Customer";
  import type { Service } from "@/data/service/Service";

  const props = defineProps<{
    popupWindow: PopupWindow<{
      showService: (service: Service | null) => void;
    }>;
  }>();

  const data = ref<{
    time?: number;
    state?: string;
    nameOfUser: string;
    customer: { name: string; phoneNumber: string };
    description: string;
    belongings: any[];
  }>({
    nameOfUser: "",
    customer: { name: "", phoneNumber: "" },
    description: "",
    belongings: [],
  });

  const DateTimeInput = ref();
  const BelongingListEdit = ref();

  const isShowing = computed(() => props.popupWindow.isShowing);

  const user = computed(() => useLoginStore().user);
  const nameUserType = computed(() => {
    if (user.value.isTypeAdmin()) return "Admin";
    if (user.value.isTypeStaff()) return "Staff";
    return "unknown";
  });

  const stateMenus = computed(() => {
    return map((state) => {
      return {
        key: state.key,
        title: state.title,
        icon: state.icon,
        color: state.primaryColor,
      };
    });
  });

  function resetData() {
    data.value = {
      nameOfUser: "",
      customer: { name: "", phoneNumber: "" },
      description: "",
      belongings: [],
    };

    if (!data.value.state) {
      data.value.state = PENDING.key;
    }

    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    now.setMilliseconds(0);
    now.setSeconds(0);
    DateTimeInput.value.value = now.toISOString().slice(0, -1);
  }
  function trimData() {
    data.value.nameOfUser = data.value.nameOfUser.trim();
    data.value.customer.name = data.value.customer.name.trim();
    data.value.customer.phoneNumber = data.value.customer.phoneNumber.trim();
    data.value.description = data.value.description.trim();
    data.value.belongings = BelongingListEdit.value.getResults();
    data.value.time = Date.parse(DateTimeInput.value.value);

    return data.value;
  }

  function onOk() {
    data.value = trimData();

    if (Number.isNaN(data.value.time)) {
      useSnackbarStore().show("Date & Time Not Set");
      return;
    }
    if (!data.value.state) {
      useSnackbarStore().show("State Not Set");
      return;
    }

    useServiceStore()
      .importItem({ data: data.value })
      .then((service) => {
        props.popupWindow.data.showService(service);
        props.popupWindow.close();
      })
      .catch((error) => {
        useSnackbarStore().show("Failed to import a service");
        console.error(error);
      });
  }

  function clickCustomerSuggestion(customer: Customer) {
    data.value.customer.name = customer.name;
    data.value.customer.phoneNumber = customer.phoneNumber
      ? customer.phoneNumber.toString()
      : "";
  }

  onMounted(() => resetData());
</script>

<template>
  <PanelAction
    title="Import Service"
    :isShowing="isShowing"
    :isLoading="useServiceStore().isLoading"
    :isClickable="!useServiceStore().isLoading"
    @click-ok="onOk()"
    @click-cancel="() => popupWindow.close()"
    @click-dismiss="() => popupWindow.close()"
  >
    <div class="WindowService-body">
      <BodyUser
        :name="data.nameOfUser"
        @input-name="(value) => (data.nameOfUser = value)"
      />

      <div class="WindowService-datetime">
        <span class="WindowService-title">Creation Date & Time</span>
        <div><input ref="DateTimeInput" type="datetime-local" /></div>
      </div>
      <BodyLine />

      <div class="WindowService-state">
        <span class="WindowService-title">States</span>
        <TypeSelector :items="stateMenus" v-model="data.state" />
      </div>
      <BodyLine />

      <BodyCustomer
        :name="data.customer.name"
        :phoneNumber="data.customer.phoneNumber"
        @input-name="(value) => (data.customer.name = value)"
        @input-phoneNumber="(value) => (data.customer.phoneNumber = value)"
      />
      <LayoutFindCustomer
        class="WindowService-findCustomers"
        :inputName="data.customer.name"
        :inputPhoneNumber="data.customer.phoneNumber"
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
    max-width: 100%;
    width: 35rem;
    display: flex;
    flex-direction: column;
    gap: 40px;

    .WindowService-title {
      font-size: 1.1rem;
      font-weight: 600;
    }

    .WindowService-datetime {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      :nth-child(2) {
        display: flex;
        flex-direction: column;
        & > * {
          border: 1px solid hsla(0, 0%, 0%, 0.1);
        }
      }
    }
    .WindowService-state {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .WindowService-findCustomers {
      width: 100%;
      max-height: 20rem;
    }
  }
</style>
