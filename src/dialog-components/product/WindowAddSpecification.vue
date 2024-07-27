<script setup lang="ts">
import WindowAction from '@/components/window/WindowAction.vue';
import Selector from '@/components/selector/Selector.vue';
import { TypeKey } from '@/data/Specification';
import Input from '@/components/input/Input.vue';
import { computed, ref } from 'vue';
import { useSpecificationStore } from '@/data-stores/specification.store';
import { useSnackbarStore } from '@/stores/snackbar/snackbar.store';
import type { SelectorMenu } from '@/components/selector/Selector';

const props = withDefaults(
  defineProps<{
    isShowing: boolean;
    action: {
      onDismiss: () => void;
      onCancel: () => void;
      onConfirm: (specification: { type: string; content: string }) => void;
    };
  }>(),
  { isShowing: false },
);

const keys = computed(() => Object.values(TypeKey));

const data = ref({ key: '', content: '' });

const typeSelections = computed<SelectorMenu[]>(() => {
  return useSpecificationStore()
    .items.map((item) => {
      return {
        key: item.key as string,
        title: item.title,
        icon: item.icon ? item.icon.toUrl() : '',
        item: item,
      };
    })
    .sort((item1, item2) => {
      let key1 = item1.key ?? '';
      let key2 = item2.key ?? '';

      let index1 = key1 ? keys.value.indexOf(key1 as TypeKey) : 0;
      let index2 = key2 ? keys.value.indexOf(key2 as TypeKey) : 0;

      index1 = index1 >= 0 ? index1 : keys.value.length;
      index2 = index2 >= 0 ? index2 : keys.value.length;

      return index1 !== index2 ? index1 - index2 : key1.localeCompare(key2);
    });
});

function onDismiss() {
  props.action.onDismiss();
  data.value = { key: '', content: '' };
}
function onCancel() {
  props.action.onCancel();
  data.value = { key: '', content: '' };
}
function onConfirm() {
  Promise.resolve()
    .then(() => {
      const selection = typeSelections.value.find(
        (typeSelection) => typeSelection.key === data.value.key,
      );
      if (!selection) {
        useSnackbarStore().show('Cannot find the matching type');
        throw new Error();
      }

      return {
        type: selection.key,
        content: data.value.content,
      };
    })
    .then((specification) => {
      props.action.onConfirm(specification);
    })
    .catch((error) => {
      useSnackbarStore().show('Error While Loading Specification');
    });
  return;
}
</script>

<template>
  <WindowAction
    class="WindowSpecificationAdd"
    title="Add Specification"
    :isShowing="isShowing"
    @click-dismiss="onDismiss"
    @click-cancel="onCancel"
    @click-ok="onConfirm"
  >
    <div class="WindowSpecificationAdd-body">
      <div class="WindowSpecificationAdd-section">
        <span>Type</span>
        <Selector :list="typeSelections" @callback-select="(key) => (data.key = key)" />
      </div>

      <div class="WindowSpecificationAdd-section">
        <Input
          class="WindowSpecificationAdd-input"
          label="Content"
          :isRequired="true"
          v-model="data.content"
        />
      </div>
    </div>
  </WindowAction>
</template>

<style lang="scss" scoped>
.WindowSpecificationAdd-body {
  width: 26rem;
  height: 35rem;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  .WindowSpecificationAdd-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    .WindowSpecificationAdd-input {
      padding-left: 0;
      padding-right: 0;
    }
  }
}
</style>
