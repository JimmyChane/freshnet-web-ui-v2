<script setup lang="ts">
  import { Type } from "@/data/specification/Specification";
  import Item from "./PageProductExport-Layout-One-Specification.vue";
  import { ProductPrice } from "@/data/product/ProductPrice";
  import { Product } from "@/data/product/Product";
  import { computed, onMounted, ref, watch } from "vue";
  import { useLoginStore } from "@/stores/login.store";

  const props = withDefaults(
    defineProps<{ width?: number; height?: number; product?: Product }>(),
    { width: 0, height: 0 },
  );

  const bodyRef = ref<HTMLDivElement>();
  const selfRef = ref<HTMLDivElement>();

  const previousHeight = ref(0);
  const initialPadding = ref(0);
  const initialGap = ref(0);
  const initialSpecificationGap = ref(0);

  const fullTitle = ref("");
  const padding = ref(0);
  const gap = ref(0);
  const specificationGap = ref(0);

  const user = computed(() => useLoginStore().user);
  const allowEdit = computed(
    () => user.value.isTypeAdmin() || user.value.isTypeStaff(),
  );

  const brandId = computed(() => props.product?.brandId ?? "");
  const specificationKeys = computed(() => {
    return Object.keys(Type.Key).map((key) => Type.Key[key]);
  });
  const specifications = computed(() => {
    if (!props.product) return [];
    if (!Array.isArray(props.product.specifications)) return [];

    return props.product.specifications
      .filter((spec) => spec && spec.type && spec.content)
      .sort((spec1, spec2) => {
        const key1 = obtainKeyOfSpecificationType(spec1.type);
        const key2 = obtainKeyOfSpecificationType(spec2.type);

        let index1 = specificationKeys.value.indexOf(key1);
        let index2 = specificationKeys.value.indexOf(key2);

        index1 = index1 >= 0 ? index1 : specificationKeys.value.length;
        index2 = index2 >= 0 ? index2 : specificationKeys.value.length;

        return index1 !== index2 ? index1 - index2 : key1.localeCompare(key2);
      });
  });

  const productPrice = computed(() => {
    if (!allowEdit.value) return null;
    if (!props.product) return null;
    return props.product.price;
  });
  const productPriceNormal = computed(() => {
    if (!productPrice.value) return new ProductPrice();
    if (!productPrice.value.normal) return new ProductPrice();
    return productPrice.value.normal;
  });
  const productPricePromotion = computed(() => {
    if (!productPrice.value) return new ProductPrice();
    if (!productPrice.value.promotion) return new ProductPrice();
    return productPrice.value.promotion;
  });
  const price = computed(() => {
    if (!allowEdit.value) return null;

    let normal = productPriceNormal.value;
    let promotion = productPricePromotion.value;

    if (normal.value > 0 && promotion.value <= 0) return { to: normal };
    if (normal.value > 0 && promotion.value > 0)
      return { from: normal, to: promotion };
    if (normal.value <= 0 && promotion.value > 0)
      return { from: normal, to: promotion };
    return null;
  });

  watch(() => props.product, invalidate);
  watch(() => brandId.value, invalidate);

  async function invalidate() {
    previousHeight.value = 0;
    fullTitle.value = "";
    padding.value = initialPadding.value;
    gap.value = initialGap.value;
    specificationGap.value = initialSpecificationGap.value;

    if (!props.product) return;

    fullTitle.value = await props.product.fetchFullTitle();
    invalidateHeight();
  }
  function invalidateHeight() {
    const parentHeight = selfRef.value?.offsetHeight ?? 0;
    const height = bodyRef.value?.offsetHeight ?? 0;

    if (height > parentHeight && previousHeight.value !== height) {
      previousHeight.value = height;
      padding.value = padding.value - initialPadding.value / 10;
      gap.value = gap.value - initialGap.value / 10;
      specificationGap.value =
        specificationGap.value - initialSpecificationGap.value / 10;
      setTimeout(() => invalidateHeight(), 100);
    }
  }

  function obtainKeyOfSpecificationType(type?: string | Type) {
    if (typeof type === "object") return type.key;
    if (typeof type === "string") return type;
    return "";
  }

  onMounted(() => {
    invalidate();
  });
</script>

<template>
  <div
    class="ExportLayoutOne"
    :style="{ '--width': `${width}px`, '--height': `${height}px` }"
    ref="selfRef"
  >
    <div
      class="ExportLayoutOne-body"
      ref="bodyRef"
      :style="{
        padding: `${padding}px ${initialPadding}px`,
        gap: `${gap}px`,
      }"
    >
      <span class="ExportLayoutOne-title">{{ fullTitle }}</span>

      <div
        class="ExportLayoutOne-items"
        :style="{ gap: `${specificationGap}px` }"
      >
        <Item
          v-for="specification in specifications"
          :key="specification.typeKey"
          :item="specification"
        />
      </div>

      <span class="ExportLayoutOne-price" v-if="price && price.to">
        {{ price.to }}</span
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .ExportLayoutOne {
    width: var(--width);
    height: var(--height);
    min-width: var(--width);
    min-height: var(--height);
    max-width: var(--width);
    max-height: var(--height);

    overflow: hidden;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .ExportLayoutOne-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .ExportLayoutOne-title {
        font-size: 30px;
        font-weight: 600;

        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .ExportLayoutOne-items {
        gap: 14px;

        display: flex;
        flex-direction: column;
        align-items: stretch;
      }
      .ExportLayoutOne-price {
        font-size: 30px;
        font-weight: 600;

        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
