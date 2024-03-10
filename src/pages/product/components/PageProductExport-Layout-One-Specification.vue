<script setup lang="ts">
  import { Specification } from "@/data/specification/Specification";
  import { onMounted, ref, watch } from "vue";

  const props = defineProps<{ item: Specification }>();

  const title = ref("");
  const icon = ref("");
  const content = ref("");

  watch(() => props.item, invalidate);

  async function invalidate() {
    title.value = "";
    icon.value = "";
    content.value = "";

    const type = (await props.item?.fetchType()) ?? null;

    title.value = type?.title ?? parseKeyToTitle(props.item.typeKey);
    icon.value = type?.icon?.toUrl() ?? "";
    content.value = props.item.content;
  }
  function parseKeyToTitle(key = "") {
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
  <div class="ItemProductSpecification">
    <img :style="{ opacity: icon ? '1' : '0' }" :src="icon" />
    <span>{{ title }}</span>
    <span>{{ content }}</span>
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

    --min-height: 24px;

    :nth-child(1) {
      object-fit: contain;
      font-size: 20px;

      width: 20px;
      min-height: var(--min-height);

      display: flex;
      flex-direction: row;
      align-items: flex-start;
    }
    :nth-child(2) {
      line-height: 20px;
      font-size: 16px;

      --width: 120px;
      width: var(--width);
      min-width: var(--width);
      max-width: var(--width);
      min-height: var(--min-height);

      display: flex;
      flex-direction: row;
      align-items: center;
    }
    :nth-child(3) {
      font-size: 20px;

      min-height: var(--min-height);

      display: flex;
      flex-direction: row;
      flex-grow: 1;
      align-items: center;
      justify-content: flex-start;
    }
  }
</style>
