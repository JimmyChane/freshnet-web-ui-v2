<script setup lang="ts">
import type { Color } from 'chroma-js';
import Section from './ViewerProduct-Section.vue';
import type { Product } from '@/data/Product';
import { computed } from 'vue';
import { isObjectOnly, optString } from '@/utils/U';

const props = withDefaults(
  defineProps<{
    primaryColor?: Color;
    allowEdit?: boolean;
    product?: Product;
  }>(),
  {
    allowEdit: false,
  },
);

const gifts = computed(() => props.product?.gifts ?? []);
const bundles = computed(() => props.product?.bundles ?? []);
const items = computed(() => {
  return [
    ...gifts.value.map((gift) => optString(gift).trim()).filter((gift) => gift.length),
    ...bundles.value
      .filter((bundle) => isObjectOnly(bundle))
      .map((bundle) => optString(bundle.title).trim())
      .filter((bundle) => bundle.length),
  ];
});
</script>

<template>
  <Section v-if="allowEdit || items.length" :title="`What's Included`" :primaryColor="primaryColor">
    <div class="SectionInclude">
      <div class="SectionInclude-items" v-if="items.length">
        <span class="SectionInclude-item" v-for="item of items" :key="item">{{ item }}</span>
      </div>

      <span class="SectionInclude-noContent" v-else>Nothing Included</span>
    </div>
  </Section>
</template>

<style lang="scss" scoped>
.SectionInclude {
  grid-area: gift;
  width: 100%;
  gap: 2px;
  font-size: 1rem;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  & > * {
    width: 100%;
    padding: 1.2rem;
    background: hsla(0, 0%, 100%, 0.6);
  }

  .SectionInclude-items {
    gap: 0.2rem;

    overflow: hidden;
    overflow-x: auto;

    display: flex;
    flex-direction: row;
    align-items: flex-start;

    .SectionInclude-item {
      --size: 8rem;
      width: var(--size);
      min-width: var(--size);
      height: var(--size);
      padding: 0.8rem;

      border-radius: 1rem;

      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      border: 1px solid hsla(0, 0%, 0%, 0.2);
    }
  }
  .SectionInclude-noContent {
    font-style: italic;
    font-size: 0.8rem;
    color: hsla(0, 0%, 0%, 0.6);
  }
}
</style>
