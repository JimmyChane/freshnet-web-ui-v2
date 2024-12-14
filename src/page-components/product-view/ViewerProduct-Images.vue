<script setup lang="ts">
import { computed } from 'vue';
import ProductViewerImage from './ViewerProduct-Images-Image.vue';
import ProductViewerImageSelector from './ViewerProduct-Images-Selector.vue';
import chroma, { type Color } from 'chroma-js';
import { Image } from '@/data/Image';
import { ServiceImage } from '@/data/ServiceImage';

type ImageType = string | Image | ServiceImage;

const emits = defineEmits<{
  clickImage: [ImageType];
  clickAddImageFile: [FileList];
}>();

const props = withDefaults(
  defineProps<{
    indexAt?: number;
    images: ImageType[];
    isEditable?: boolean;
    primaryColor?: string | Color;
  }>(),
  { indexAt: -1, images: () => [], isEditable: false },
);

const isPrimaryColorDark = computed(() => {
  if (props.primaryColor === undefined) return false;

  return chroma.deltaE(props.primaryColor.toString(), '000000') < 60;
});

function getKey(image: ImageType) {
  if (typeof image === 'string') return image;
  if (image instanceof Image || image instanceof ServiceImage) {
    return image.toUrl();
  }

  return '';
}
</script>

<template>
  <div
    :class="[
      'ProductViewerImages scrollbar',
      isPrimaryColorDark ? 'ProductViewerImages-isDark' : 'ProductViewerImages-isLight',
    ]"
  >
    <div class="ProductViewerImages-list">
      <ProductViewerImage
        v-for="(image, index) in images"
        :image="image"
        :key="getKey(image)"
        :isSelected="index === indexAt"
        @click="() => emits('clickImage', image)"
      />
      <ProductViewerImageSelector
        v-if="isEditable"
        @click-file="
          (files) => {
            if (files) emits('clickAddImageFile', files);
          }
        "
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ProductViewerImages {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;

  overflow-x: auto;
  overflow-y: hidden;

  padding: 0 1.75rem;

  --scrollbar-size: 0.3rem;
  --scrollbar-thumb-radius: 0.2rem;
  --scrollbar-track-margin: 1.9rem;

  .ProductViewerImages-list {
    --height: 4rem;
    width: 100%;
    min-width: max-content;
    height: var(--height);
    min-height: var(--height);

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}
.ProductViewerImages-isLight {
  --scrollbar-thumb-color: hsla(0, 0%, 0%, 0.4);
  --scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.6);
}
.ProductViewerImages-isDark {
  --scrollbar-thumb-color: hsla(0, 0%, 100%, 0.4);
  --scrollbar-thumb-color-hover: hsla(0, 0%, 100%, 0.6);
}
</style>
