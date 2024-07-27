<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '@/data/Product';
import Section from './ViewerProduct-Section.vue';
import IconEdit from '@/assets/icon/edit-000000.svg';
import type { Color } from 'chroma-js';

const props = withDefaults(
  defineProps<{
    primaryColor?: Color;
    allowEdit?: boolean;
    product?: Product;
  }>(),
  { allowEdit: false },
);

const title = computed(() => props.product?.title ?? '');
const brandId = computed(() => props.product?.brandId ?? '');
</script>

<template>
  <Section
    v-if="allowEdit"
    title="Title"
    :primaryColor="primaryColor"
    :menu="{
      title: 'Edit',
      icon: IconEdit,
      click: () => $emit('click-edit', { product, title: title, brandId: brandId }),
    }"
  >
    <div class="ViewerProduct-title">
      <span v-if="title">{{ title }}</span>
      <span class="ViewerProduct-title-noContent" v-else>No Title</span>
    </div>
  </Section>
</template>

<style lang="scss" scoped>
.ViewerProduct-title {
  font-size: 1rem;
  background: hsla(0, 0%, 100%, 0.6);
  padding: 1.2rem;
  font-weight: 600;
  .ViewerProduct-title-noContent {
    opacity: 0.6;
    font-style: italic;
  }
}
</style>
