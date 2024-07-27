<script setup lang="ts">
import ItemSettingHeader from './ItemSetting-Header.vue';

import IconClose from '@/assets/icon/close-000000.svg';
import IconSave from '@/assets/icon/save-000000.svg';
import IconEdit from '@/assets/icon/edit-000000.svg';
import { computed, onMounted, ref, watch } from 'vue';
import { useSettingStore } from '@/data-stores/setting.store';
import { optString } from '@/utils/U';
import type { SettingUI } from './PageSetting';

const props = defineProps<{ item: SettingUI }>();

const textareaRef = ref<HTMLTextAreaElement>();

const isEditable = ref(false);
const isEditing = ref(false);
const value = ref();
const nextValue = ref('');

const isEmpty = computed(() => !optString(value.value).length);
const title = computed(() => props.item.getTitle());
const actions = computed(() => {
  if (props.item.isReadonly()) {
    return [];
  }

  if (isEditing.value) {
    return [
      {
        title: 'Discard',
        icon: IconClose,
        click: () => (isEditing.value = false),
      },
      {
        title: 'Save',
        icon: IconSave,
        click: async () => {
          if (!isEditing.value) return;
          await props.item.updateValue(nextValue.value);
          isEditing.value = false;
        },
      },
    ];
  }

  return [
    {
      title: 'Edit',
      icon: IconEdit,
      click: () => (isEditing.value = true),
    },
  ];
});

watch(() => useSettingStore().lastModified, invalidateValue);
watch(() => props.item, invalidateValue);
watch(
  () => isEditable.value,
  () => {
    if (!textareaRef.value) return;

    if (isEditing.value) {
      nextValue.value = value.value;
      textareaRef.value.focus();
    } else {
      nextValue.value = '';
      textareaRef.value.blur();
    }
  },
);

function invalidateValue() {
  const setting = props.item.findValue();
  value.value = setting?.value ?? undefined;
}

onMounted(() => invalidateValue());
</script>

<template>
  <div :class="['ItemSetting-TextArea', 'transition']">
    <ItemSettingHeader class="ItemSetting-header" :title="title" :actions="actions" />

    <textarea
      :class="['transition', 'ItemSetting-TextArea-value', 'ItemSetting-TextArea-textarea']"
      :isShowing="`${isEditing}`"
      ref="textareaRef"
      v-model="nextValue"
    />
    <p :class="['ItemSetting-TextArea-value', 'ItemSetting-TextArea-p']" v-if="!isEmpty">
      {{ value }}
    </p>
    <span
      :class="['transition', 'ItemSetting-TextArea-empty']"
      :isShowing="`${!isEditable && isEmpty}`"
    >
      Empty
    </span>
  </div>
</template>

<style lang="scss" scoped>
.ItemSetting-TextArea {
  width: 100%;
  padding: 1rem;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  background: white;

  .ItemSetting-header {
    margin-top: -1rem;
    font-weight: 500;
    font-size: 0.9rem;
    padding: 0;
    color: hsl(0, 0%, 20%);
  }

  .ItemSetting-TextArea-value {
    width: 100%;
    padding: 0.8rem;
    font-size: 0.9rem;

    background: none;
    border-radius: 0.5rem;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  .ItemSetting-TextArea-textarea {
    resize: none;
    background: hsl(0, 0%, 90%);
    --transition-timing: cubic-bezier(1, 0, 0, 1);
  }
  .ItemSetting-TextArea-textarea[isShowing='true'] {
    height: 10rem;
    margin-bottom: 0.5rem;
  }
  .ItemSetting-TextArea-textarea[isShowing='false'] {
    height: 0;
    padding-top: 0;
    padding-bottom: 0;
    border-color: transparent;
    background: transparent;
    margin-top: -1px;
    pointer-events: none;
    opacity: 0;
  }

  .ItemSetting-TextArea-empty {
    font-size: 0.8rem;
    color: hsl(0, 0%, 75%);
    --transition-timing: cubic-bezier(1, 0, 0, 1);
    --transition-delay: 2s;
    overflow: hidden;
  }
  .ItemSetting-TextArea-empty[isShowing='true'] {
    height: max-content;
  }
  .ItemSetting-TextArea-empty[isShowing='false'] {
    height: 0;
    margin-top: -1px;
  }
}
</style>
@/stores/data-stores/user.store
