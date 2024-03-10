<script setup lang="ts">
  import ProductPrice from "@/data/product/ProductPrice";
  import SettingModule from "@/data/setting/Setting";

  import Section from "./ViewerProduct-Section.vue";
  import Product from "@/data/product/Product";
  import { Color } from "chroma-js";
  import { computed, onMounted, ref, watch } from "vue";
  import { useSettingStore } from "@/data-stores/setting.store";

  const props = defineProps<{ product?: Product; primaryColor?: Color }>();

  const settingShowPrice = ref(false);

  const priceNormal = computed(() => {
    if (!props.product) return;
    const normal = props.product.getPriceNormal();
    if (normal && normal.value >= 0) return normal;
    new ProductPrice().fromData();
  });
  const pricePromotion = computed(() => {
    if (!props.product) return;
    const promotion = props.product.getPricePromotion();
    if (promotion && promotion.value >= 0) return promotion;
    new ProductPrice().fromData();
  });

  const title = computed(() => {
    if (!settingShowPrice.value) return "";

    const normal = priceNormal.value;
    const promotion = pricePromotion.value;

    if (!normal || !promotion) return "";

    if (normal.value > promotion.value) {
      return promotion.toString();
    }
    return normal.toString();
  });
  const subtitle = computed(() => {
    if (!settingShowPrice.value) return "";

    const normal = priceNormal.value;
    const promotion = pricePromotion.value;

    if (!normal || !promotion) return "";

    if (normal.value > 0 && normal.value > promotion.value) {
      return normal.toString();
    }

    return "";
  });

  const isPromotion = computed(
    () => props.product?.isPricePromotion() ?? false,
  );
  const isAvailable = computed(
    () => props.product?.isStockAvailable() ?? false,
  );
  const isSecondHand = computed(
    () => props.product?.isStockSecondHand() ?? false,
  );

  watch(() => useSettingStore().lastModified, invalidate);

  async function invalidate() {
    settingShowPrice.value = await useSettingStore().findValueOfKey({
      key: SettingModule.Key.PublicShowPrice,
      default: false,
    });
  }

  onMounted(() => invalidate());
</script>

<template>
  <div class="ProductViewerPriceViewer-parent">
    <Section
      class="ProductViewerPriceViewer"
      :title="title"
      :primaryColor="primaryColor"
      v-if="
        product &&
        (title || subtitle || !isAvailable || isPromotion || isSecondHand)
      "
    >
      <span class="ProductViewerPriceViewer-subtitle" v-if="subtitle">
        {{ subtitle }}
      </span>

      <div class="ProductViewerPriceViewer-tag">
        <span
          class="ProductViewerPriceViewer-tag-outOfStock"
          v-if="!isAvailable"
          >Out of Stock</span
        >
        <span class="ProductViewerPriceViewer-tag-promotion" v-if="isPromotion"
          >Promotion</span
        >
        <span
          class="ProductViewerPriceViewer-tag-secondHand"
          v-if="isSecondHand"
          >Second Hand</span
        >
      </div>
    </Section>
  </div>
</template>

<style lang="scss" scoped>
  .ProductViewerPriceViewer-parent {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .ProductViewerPriceViewer {
      width: max-content;
      .ProductViewerPriceViewer-subtitle {
        text-decoration: line-through;
      }
      .ProductViewerPriceViewer-tag {
        flex-grow: 0;
        font-size: 1rem;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 3px;
        & > * {
          padding: 0.2em 0.6em;
          color: white;
        }
        .ProductViewerPriceViewer-tag-outOfStock {
          background: #ff4b33;
        }
        .ProductViewerPriceViewer-tag-promotion {
          background: #ff9900;
        }
        .ProductViewerPriceViewer-tag-secondHand {
          background: #249696;
        }
      }
    }
  }
</style>
