<script setup lang="ts">
import ButtonIcon from '@/components/button/ButtonIcon.vue';
import IconEdit from '@/assets/icon/edit-000000.svg';
import { isColorDark } from '@/utils/U';
import type { Color } from 'chroma-js';
import type { Product } from '@/data/Product';
import { computed, onMounted, ref, watch } from 'vue';

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

const fullTitle = ref('');

const titleColor = computed(() => {
  if (props.primaryColor && isColorDark(props.primaryColor)) {
    return props.primaryColor.mix('000000', 0.98);
  }

  return 'white';
});
const title = computed(() => props.product?.title ?? '');
const brandId = computed(() => props.product?.brandId ?? '');

watch(() => props.product, invalidateProduct);

async function invalidateProduct() {
  fullTitle.value = '';
  if (props.product) {
    fullTitle.value = await props.product.fetchFullTitle();
  }
}

onMounted(() => invalidateProduct());
</script>

<template>
  <div class="ViewerProduct-Title">
    <span :style="{ color: titleColor.toString() }">{{ fullTitle }}</span>
    <ButtonIcon
      class="ViewerProduct-button"
      v-if="allowEdit"
      :src="IconEdit"
      @click="() => $emit('click-edit', { product, title: title, brandId: brandId })"
    />
  </div>
</template>

<style lang="scss" scoped>
.ViewerProduct-Title {
  padding: 2rem;
  margin-top: -1rem;

  font-size: 2.2rem;
  font-weight: 600;
  text-align: center;
  color: white;
  transition: color var(--color-transition-duration);

  position: relative;

  @media (max-width: 480px) {
    font-size: 1.6rem;
  }

  .ViewerProduct-button {
    position: absolute;
    top: 0.5em;
    right: 0;
  }
}
</style>
