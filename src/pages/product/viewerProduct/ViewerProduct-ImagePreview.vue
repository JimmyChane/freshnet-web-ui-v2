<script setup lang="ts">
  import MenuOption from "@/components/button/MenuOption.vue";
  import ImageView from "@/components/ImageView.vue";
  import Arrow from "./ViewerProduct-ImagePreview-Arrow.vue";
  import Product from "@/data/product/Product";
  import { computed, onMounted, ref, watch } from "vue";
  import { useWindowStore } from "@/stores/window.store";
  import Image from "@/data/Image";
  import { Color } from "chroma-js";
  import { Direction } from "./Arrow";

  const emits = defineEmits<{
    clickImage: [Image];
    clickRemove: [Image];
    clickPrevious: [void];
    clickNext: [void];
  }>();
  const props = withDefaults(
    defineProps<{
      primaryColor?: Color;
      allowEdit?: boolean;
      product?: Product;

      image?: Image;

      hasImagePrevious?: boolean;
      hasImageNext?: boolean;

      hasProductPrevious?: boolean;
      hasProductNext?: boolean;
    }>(),
    {
      allowEdit: false,
      hasImagePrevious: false,
      hasImageNext: false,
      hasProductPrevious: false,
      hasProductNext: false,
    },
  );

  const imageUrl = ref("");
  const imageIsFetching = ref(false);
  const imageTransitionEnabled = ref(false);

  const isThin = computed(() => useWindowStore().innerWidth < 550);
  const imageIsShowing = computed(() => {
    return imageIsFetching.value ? !!imageUrl.value : true;
  });

  watch(
    () => props.product,
    (product, wasProduct) => {
      imageTransitionEnabled.value = true;
      if (!wasProduct && product) {
        imageTransitionEnabled.value = false;
        setTimeout(() => (imageTransitionEnabled.value = true), 700);
      }
    },
  );
  watch(() => props.image, invalidate);

  function invalidate() {
    imageUrl.value = "";
    if (props.image) {
      imageUrl.value = props.image.toUrl({
        height: isThin.value ? 350 : 1200,
      });
    }
  }

  onMounted(() => invalidate());
</script>

<template>
  <div
    :class="[
      'LayoutProductViewerImagePreview',
      `LayoutProductViewerImagePreview-${
        imageIsShowing ? 'isShown' : 'isHidden'
      }`,
    ]"
  >
    <ImageView
      :class="[
        'LayoutProductViewerImagePreview-preview',
        image
          ? 'LayoutProductViewerImagePreview-preview-isShown'
          : 'LayoutProductViewerImagePreview-preview-isHidden',
      ]"
      :style="{
        transiton: imageTransitionEnabled ? '' : 'none',
        'z-index': '2',
      }"
      :src="image"
      @click="
        () => {
          if (image) emits('clickImage', image);
        }
      "
    />

    <Arrow
      style="z-index: 2"
      :primaryColor="primaryColor"
      :direction="Direction.Left"
      :isShowing="hasImagePrevious || hasProductPrevious"
      @click="() => emits('clickPrevious')"
    />
    <Arrow
      style="z-index: 2"
      :primaryColor="primaryColor"
      :direction="Direction.Right"
      :isShowing="hasImageNext || hasProductNext"
      @click="() => emits('clickNext')"
    />

    <MenuOption
      class="LayoutProductViewerImagePreview-menu"
      style="z-index: 3"
      v-if="allowEdit && image"
      :primaryColor="primaryColor"
      :menus="[
        {
          title: 'Delete Image',
          click: () => {
            if (image) emits('clickRemove', image);
          },
        },
      ]"
    />
  </div>
</template>

<style lang="scss" scoped>
  .LayoutProductViewerImagePreview {
    width: 100%;
    max-height: 55vh;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .LayoutProductViewerImagePreview-menu {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
    }

    .LayoutProductViewerImagePreview-preview {
      object-fit: contain;

      width: 100%;
      height: inherit;
      max-height: 55vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      aspect-ratio: 16/10;
    }
  }
  .LayoutProductViewerImagePreview-isHidden {
    height: 12rem;
    .LayoutProductViewerImagePreview-preview {
      pointer-events: none;
      height: inherit;
    }
  }

  .LayoutProductViewerImagePreview-preview-isHidden {
    opacity: 0;
  }
</style>
