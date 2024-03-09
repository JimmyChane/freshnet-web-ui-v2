<script setup lang="ts">
  import ButtonIcon from "@/components/button/ButtonIcon.vue";
  import IconClose from "@/assets/icon/close-000000.svg";
  import IconSearch from "@/assets/icon/search-000000.svg";
  import { computed, ref, watch } from "vue";

  const emits = defineEmits<{
    enter: [HTMLInputElement | undefined];
    clear: [HTMLInputElement | undefined];
    focus: [HTMLInputElement | undefined];
    blur: [HTMLInputElement | undefined];
    input: [HTMLInputElement | undefined];
    change: [HTMLInputElement | undefined];
  }>();
  const props = withDefaults(
    defineProps<{
      placeholder?: string;
      model?: string;
      backIcon?: string;
      enterIcon?: string;
    }>(),
    { placeholder: "Search", backIcon: IconClose, enterIcon: IconSearch },
  );

  const search = ref("");

  const input = ref<HTMLInputElement>();

  const icon = computed(() =>
    search.value.length ? props.backIcon : props.enterIcon,
  );

  watch(
    () => props.model,
    () => (search.value = props.model ?? ""),
  );

  function blur() {
    input.value?.blur();
  }
  function focus() {
    input.value?.focus();
  }
  function enter() {
    focus();
    emits("enter", input.value);
  }
  function clear() {
    search.value = "";
    focus();
    emits("clear", input.value);
  }

  defineExpose({ value: search });
</script>

<template>
  <div :class="['Searchbar', 'transition']" @click="() => focus()">
    <ButtonIcon
      class="Searchbar-icon"
      :src="icon"
      :alt="search ? 'Clear' : 'Search'"
      @click="() => (search.length > 0 ? clear() : enter())"
    />
    <input
      class="Searchbar-input transition"
      ref="input"
      v-model="search"
      type="search"
      results="2"
      :placeholder="placeholder"
      @focus="(e) => emits('focus', input)"
      @blur="(e) => emits('blur', input)"
      @input="
        (e) => {
          search = (e.target as HTMLInputElement).value;
          emits('input', input);
        }
      "
      @change="(e) => emits('change', input)"
    />
  </div>
</template>

<style lang="scss" scoped>
  .Searchbar {
    z-index: 2;
    width: 100%;
    height: 100%;
    padding: 0.2em;
    border-radius: 2em;

    color: #5c5c5c;

    display: flex;
    flex-direction: row;
    align-items: center;

    transition-timing-function: cubic-bezier(1, 0, 0, 1);

    .Searchbar-icon {
      font-size: 0.8em;
    }
    .Searchbar-input {
      width: 100%;
      font-size: 1em;
      flex-grow: 1;
      outline: none;
      border: none;
      background: none;
      display: flex;
      flex-direction: row;
      transition-timing-function: cubic-bezier(1, 0, 0, 1);
      &::placeholder {
        color: hsla(0, 0%, 0%, 0.4);
        font-size: 0.8em;
      }
      &::-webkit-search-decoration,
      &::-webkit-search-cancel-button,
      &::-webkit-search-results-button,
      &::-webkit-search-results-decoration {
        display: none;
      }
    }

    background: hsla(0, 0%, 90%, 0.96);
    border: 1px solid hsla(0, 0%, 0%, 0.15);
    &:focus-within {
      background: white;
      border: 1px solid hsla(0, 0%, 0%, 0.15);
    }
  }
</style>
