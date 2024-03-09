<script setup lang="ts">
  import { ref, watch } from "vue";
  import Searchbar from "./Searchbar.vue";

  const emits = defineEmits<{
    callbackSearch: [string];
    expand: [void];
    collapse: [void];
  }>();
  const props = withDefaults(
    defineProps<{ list: unknown[]; placeholder?: string }>(),
    { list: () => [], placeholder: "Search" },
  );

  const searchbar = ref();

  const search = ref("");
  const isExpand = ref(false);
  const searchLastCharTime = ref(0);

  watch(
    () => search.value,
    () => {
      isExpand.value = search.value.length > 0;

      const elapseTimeDesigned = 250;
      const date = new Date();
      const time = date.getTime();

      if (time < searchLastCharTime.value) return;

      searchLastCharTime.value = time;
      setTimeout(
        () => emits("callbackSearch", search.value),
        elapseTimeDesigned,
      );
    },
  );
  watch(
    () => isExpand.value,
    () => {
      isExpand.value ? emits("expand") : emits("collapse");
    },
  );

  function clear() {
    search.value = "";
  }
  function expand() {
    isExpand.value = true;
  }
  function collapse() {
    setTimeout(() => {
      isExpand.value = false;
    }, 300);
  }

  function focus() {
    searchbar.value?.focus();
  }
</script>

<template>
  <div class="SearchInput">
    <Searchbar
      ref="searchbar"
      :class="[
        isExpand ? 'SearchInput-body-isActive' : 'SearchInput-body-isPassive',
      ]"
      :model="search"
      :placeholder="placeholder"
      @clear="(e?: HTMLInputElement) => clear()"
      @input="(e?: HTMLInputElement) => (search = e?.value ?? '')"
      @blur="() => collapse()"
    />

    <div
      class="SearchInput-background transition"
      :style="{
        opacity: isExpand ? '1' : '0',
        'pointer-events': isExpand ? 'all' : 'none',
      }"
      @click="() => collapse()"
    />

    <div class="SearchInput-dropdown" v-if="isExpand">
      <div class="SearchInput-dropdown-body">
        <p v-if="!list || list.length <= 0">No Result</p>

        <slot
          :clear="() => clear()"
          :expand="() => expand()"
          :collapse="() => collapse()"
          :list="list"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .SearchInput {
    --background-color: hsla(0, 0%, 100%, 0.6);
    --background-color-active: white;
    --background-color-focus: white;

    --border-radius: 0.8rem;
    --border-radius-active: 0.8rem;

    --border: 1px solid hsla(0, 0%, 0%, 0.15);
    --border-focus: 1px solid hsla(0, 0%, 0%, 0.15);
    --border-active: white;

    --dropdown-height: 80vh;

    background: #e4e4e4;

    border-radius: var(--border-radius);

    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    height: 100%;
    position: relative;

    background: #e4e4e4;

    .SearchInput-body-isPassive {
      border: var(--border);
      background: var(--background-color);
      border-radius: var(--border-radius);
      &:focus-within {
        background: var(--background-color-focus);
        border: var(--border-focus);
      }
    }
    .SearchInput-body-isActive {
      background: var(--background-color-active);
      border-radius: var(--border-radius-active) var(--border-radius-active) 0 0;
      &:focus-within {
        background: var(--background-color-active);
        border: var(--border-active);
      }
    }

    .SearchInput-background {
      min-width: 100dvw;
      min-height: 100dvh;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: hsla(0, 0%, 0%, 0.6);
      display: grid;
    }

    .SearchInput-dropdown {
      width: 100%;
      height: 100dvh;
      max-height: var(--dropdown-height);

      z-index: 1;

      position: absolute;
      top: 100%;

      box-shadow: 0 0 60px hsla(0, 0%, 0%, 0.1);
      border-radius: 0 0 var(--border-radius-active) var(--border-radius-active);

      background: #e4e4e4;
      overflow: hidden;

      .SearchInput-dropdown-body {
        width: 100%;
        height: 100%;
        max-height: var(--dropdown-height);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.1rem;

        border-radius: 0 0 var(--border-radius-active)
          var(--border-radius-active);

        overflow-y: auto;
        overflow-x: hidden;

        padding: 0.7rem 0.9rem 4rem 0.9rem;
        color: black;

        & > * {
          width: 100%;
          height: max-content;
          overflow: initial;
        }
      }
    }
  }
</style>
