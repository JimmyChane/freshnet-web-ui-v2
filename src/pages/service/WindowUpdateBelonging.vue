<script setup lang="ts">
  import PanelAction from "@/components/panel/PanelAction.vue";
  import BelongingListEditVue from "./BelongingListEdit.vue";
  import { computed, onMounted, ref } from "vue";
  import { PopupWindow } from "@/stores/popup-window/PopupWindow";
  import { useServiceStore } from "@/data-stores/service.store";
  import { ServiceBelongingData } from "@/data/service/ServiceBelonging";

  const props = defineProps<{
    popupWindow: PopupWindow<ServiceBelongingData[]>;
  }>();

  const isShowing = computed(() => props.popupWindow.isShowing);
  const values = computed(() => props.popupWindow.data);

  const BelongingListEdit = ref();

  function onChange() {
    const belongings = BelongingListEdit.value.getResults();

    const accept = () => props.popupWindow.close();
    const reject = () => {};
    props.popupWindow.onConfirm(accept, reject, belongings);
  }
  function focus() {
    BelongingListEdit.value.focus();
  }

  onMounted(() => focus());
</script>

<template>
  <PanelAction
    title="Edit Belongings"
    :isShowing="isShowing"
    :isLoading="useServiceStore().isLoading"
    :isClickable="!useServiceStore().isLoading"
    @click-ok="() => onChange()"
    @click-cancel="() => popupWindow.close()"
    @click-dismiss="() => popupWindow.close()"
  >
    <BelongingListEditVue
      class="WindowBelongings-list"
      :values="values"
      ref="BelongingListEditVue"
    />
  </PanelAction>
</template>

<style lang="scss" scoped>
  .WindowBelongings-list {
    width: 35rem;
    max-width: 100%;
  }
</style>
