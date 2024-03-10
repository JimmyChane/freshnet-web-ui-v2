<script setup lang="ts">
  import { computed } from "vue";
  import type { Color } from "chroma-js";
  import Section from "./ViewerProduct-Section.vue";
  import IconEdit from "@/assets/icon/edit-000000.svg";
  import type { Product } from "@/data/product/Product";

  const emits = defineEmits<{
    clickEdit: [{ product?: Product; description: string }];
  }>();
  const props = withDefaults(
    defineProps<{
      primaryColor?: Color;
      allowEdit?: boolean;
      product?: Product;
    }>(),
    { allowEdit: false },
  );

  const description = computed(() => props.product?.description ?? "");
  const menu = computed(() => {
    if (!props.allowEdit) return undefined;
    return {
      title: "Edit",
      icon: IconEdit,
      click: () =>
        emits("clickEdit", {
          product: props.product,
          description: description.value,
        }),
    };
  });
</script>

<template>
  <Section
    class="SectionDescription-parent"
    v-if="allowEdit || description"
    :title="allowEdit ? 'Description' : ''"
    :primaryColor="primaryColor"
    :menu="menu"
  >
    <div class="SectionDescription">
      <p v-if="description">{{ description }}</p>
      <span class="SectionDescription-noContent" v-else>No Description</span>
    </div>
  </Section>
</template>

<style lang="scss" scoped>
  .SectionDescription-parent {
    grid-area: description;
    .SectionDescription {
      width: 100%;
      font-size: 1rem;

      background: hsla(0, 0%, 100%, 0.6);
      padding: 1.2rem;
      font-size: 1rem;
      .SectionDescription-noContent {
        opacity: 0.6;
        font-style: italic;
        font-size: 1rem;
      }
    }
  }
</style>
