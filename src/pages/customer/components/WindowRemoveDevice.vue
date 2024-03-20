<script setup lang="ts">
  import PanelAction from "@/components/panel/PanelAction.vue";
  import { Customer } from "@/data/customer/Customer";
  import type { PopupWindow } from "@/stores/popup-window/PopupWindow";
  import { computed, ref } from "vue";
  import { useCustomerStore } from "@/data-stores/customer.store";
  import type { CustomerDevice } from "@/data/customer/CustomerDevice";

  const props = defineProps<{
    popupWindow: PopupWindow<{ customer: Customer; device: CustomerDevice }>;
  }>();

  const isShowing = computed(() => props.popupWindow.isShowing);
  const item = computed(() => props.popupWindow.data);
  const isLoading = computed(() => useCustomerStore().isLoading);
  const isClickable = computed(() => !useCustomerStore().isLoading);
  const customer = computed(() => item.value?.customer);
  const device = computed(() => item.value?.device);

  function clickOk() {
    useCustomerStore()
      .removeDevice({
        ownerCustomerId: device.value.ownerCustomerId,
        id: device.value.id,
      })
      .then((item) => props.popupWindow.close());
  }
</script>

<template>
  <PanelAction
    class="WindowRemoveDevice"
    title="Remove Device?"
    :isShowing="isShowing"
    :isLoading="isLoading"
    :isClickable="isClickable"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => clickOk()"
  >
    <div class="WindowRemoveDevice-body" v-if="item">
      <div class="WindowRemoveDevice-description" v-if="device.description">
        <span class="WindowRemoveDevice-description-header">Description</span>
        <span class="WindowRemoveDevice-description-body">{{
          device.description
        }}</span>
      </div>

      <div class="WindowRemoveDevice-description" v-if="device.categoryKey">
        <span class="WindowRemoveDevice-description-header">Category</span>
        <span class="WindowRemoveDevice-description-body">{{
          device.categoryKey
        }}</span>
      </div>
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
  .WindowRemoveDevice-reuse-input {
    font-size: 1rem;
    border: none;
    background: hsla(0, 0%, 0%, 0.03);
    border-bottom: 1px solid hsl(0, 0%, 70%);
    border-radius: 0.2rem;
    padding: 0.2rem 0.4rem;
  }

  .WindowRemoveDevice {
    width: 100%;
    height: 100%;
    .WindowRemoveDevice-body {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;

      .WindowRemoveDevice-namePhoneNumber {
        background: hsla(201, 35%, 25%, 0.02);
        border: 1px solid hsla(201, 35%, 25%, 0.05);
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        flex-grow: 1;
        overflow: hidden;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: flex-start;
        column-gap: 2rem;
        row-gap: 0.3rem;

        .WindowRemoveDevice-namePhoneNumber-section {
          flex-grow: 0;
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          line-height: 1.2;
          .WindowRemoveDevice-namePhoneNumber-section-header {
            min-width: 8rem;
            min-height: 2.5rem;
            word-break: break-all;
            text-overflow: clip;
            overflow-x: hidden;

            font-weight: 600;
            font-size: 0.8rem;
            display: flex;
            flex-direction: row;
            align-items: center;

            flex-grow: 0;
            display: flex;
            flex-direction: row;
            align-items: center;
          }
          .WindowRemoveDevice-namePhoneNumber-section-content {
            min-height: 2.5rem;
            flex-grow: 1;
            display: flex;
            flex-direction: row;
            align-items: center;
          }
        }
      }
      .WindowRemoveDevice-description {
        background: hsla(201, 35%, 25%, 0.02);
        border: 1px solid hsla(201, 35%, 25%, 0.05);
        padding: 0.5rem;
        border-radius: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        row-gap: 0.5rem;
        .WindowRemoveDevice-description-header {
          min-height: 2.5rem;
          flex-grow: 1;
          padding: 0.5rem;
          font-weight: 600;
          font-size: 0.8rem;

          display: flex;
          flex-direction: row;
          align-items: center;
        }
        .WindowRemoveDevice-description-body {
          padding: 0.5rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
</style>
@/stores/data-stores/customer.store
