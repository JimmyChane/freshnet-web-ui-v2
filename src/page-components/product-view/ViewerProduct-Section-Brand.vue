<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import Section from './ViewerProduct-Section.vue';
import IconEdit from '@/assets/icon/edit-000000.svg';
import type { Brand } from '@/data/Brand';
import type { Product } from '@/data/Product';
import type { Color } from 'chroma-js';

const props = withDefaults(
  defineProps<{
    primaryColor?: Color;
    allowEdit?: boolean;
    product?: Product;
  }>(),
  { allowEdit: false },
);

const brand = ref<Brand>();

const title = computed(() => props.product?.title ?? '');
const brandId = computed(() => props.product?.brandId ?? '');
const brandTitle = computed(() => brand.value?.title ?? '');
const brandIconUrl = computed(() => brand.value?.icon?.toUrl() ?? '');

watch(() => props.product, invalidate);
watch(() => brandId.value, invalidate);

async function invalidate() {
  brand.value = undefined;
  if (!props.product) return;
  brand.value = await props.product.fetchBrand();
}

onMounted(() => invalidate());
</script>

<template>
  <Section
    v-if="allowEdit"
    title="Brand"
    :primaryColor="primaryColor"
    :menu="{
      title: 'Edit',
      icon: IconEdit,
      click: () => $emit('click-edit', { product, title: title, brandId: brandId }),
    }"
  >
    <div class="SectionBrand">
      <div class="SectionBrand-item" v-if="brand">
        <img class="SectionBrand-item-icon" v-if="brandIconUrl" :src="brandIconUrl" />
        <span class="SectionBrand-item-title" v-if="brandTitle">{{ brandTitle }}</span>
      </div>

      <span class="SectionBrand-noContent" v-else>No Brand</span>
    </div>
  </Section>
</template>

<style lang="scss" scoped>
.SectionBrand {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  .SectionBrand-item {
    width: 100%;
    padding: 0.8rem;
    gap: 1.4rem;
    background: hsla(0, 0%, 100%, 0.6);

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    .SectionBrand-item-icon {
      padding: 0.5rem;
      height: 2rem;
      background: hsla(0, 0%, 100%, 0.5);
      border: 1px solid white;
      border-radius: 0.2rem;
    }
    .SectionBrand-item-title {
      font-size: 1.1rem;
      font-weight: 600;
    }
  }
  .SectionBrand-noContent {
    width: 100%;
    padding: 1.2rem;
    font-style: italic;
    font-size: 0.8rem;
    color: hsla(0, 0%, 0%, 0.6);
    background: hsla(0, 0%, 100%, 0.6);
  }
}
</style>
