<script setup lang="ts">
  import Product from "@/data/product/Product";
  import ImageView from "@/components/ImageView.vue";
  import { computed, onMounted, ref } from "vue";
  import Brand from "@/data/brand/Brand";
  import Image from "@/data/Image";
  import Specification from "@/data/specification/Specification";

  const props = defineProps<{ product: Product }>();

  const title = ref("");
  const specifications = ref<Specification[]>([]);
  const image = ref<Image>();
  const brand = ref<Brand>();

  const brandIcon = computed(() => brand.value?.icon);
  const threeSpecifications = computed(() => {
    return specifications.value.reduce((list: Specification[], spec, i) => {
      if (i < 3) list.push(spec);
      return list;
    }, []);
  });

  onMounted(async () => {
    title.value = await props.product.fetchFullTitle();
    specifications.value = props.product.specifications;
    image.value = props.product.toImageThumbnail();
    brand.value = await props.product.fetchBrand();
  });
</script>

<template>
  <div class="PCE-L-Product">
    <ImageView
      class="PCE-L-Product-brand"
      v-if="brandIcon"
      :src="brandIcon.toUrl()"
    />
    <span class="PCE-L-Product-title">{{ title }}</span>
    <span
      class="PCE-L-Product-specification"
      v-for="specification of threeSpecifications"
      :key="specification.typeKey"
    >
      {{ specification.content }}
    </span>
    <ImageView class="PCE-L-Product-image" v-if="image" :src="image" />
  </div>
</template>

<style lang="scss" scoped>
  .PCE-L-Product {
    border: 1px solid black;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    & > * {
      padding: 0.1rem;
    }

    .PCE-L-Product-brand {
      height: 1.6rem;
    }
    .PCE-L-Product-title {
      font-size: 1.4rem;
    }
    .PCE-L-Product-specification {
      height: 1.15em;
      line-height: 1em;
      overflow: hidden;
    }
    .PCE-L-Product-image {
      height: 4rem;
    }
  }
</style>
