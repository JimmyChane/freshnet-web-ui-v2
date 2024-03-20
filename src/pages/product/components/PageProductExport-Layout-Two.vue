<script setup lang="ts">
  import { Type } from "@/data/specification/Specification";
  import ItemSpecification from "./PageProductExport-Layout-Two-Specification.vue";
  import { ProductPrice } from "@/data/product/ProductPrice";
  import { Product } from "@/data/product/Product";
  import { computed, onMounted, ref, watch } from "vue";
  import { useLoginStore } from "@/stores/login.store";
  import { isObjectOnly, optString } from "@/U";

  const props = withDefaults(
    defineProps<{ width: number; height: number; product: Product }>(),
    { width: 0, height: 0 },
  );

  const selfRef = ref<HTMLDivElement>();
  const bodyRef = ref<HTMLDivElement>();

  const previousHeight = ref(0);
  const initialPadding = ref(60);
  const initialGap = ref(30);
  const initialSpecificationPadding = ref(14);
  const fullTitle = ref("");
  const paddingVertical = ref(40);
  const paddingHorizontal = ref(0);
  const gap = ref(0);
  const specificationPadding = ref(0);

  const user = computed(() => useLoginStore().user);
  const allowEdit = computed(
    () => user.value.isTypeAdmin() || user.value.isTypeStaff(),
  );

  const brandId = computed(() => props.product.brandId ?? "");
  const specificationKeys = computed(() => {
    return Object.keys(Type.Key).map((key) => {
      return Type.Key[key];
    });
  });

  const specifications = computed(() => {
    if (!props.product) return [];
    if (!Array.isArray(props.product.specifications)) return [];

    return props.product.specifications
      .filter((spec) => spec && spec.type && spec.content)
      .filter((spec) => {
        return [
          "processor",
          "ram",
          "storage",
          "display",
          "graphic",
          "os",
        ].includes(spec.typeKey);
      })
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
    return productPrice.value?.normal ?? new ProductPrice();
  });
  const productPricePromotion = computed(() => {
    return productPrice.value?.promotion ?? new ProductPrice();
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

  const gifts = computed(() => {
    const gifts = props.product?.gifts ?? [];
    return gifts
      .map((gift) => optString(gift).trim())
      .filter((gift) => gift.length);
  });
  const bundles = computed(() => {
    const bundles = props.product?.bundles ?? [];
    return bundles
      .filter((bundle) => isObjectOnly(bundle))
      .map((bundle) => optString(bundle.title).trim())
      .filter((bundle) => bundle.length);
  });

  watch(() => props.product, invalidate);
  watch(() => brandId.value, invalidate);

  async function invalidate() {
    previousHeight.value = 0;
    fullTitle.value = "";
    paddingHorizontal.value = initialPadding.value;
    gap.value = initialGap.value;
    specificationPadding.value = initialSpecificationPadding.value;

    if (!props.product) return;

    fullTitle.value = await props.product.fetchFullTitle();
    invalidateHeight();
  }
  function invalidateHeight() {
    if (!selfRef.value || !bodyRef.value) return;

    const parentHeight = selfRef.value.offsetHeight;
    const height = bodyRef.value.offsetHeight;

    if (height > parentHeight && previousHeight.value !== height) {
      previousHeight.value = height;
      paddingHorizontal.value =
        paddingHorizontal.value - initialPadding.value / 10;
      gap.value = gap.value - initialGap.value / 10;
      specificationPadding.value =
        specificationPadding.value - initialSpecificationPadding.value / 10;
      setTimeout(() => invalidateHeight(), 100);
    }
  }

  function obtainKeyOfSpecificationType(type?: string | Type) {
    if (type instanceof Type) return type.key;
    if (typeof type === "string") return type;
    return "";
  }

  onMounted(() => invalidate());
</script>

<template>
  <div
    ref="selfRef"
    class="ExportLayoutTwo"
    :style="{ '--width': `${width}px`, '--height': `${height}px` }"
  >
    <div
      class="ExportLayoutTwo-body"
      ref="bodyRef"
      :style="{
        padding: `${paddingHorizontal}px ${paddingVertical}px`,
        gap: `${gap}px`,
      }"
    >
      <div
        class="ExportLayoutTwo-header"
        :style="{
          padding: `0 ${specificationPadding}px`,
        }"
      >
        <div class="ExportLayoutTwo-header-left">
          <span class="ExportLayoutTwo-title">{{ fullTitle }}</span>
          <div class="ExportLayoutTwo-gifts">
            <span v-for="gift of gifts" :key="gift">{{ gift }}</span>
          </div>
        </div>

        <div class="ExportLayoutTwo-header-right">
          <span class="ExportLayoutTwo-price" v-if="price && price.to">{{
            price.to
          }}</span>
          <div class="ExportLayoutTwo-includes">
            <span v-for="bundle of bundles" :key="bundle">{{ bundle }}</span>
          </div>
        </div>
      </div>

      <div class="ExportLayoutTwo-items">
        <ItemSpecification
          v-for="(specification, index) in specifications"
          :key="specification.typeKey"
          :item="specification"
          :padding="specificationPadding"
          :isLastItem="index === specifications.length - 1"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .ExportLayoutTwo {
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

    .ExportLayoutTwo-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .ExportLayoutTwo-header {
        width: 100%;
        gap: 50px;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;

        --font-size-text-title: 30px;
        --font-size-text-hint: 12px;

        & > * {
          width: 100%;
          max-width: max-content;
        }

        .ExportLayoutTwo-header-left {
          flex-grow: 1;

          text-align: start;

          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;

          .ExportLayoutTwo-title {
            font-size: var(--font-size-text-title);
            font-weight: 600;
          }
          .ExportLayoutTwo-gifts {
            font-size: var(--font-size-text-hint);
            column-gap: 16px;
            row-gap: 4px;

            flex-wrap: wrap;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
          }
        }
        .ExportLayoutTwo-header-right {
          flex-grow: 1;

          text-align: end;

          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: flex-start;

          .ExportLayoutTwo-price {
            font-size: var(--font-size-text-title);
          }
          .ExportLayoutTwo-includes {
            font-size: var(--font-size-text-hint);
            column-gap: 16px;
            row-gap: 4px;

            flex-wrap: wrap;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
          }
        }
      }
      .ExportLayoutTwo-items {
        width: 100%;
        flex-grow: 1;

        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;
      }
    }
  }
</style>
