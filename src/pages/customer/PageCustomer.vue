<script setup lang="ts">
  import Loading from "@/components/Loading.vue";
  import PopupWindow from "@/components/window/PopupWindow.vue";
  import Input from "@/components/Input.vue";

  import WindowAddCustomer from "./WindowAddCustomer.vue";
  import WindowRemoveCustomer from "./WindowRemoveCustomer.vue";
  import WindowUpdateCustomer from "./WindowUpdateCustomer.vue";
  import WindowUpdateDescription from "./WindowUpdateDescription.vue";
  import WindowAddDevice from "./WindowAddDevice.vue";
  import WindowRemoveDevice from "./WindowRemoveDevice.vue";
  import WindowUpdateDeviceSpecifications from "./WindowUpdateDeviceSpecifications.vue";
  import WindowUpdateDeviceDescription from "./WindowUpdateDeviceDescription.vue";

  import PanelCustomers from "./PanelCustomers.vue";
  import PanelCustomer from "./PanelCustomer.vue";
  import PanelRight from "@/components/panel/PanelRight.vue";
  import { computed, onMounted, ref, watch } from "vue";
  import { useCustomerStore } from "@/data-stores/customer.store";
  import { useRoute } from "vue-router";
  import Customer from "@/data/customer/Customer";
  import { useStore } from "@/stores/store";

  const panelListened = ref({ isWide: false });
  const items = ref<Customer[]>([]);
  const drawerCustomer = ref();

  const isLoading = computed(() => useCustomerStore().isLoading);
  const queryId = computed(() => useRoute().query.id);
  const queryName = computed(() => useRoute().query.name);
  const queryPhoneNumber = computed(() => useRoute().query.phoneNumber);

  const currentCustomer = computed(() => {
    if (!items.value.length) return undefined;

    const isSearchById = !!queryId.value;

    let customer = null;

    if (isSearchById) {
      customer = items.value.find((customer) => customer.id === queryId.value);
    } else {
      customer = items.value.find((customer) => {
        const phoneNumberValue = customer.phoneNumber?.value ?? "";
        return (
          customer.name === queryName.value &&
          phoneNumberValue === queryPhoneNumber.value
        );
      });
    }

    if (!isSearchById && customer && customer.isFromStoreCustomer()) {
      useRouteStore().replaceQuery({
        query: {
          id: customer.id,
          name: null,
          phoneNumber: null,
        },
      });
    }

    return customer;
  });

  watch(() => useCustomerStore().items, invalidate);

  watch(
    () => currentCustomer.value,
    () => {
      if (!currentCustomer.value) {
        setTimeout(() => (this.drawerCustomer = this.currentCustomer), 1000);
      } else {
        this.drawerCustomer = this.currentCustomer;
      }
    },
  );

  onMounted(() => {
    invalidate();
  });

  async function invalidate() {
    items.value = [];
    items.value = await useCustomerStore().generateCustomersAcross();
  }

  function clickRefresh() {
    useCustomerStore().refresh();
    invalidate();
  }
  function clickClose() {
    useRouteStore().nextQuery({
      query: { id: null, name: null, phoneNumber: null },
    });
  }

  function clickItemAdd() {
    usePopupWindowStore().open({ component: WindowAddCustomer });
  }
  function clickAddItemDevice(data) {
    usePopupWindowStore().open({
      component: WindowAddDevice,
      item: data?.item ?? null,
    });
  }

  function clickItemRemove(item) {
    const data = { item };

    usePopupWindowStore().open({
      component: WindowRemoveCustomer,
      item: data?.item ?? null,
      onConfirm: () => {
        if (data.id === queryCustomerId.value) {
          clickClose();
        }
      },
    });
  }
  function clickRemoveItemDevice(data) {
    usePopupWindowStore().open({
      component: WindowRemoveDevice,
      param: data ? { customer: data.item, device: data.device } : null,
    });
  }

  function clickUpdateCustomer(data) {
    usePopupWindowStore().open({
      component: WindowUpdateCustomer,
      item: data?.item ?? null,
    });
  }
  function clickUpdateDescription(data) {
    usePopupWindowStore().open({
      component: WindowUpdateDescription,
      item: data?.item ?? null,
    });
  }
  function clickUpdateItemDeviceSpecifications(data) {
    usePopupWindowStore().open({
      component: WindowUpdateDeviceSpecifications,
      param: data
        ? {
            customer: data.customer,
            device: data.device,
            specifications: data.specifications,
          }
        : null,
    });
  }
  function clickUpdateItemDeviceDescription(data) {
    usePopupWindowStore().open({
      component: WindowUpdateDeviceDescription,
      customer: data?.customer ?? null,
      device: data?.device ?? null,
    });
  }
</script>

<template>
  <div class="PageCustomer" :isPanelWide="`${panelListened.isWide}`">
    <PanelCustomers
      class="PageCustomer-panelLeft transition"
      :items="items"
      :itemSelected="currentCustomer"
      :title="$options.title"
      @click-refresh="() => invalidate()"
      @click-item-add="() => clickItemAdd()"
      @click-item-remove="(param) => clickItemRemove(param.item)"
    />

    <PanelRight
      class="PageCustomer-PanelRight"
      titleEmpty="Select customer to view"
      :isShowing="!!currentCustomer"
      @click-collapse="() => clickClose()"
      @on-isWide="(isWide) => (panelListened.isWide = isWide)"
    >
      <PanelCustomer
        class="PageCustomer-PanelCustomer transition"
        :item="drawerCustomer"
        @click-item-close="() => clickClose()"
        @click-item-remove="(param) => this.clickItemRemove(param.item)"
        @click-item-customer-update="(param) => clickUpdateCustomer(param)"
        @click-item-description-update="
          (param) => clickUpdateDescription(param)
        "
        @click-item-device-add="(param) => clickAddItemDevice(param)"
        @click-item-device-remove="(param) => clickRemoveItemDevice(param)"
        @click-item-device-update-specifications="
          (param) => clickUpdateItemDeviceSpecifications(param)
        "
        @click-item-device-update-description="
          (param) => clickUpdateItemDeviceDescription(param)
        "
      />
    </PanelRight>

    <Loading class="PageCustomer-loading" :isShowing="isLoading" />
  </div>
</template>

<style lang="scss" scoped>
  .PageCustomer {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-grow: 1;

    .PageCustomer-panelLeft {
      z-index: 1;
      height: 100%;
    }
    .PageCustomer-PanelRight {
      z-index: 2;
    }
    .PageCustomer-loading {
      position: absolute;
      bottom: 0;
      width: 100%;
      z-index: 1;
    }
  }
  .PageCustomer[isPanelWide="false"] {
    .PageCustomer-panelLeft {
      width: 100dvw;
      max-width: 100%;
    }
  }
  .PageCustomer[isPanelWide="true"] {
    .PageCustomer-panelLeft {
      width: 100dvw;
      max-width: 50%;
    }
  }
</style>
@/stores/data-stores/customer.store