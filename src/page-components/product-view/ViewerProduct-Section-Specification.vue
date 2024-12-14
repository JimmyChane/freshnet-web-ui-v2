<script setup lang="ts">
import { computed } from 'vue';
import Section from './ViewerProduct-Section.vue';
import ItemProductSpecification from './ViewerProduct-Section-Specification-Item.vue';
import { Specification, Type, TypeKey } from '@/data/Specification';
import IconEdit from '@/assets/icon/edit-000000.svg';
import type { Color } from 'chroma-js';
import type { Product } from '@/data/Product';

const emits = defineEmits<{
  clickEdit: [{ product?: Product; specifications: Specification[] }];
}>();
const props = withDefaults(
  defineProps<{
    primaryColor?: Color;
    allowEdit?: boolean;
    product?: Product;
  }>(),
  { allowEdit: false },
);

const keys = computed(() => Object.keys(TypeKey));

const specifications = computed(() => {
  if (!props.product) return [];
  if (!Array.isArray(props.product.specifications)) return [];

  return props.product.specifications
    .filter((spec) => spec && spec.type && spec.content)
    .sort((spec1, spec2) => {
      const key1 = obtainKeyOfSpecificationType(spec1.type) ?? '';
      const key2 = obtainKeyOfSpecificationType(spec2.type) ?? '';

      let index1 = keys.value.indexOf(key1);
      let index2 = keys.value.indexOf(key2);

      index1 = index1 >= 0 ? index1 : keys.value.length;
      index2 = index2 >= 0 ? index2 : keys.value.length;

      return index1 !== index2 ? index1 - index2 : key1.localeCompare(key2);
    });
});
const menu = computed(() => {
  if (!props.allowEdit) return undefined;
  return {
    title: 'Edit',
    icon: IconEdit,
    click: () =>
      emits('clickEdit', {
        product: props.product,
        specifications: specifications.value,
      }),
  };
});

function obtainKeyOfSpecificationType(type?: Type): TypeKey | undefined {
  if (typeof type === 'object') return type.key;
  if (typeof type === 'string') return type;
}
</script>

<template>
  <Section
    v-if="allowEdit || specifications.length"
    :primaryColor="primaryColor"
    :menu="menu"
    :title="allowEdit ? 'Specification' : ''"
  >
    <div class="SectionSpecification">
      <div class="SectionSpecification-items" v-if="specifications.length">
        <ItemProductSpecification
          v-for="spec in specifications"
          :key="spec.typeKey"
          :productSpecification="spec"
          :isVertical="true"
        />
      </div>

      <span class="SectionSpecification-noContent" v-else>No Specifications</span>
    </div>
  </Section>
</template>

<style lang="scss" scoped>
.SectionSpecification {
  grid-area: specification;
  width: 100%;
  font-size: 1rem;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .SectionSpecification-items {
    width: 100%;
    gap: 3px;
    display: flex;
    flex-direction: column;
  }
  .SectionSpecification-noContent {
    width: 100%;
    padding: 1.2rem;
    font-style: italic;
    font-size: 0.8rem;
    color: hsla(0, 0%, 0%, 0.6);
    background: hsla(0, 0%, 100%, 0.6);
  }
}
</style>
