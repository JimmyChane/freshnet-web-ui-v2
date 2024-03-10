<script setup lang="ts">
  import { computed, onMounted, ref, watch } from "vue";
  import Label from "./ItemCustomer-Label.vue";
  import { useCategoryStore } from "@/data-stores/category.store";
  import Category from "@/data/category/Category";

  const props = withDefaults(
    defineProps<{ categoryKey: string; count: number }>(),
    { categoryKey: "", count: 0 },
  );

  const category = ref<Category>();

  const icon = computed(() => category.value?.icon?.toUrl() ?? "");

  watch(() => props.categoryKey, invalidate);

  async function invalidate() {
    category.value = undefined;
    category.value = await useCategoryStore().getItemOfKey(props.categoryKey);
  }

  onMounted(() => {
    invalidate();
  });
</script>

<template>
  <Label :icon="icon" :count="count" />
</template>
