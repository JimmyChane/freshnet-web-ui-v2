<script setup lang="ts">
import type { ServiceBelongingData } from '@/data/ServiceBelonging';

const emits = defineEmits<{ invalidate: [void] }>();
const props = defineProps<{
  belongings: ServiceBelongingData[];
  belonging: ServiceBelongingData;
}>();

function validateTitle(title: string, belonging: ServiceBelongingData) {
  title = title.trim();
  if (title === '') belonging.quantity = 0;
  else belonging.quantity = (belonging.quantity ?? 0) > 0 ? belonging.quantity : 1;

  return title;
}

function onTitleInput(value: string, belonging: ServiceBelongingData) {
  belonging.title = validateTitle(value, belonging);
  emits('invalidate');
}
function onTitleChange(value: string, belonging: ServiceBelongingData) {
  validateTitle(value, belonging);
  emits('invalidate');
}
function onDescriptionInput(value: string, belonging: ServiceBelongingData) {
  belonging.description = value.trim();
}
function onDescriptionKeyup(event: KeyboardEvent) {
  const { key, target } = event;

  if ((props.belonging.description ?? '').length !== 0) return;
  if (key === 'Enter' && !event.shiftKey) {
    event.preventDefault();

    const focusableElements = document.querySelectorAll(
      'input:not([disabled]), textarea:not([disabled])',
    );
    const currentIndex = Array.from(focusableElements).indexOf(target as HTMLElement);
    const nextIndex = (currentIndex + 1) % focusableElements.length;

    const nextElement = focusableElements[nextIndex] as HTMLElement;
    nextElement.focus();
  }
}
function onCountChange(event: Event, belonging: ServiceBelongingData) {
  const target = event.target as HTMLInputElement;

  let count = Number.parseInt(target.value);
  if (Number.isNaN(count)) count = 0;
  if (count < 0) count = 0;
  if (count > 999) count = 999;
  target.value = `${count}`;
  belonging.quantity = count;
}
</script>

<template>
  <div class="BelongingListEdit-item">
    <input
      class="BelongingListEdit-item-input"
      style="grid-area: title"
      ref="input"
      type="text"
      autocapitalize="words"
      :placeholder="`Item ${belongings.indexOf(belonging) + 1}`"
      :value="belonging.title"
      @input="(event) => onTitleInput((event.target as HTMLInputElement).value, belonging)"
      @change="(event) => onTitleChange((event.target as HTMLInputElement).value, belonging)"
    />
    <div class="BelongingListEdit-item-line"></div>
    <span class="BelongingListEdit-item-equation" style="grid-area: equation">x</span>
    <input
      class="BelongingListEdit-item-count"
      style="grid-area: count"
      type="number"
      :value="belonging.quantity"
      @change="(event) => onCountChange(event, belonging)"
      @input="(event) => onCountChange(event, belonging)"
    />
    <textarea
      class="BelongingListEdit-item-description"
      style="grid-area: description"
      type="text"
      placeholder="Description"
      :value="belonging.description"
      @input="(event) => onDescriptionInput((event.target as HTMLTextAreaElement).value, belonging)"
      @keyup="(event) => onDescriptionKeyup(event)"
    />
  </div>
</template>

<style lang="scss" scoped>
.BelongingListEdit-item {
  width: 100%;

  display: flex;
  flex-direction: row;
  align-items: center;

  border: 0.1em solid rgba(0, 0, 0, 0.05);
  border-radius: 1em;
  background: hsla(0, 0%, 0%, 0.03);
  font-weight: 400;
  font-size: 1em;
  color: black;

  display: grid;
  grid-template-areas:
    'title line equation count'
    'description description description description';
  grid-template-columns: 1fr 1px max-content max-content;
  grid-template-rows: max-content 1fr;

  .BelongingListEdit-item-input {
    width: 100%;
    padding: 0.8em;
    z-index: 2;

    display: flex;
    flex-grow: 1;

    border: none;
    background: none;
    font-size: inherit;
  }
  .BelongingListEdit-item-line {
    min-width: 1px;
    min-height: calc(100% - 1em);
    margin: 0.5em 0;
    background: rgba(0, 0, 0, 0.1);
  }
  .BelongingListEdit-item-equation {
    margin-left: 0.8em;
  }
  .BelongingListEdit-item-count {
    width: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 0;

    padding: 0.8em;
    padding-left: 0.2em;
    border: none;
    background: none;
    font-size: inherit;
    text-align: start;
  }
  .BelongingListEdit-item-description {
    height: 3rem;

    resize: vertical;
    padding: 0.8em;
    padding-top: 0.2em;
    border: none;
    background: none;
  }
}
</style>
