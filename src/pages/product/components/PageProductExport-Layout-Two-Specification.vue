<script setup lang="ts">
  import { Specification } from "@/data/specification/Specification";
  import { onMounted, ref, watch } from "vue";

  const props = withDefaults(
    defineProps<{
      item: Specification;
      padding: number;
      isLastItem: boolean;
    }>(),
    { padding: 14, isLastItem: false },
  );

  const title = ref("");
  const icon = ref("");
  const content = ref("");

  watch(() => props.item, invalidate);

  async function invalidate() {
    title.value = "";
    icon.value = "";
    content.value = "";

    const type = await props.item?.fetchType();

    title.value = type?.title ?? parseKeyToTitle(props.item.typeKey);
    icon.value = type?.icon?.toUrl() ?? "";
    content.value = props.item.content;
  }
  function parseKeyToTitle(key: string = "") {
    if (typeof key !== "string") key = "none";
    if (key === "none") return "";

    return key.split(" ").reduce((title, text) => {
      let result = text.charAt(0).toUpperCase() + text.slice(1);
      return title === "" ? result : `${title} ${result}`;
    }, "");
  }

  onMounted(() => {
    invalidate();
  });
</script>

<template>
  <div
    class="ItemProductSpecification"
    :style="{ padding: `${padding}px` }"
    :isLastItem="`${isLastItem}`"
  >
    <span class="ItemProductSpecification-title">{{ title }}</span>
    <span class="ItemProductSpecification-content">{{ content }}</span>
  </div>
</template>

<style lang="scss" scoped>
  .ItemProductSpecification {
    width: 100%;
    max-width: 100%;
    gap: 14px;

    display: flex;
    flex-direction: row;
    align-items: flex-start;

    --min-height: 20px;
    --font-size-title: 14px;
    --font-size-content: 18px;

    :nth-child(1) {
      line-height: var(--font-size-content);
      font-size: var(--font-size-title);

      --width: 120px;
      width: var(--width);
      min-width: var(--width);
      max-width: var(--width);
      min-height: var(--min-height);

      display: flex;
      flex-direction: row;
      align-items: center;
      color: hsl(0, 0%, 30%);
    }
    :nth-child(2) {
      font-size: var(--font-size-content);
      font-weight: 600;

      min-height: var(--min-height);

      display: flex;
      flex-direction: row;
      flex-grow: 1;
      align-items: center;
      justify-content: flex-start;
    }
  }
  .ItemProductSpecification[isLastItem="false"] {
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
</style>
