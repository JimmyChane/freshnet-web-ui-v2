<script setup lang="ts">
import PanelAction from '@/components/panel/PanelAction.vue';
import TextArea from '@/components/input/InputTextArea.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useServiceStore } from '@/data-stores/service.store';
import { useSnackbarStore } from '@/stores/snackbar/snackbar.store';
import type { PopupWindow } from '@/stores/popup-window/PopupWindow';

const props = defineProps<{ popupWindow: PopupWindow }>();

const value = ref('');

const isShowing = computed(() => props.popupWindow.isShowing);
const description = computed(() => props.popupWindow.data.description);

const Input = ref();

watch(
  () => description.value,
  () => {
    value.value = description.value;
  },
);

function onChange() {
  if (description.value === value.value) {
    useSnackbarStore().show('No Changes');
    return;
  }

  const accept = () => props.popupWindow.close();
  const reject = () => {};
  props.popupWindow.data.onConfirm(accept, reject, value.value);
}

function focus() {
  Input.value.focus();
}

onMounted(() => {
  focus();
  value.value = description.value;
});
</script>

<template>
  <PanelAction
    title="Edit Description"
    :isShowing="isShowing"
    :isLoading="useServiceStore().isLoading"
    :isClickable="!useServiceStore().isLoading"
    @click-ok="() => onChange()"
    @click-cancel="() => popupWindow.close()"
    @click-dismiss="() => popupWindow.close()"
  >
    <div class="WindowDescription-main">
      <TextArea ref="Input" type="text" label="Description" :isRequired="true" v-model="value" />
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
