<script setup lang="ts">
import Searchbar from '@/components/search/Searchbar.vue';
import IconArrowLeft from '@/assets/icon/arrow-left-000000.svg';
import { onMounted, ref, watch } from 'vue';

const emits = defineEmits<{ inputText: [string]; clickDismiss: [void] }>();
withDefaults(defineProps<{ placeholder?: string }>(), {
  placeholder: 'Search',
});

const search = ref('');

const inputSearch = ref();

watch(() => search.value, onInput);

function blur() {
  inputSearch.value?.blur();
}
function focus() {
  inputSearch.value?.focus();
}

function onInput() {
  emits('inputText', search.value);
}

onMounted(() => onInput());

defineExpose({ blur, focus });
</script>

<template>
  <div class="WindowSearch-body">
    <Searchbar
      class="WindowSearch-input"
      ref="inputSearch"
      :model="search"
      :placeholder="placeholder"
      :enterIcon="IconArrowLeft"
      @input="(e?: HTMLInputElement) => (search = e?.value ?? '')"
      @clear="(e?: HTMLInputElement) => (search = '')"
      @enter="() => emits('clickDismiss')"
    />

    <div class="WindowSearch-items"><slot></slot></div>
  </div>
</template>

<style lang="scss" scoped>
.WindowSearch-body {
  width: 100dvw;
  height: 100dvh;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  overflow-y: auto;
  position: relative;

  .WindowSearch-input {
    --margin: 0.5rem;

    z-index: 2;
    position: sticky;
    top: var(--margin);

    height: max-content;
    width: calc(100% - var(--margin) - var(--margin));
    margin: var(--margin);
  }

  .WindowSearch-items {
    z-index: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    padding: 0.5rem;
  }
}
</style>
