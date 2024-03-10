<script setup lang="ts">
  import PanelAction from "@/components/panel/PanelAction.vue";
  import TextArea from "@/components/input/InputTextArea.vue";
  import { computed, onMounted, ref } from "vue";
  import { useServiceStore } from "@/data-stores/service.store";
  import { useSnackbarStore } from "@/stores/snackbar/snackbar.store";
  import type { PopupWindow } from "@/stores/popup-window/PopupWindow";

  const props = defineProps<{ popupWindow: PopupWindow }>();

  const description = ref("");

  const isShowing = computed(() => props.popupWindow.isShowing);
  const service = computed(() => props.popupWindow.data.service);
  const serviceEvent = computed(() => props.popupWindow.data.serviceEvent);

  const Input = ref();

  function onChange() {
    if (description.value === serviceEvent.value.description) {
      useSnackbarStore().show("No changes were made");
      return;
    }

    useServiceStore()
      .updateEventDescription({
        serviceID: service.value.id,
        time: serviceEvent.value.timestamp.time,
        description: description.value,
      })
      .then(() => {
        props.popupWindow.close();
      });
  }

  function focus() {
    Input.value?.focus();
  }

  onMounted(() => {
    focus();
    description.value = serviceEvent.value.description;
  });
</script>

<template>
  <PanelAction
    title="Edit Event Description"
    :isShowing="isShowing"
    :isLoading="useServiceStore().isLoading"
    :isClickable="!useServiceStore().isLoading"
    @click-ok="() => onChange()"
    @click-cancel="() => popupWindow.close()"
    @click-dismiss="() => popupWindow.close()"
  >
    <div class="WindowDescription-main">
      <TextArea
        ref="Input"
        type="text"
        label="Description"
        :isRequired="true"
        v-model="description"
      />
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
  .WindowDescription-main {
    width: 35rem;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    & > * {
      height: 7rem;
      background: hsla(0, 0%, 0%, 0.03);
      padding: 0.6rem 0.4rem;
    }
  }
</style>
