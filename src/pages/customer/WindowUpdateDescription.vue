<script setup lang="ts">
  import PanelAction from "@/components/panel/PanelAction.vue";
  import TextArea from "@/components/input/InputTextArea.vue";
  import { Customer } from "@/data/customer/Customer";
  import { computed, onMounted, ref, watch } from "vue";
  import { useCustomerStore } from "@/data-stores/customer.store";
  import type { PopupWindow } from "@/stores/popup-window/PopupWindow";

  const props = defineProps<{ popupWindow: PopupWindow }>();

  const Requirement = ref(Customer.Requirement);
  const data = ref({ description: "" });

  const isShowing = computed(() => props.popupWindow.isShowing);
  const item = computed(() => props.popupWindow.item);
  const isLoading = computed(() => useCustomerStore().isLoading);
  const isClickable = computed(() => !useCustomerStore().isLoading);

  const Description = ref();

  watch(
    () => isShowing.value,
    () => {
      if (!isShowing.value) return;
      if (Description.value) Description.value.focus();
    },
  );
  watch(() => item.value, bindData);

  onMounted(() => {
    bindData();
  });

  function bindData() {
    if (item.value) {
      const { description } = item.value;
      data.value.description = description;
    }
  }
  function clickOk() {
    data.value.description = data.value.description.trim();

    if (Requirement.value.description.isRequired && !data.value.description) {
      useSnackbarStore().show('You must specify the "Description"');
      return;
    }
    useCustomerStore()
      .updateDescriptionOfId({
        _id: item.value.id,
        description: data.value.description,
      })
      .then((item) => props.popupWindow.close());
  }
</script>

<template>
  <PanelAction
    class="WindowUpdateDescription"
    :title="`Update Description${item ? ` for ${item.name}` : ''}`"
    :isShowing="isShowing"
    :isLoading="isLoading"
    :isClickable="isClickable"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => clickOk()"
  >
    <TextArea
      class="WindowUpdateDescription-description"
      ref="Description"
      type="text"
      label="Description"
      :bindValue="data.description"
      @input="(value: string) => (data.description = value)"
    />
  </PanelAction>
</template>

<style lang="scss" scoped>
  .WindowUpdateDescription {
    width: 100%;
    height: 100%;
    .WindowUpdateDescription-description {
      width: 35rem;
      max-width: 100%;
      height: 6rem;
    }
  }
</style>
@/stores/data-stores/customer.store
