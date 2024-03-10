<script setup lang="ts">
  import PanelAction from "@/components/panel/PanelAction.vue";
  import Customer from "@/data/customer/Customer";
  import ItemSpecification from "./ItemSpecification.vue";
  import TextArea from "@/components/InputTextArea.vue";
  import { computed, onMounted, ref, watch } from "vue";
  import { PopupWindow } from "@/stores/popup-window/PopupWindow";
  import { useCustomerStore } from "@/data-stores/customer.store";

  const props = defineProps<{ popupWindow: PopupWindow }>();

  const Requirement = ref(Customer.Requirement);
  const data = ref({ description: "" });

  const isShowing = computed(() => props.popupWindow.isShowing);
  const customer = computed(() => props.popupWindow.customer);
  const device = computed(() => props.popupWindow.device);
  const isLoading = computed(() => useCustomerStore().isLoading);
  const isClickable = computed(() => !useCustomerStore().isLoading);

  const specifications = computed(() => {
    const specifications = device.value ? device.value.specifications : [];
    return Array.isArray(specifications) ? specifications : [];
  });

  const Description = ref();

  watch(
    () => isShowing.value,
    () => {
      if (!isShowing.value) return;
      if (Description.value) Description.value.focus();
    },
  );
  watch(() => device.value, bindData);

  onMounted(() => {
    bindData();
  });

  function bindData() {
    if (device.value) {
      const { description } = device.value;
      data.value.description = description;
    }
  }
  function clickOk() {
    data.value.description = data.value.description.trim();
    useCustomerStore()
      .updateDeviceDescription({
        _id: device.value.id,
        description: data.value.description,
      })
      .then((device) => props.popupWindow.close());
  }
</script>

<template>
  <PanelAction
    class="WindowUpdateDeviceDescription"
    :title="`Update Device Description${
      customer ? ` for ${customer.name}` : ''
    }`"
    :isShowing="isShowing"
    :isLoading="isLoading"
    :isClickable="isClickable"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => clickOk()"
  >
    <div class="WindowUpdateDeviceDescription-body">
      <div
        class="WindowUpdateDeviceDescription-specification"
        v-if="specifications.length"
      >
        <ItemSpecification
          v-for="specification of specifications"
          :key="`${specification.typeKey}${specification.content}`"
          :item="specification"
        />
      </div>

      <TextArea
        class="WindowUpdateDeviceDescription-description"
        ref="Description"
        type="text"
        label="Description"
        :bindValue="data.description"
        @input="(value: string) => (data.description = value)"
      />
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
  .WindowUpdateDeviceDescription-reuse-input {
    font-size: 1rem;
    border: none;
    background: hsla(0, 0%, 0%, 0.03);
    border-bottom: 1px solid hsl(0, 0%, 70%);
    border-radius: 0.2rem;
    padding: 0.2rem 0.4rem;
  }

  .WindowUpdateDeviceDescription {
    width: 100%;
    height: 100%;
    .WindowUpdateDeviceDescription-body {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 40px;

      .WindowUpdateDeviceDescription-specification {
        width: 100%;
        line-height: 1.1;
        font-size: 0.9rem;
        gap: 0.2rem;
        display: flex;
        flex-direction: column;
        padding: var(--padding);
        opacity: 0.4;
      }
      .WindowUpdateDeviceDescription-description {
        height: 6rem;
      }
    }
  }
</style>
@/stores/data-stores/customer.store