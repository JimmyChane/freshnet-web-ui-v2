<script setup lang="ts">
  import { computed } from "vue";
  import Section from "./ViewerProduct-Section.vue";
  import Checkbox from "./ViewerProduct-StockCheckbox.vue";
  import type { Color } from "chroma-js";
  import type { Product } from "@/data/product/Product";
  import { useProductStore } from "@/data-stores/product.store";

  const props = withDefaults(
    defineProps<{
      primaryColor?: Color;
      allowEdit?: boolean;
      product?: Product;
    }>(),
    { allowEdit: false },
  );

  const productIsAvailable = computed(
    () => props.product?.isStockAvailable() ?? true,
  );
  const productIsSecondHand = computed(
    () => props.product?.isStockSecondHand() ?? false,
  );
</script>

<template>
  <Section :primaryColor="primaryColor" title="Stock" v-if="allowEdit">
    <div class="SectionStock">
      <Checkbox
        class="SectionStock-outOfStock"
        title="Out of Stock"
        :checked="!productIsAvailable"
        @click="
          () => {
            if (product)
              useProductStore().updateAvailabilityOfId({
                id: product.id,
                isAvailable: !productIsAvailable,
              });
          }
        "
      />
      <Checkbox
        class="SectionStock-secondHand"
        title="Second Hand"
        :checked="productIsSecondHand"
        @click="
          () => {
            if (product)
              useProductStore().updateSecondHandOfId({
                id: product.id,
                isSecondHand: !productIsSecondHand,
              });
          }
        "
      />
    </div>
  </Section>
</template>

<style lang="scss" scoped>
  .SectionStock {
    grid-area: stock;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 0.5rem;
    background: hsla(0, 0%, 100%, 0.6);
    padding: 1.2rem;
    .SectionStock-outOfStock {
      --primary-color: #ff4b33;
    }
    .SectionStock-secondHand {
      --primary-color: #249696;
    }
  }
</style>
