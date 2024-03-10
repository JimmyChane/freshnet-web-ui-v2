<script setup lang="ts">
  import { computed } from "vue";

  const props = defineProps<{ item: Record<string, any> }>();

  const itemKeys = computed(() => {
    return keys(props.item);
  });

  function shouldIncludeNextLine(item: Record<string, any>, key: string) {
    return (
      (isArray(item) && key < itemKeys.value.length - 1) ||
      (isObject(item) &&
        itemKeys.value.indexOf(key) !== itemKeys.value.length - 1)
    );
  }

  function keys(value: Record<string, any>): string[] {
    return value !== undefined && value !== null ? Object.keys(value) : [];
  }
  function isNull(value: any): boolean {
    return value === null;
  }
  function isArray(value: any): boolean {
    return Array.isArray(value);
  }
  function isObject(value: any): boolean {
    return typeof value === "object";
  }
  function isBoolean(value: any): boolean {
    return typeof value === "boolean";
  }
  function isNumber(value: any): boolean {
    return typeof value === "number";
  }
  function isString(value: any): boolean {
    return typeof value === "string";
  }
</script>

<template>
  <div class="ItemObject">
    <span class="ItemObject-property" v-for="key in itemKeys" :key="key">
      <span class="ItemObject-key" v-if="!isArray(item)">"{{ key }}"</span>

      <span class="ItemObject-separator" v-if="!isArray(item)">:</span>

      <span class="ItemObject-value" v-if="isNull(item[key])">null</span>
      <span class="ItemObject-value" v-else-if="isArray(item[key])"
        >{{ "[" }}<ItemObject v-if="item[key].length" :item="item[key]" />{{
          "]"
        }}</span
      >
      <span class="ItemObject-value" v-else-if="isObject(item[key])"
        >{{ "{" }}<ItemObject v-if="itemKeys.length" :item="item[key]" />{{
          "}"
        }}</span
      >
      <span
        class="ItemObject-value"
        v-else-if="isBoolean(item[key]) || isNumber(item[key])"
      >
        {{ item[key] }}
      </span>
      <span class="ItemObject-value" v-else>{{ `"${item[key]}"` }}</span>

      <span class="ItemObject-nextLine">{{
        shouldIncludeNextLine(item, key) ? "," : ""
      }}</span>
    </span>
  </div>
</template>

<style lang="scss" scoped>
  .ItemObject {
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 0.2rem;

    border-left: 2px solid hsla(0, 0%, 0%, 0.2);
    border-radius: 0 0.4rem 0.4rem 0;
    padding: 0.2rem;

    .ItemObject-property {
      padding-left: 1rem;
      padding-right: 0.4rem;
      .ItemObject-key {
        --width: 8rem;
        min-width: var(--width);
        max-width: var(--width);
        font-size: 0.8rem;
        color: hsl(0, 0%, 30%);
        word-break: break-all;
      }
      .ItemObject-separator {
        padding-left: 0.5rem;
        padding-right: 1rem;
      }
      .ItemObject-value {
        font-size: 1rem;
        word-break: break-all;
      }
      .ItemObject-nextLine {
        padding-left: 0.5rem;
        padding-right: 1rem;
      }
    }
  }
</style>
