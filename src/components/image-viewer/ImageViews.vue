<script setup lang="ts">
import { Image } from '@/data/Image';
import { ServiceImage } from '@/data/ServiceImage';
import ImageView from './ImageView.vue';
import { computed } from 'vue';

type MyImage = string | Image | ServiceImage;

const props = withDefaults(
  defineProps<{
    width?: number;
    height?: number;
    images: MyImage | MyImage[];
  }>(),
  { width: 0, height: 0, images: () => [] },
);

const parsedImages = computed(() => {
  return (Array.isArray(props.images) ? props.images : [props.images])
    .filter((image) => {
      return image instanceof Image || image instanceof ServiceImage;
    })
    .reduce((images: MyImage[], image, index, sources) => {
      if (index < 4) images.push(image);
      return images;
    }, []);
});
const parsedImage = computed(() =>
  parsedImages.value.length === 1 ? parsedImages.value[0] : undefined,
);

const cssWidth = computed(() => `${props.width}px`);
const cssHeight = computed(() => `${props.height}px`);
const cssBorderRadius = computed(() => '4px');
const cssGridTemplateAreas = computed(() => {
  if (parsedImages.value.length === 2) return '"img0 img1"';
  if (parsedImages.value.length === 3) return '"img0 img1" "img2 img2"';
  return '"img0 img1" "img2 img3"';
});
</script>

<template>
  <ImageView
    v-if="parsedImages.length === 1"
    class="ImageViews-item"
    :style="{
      width: cssWidth,
      height: cssHeight,
      'border-radius': cssBorderRadius,
    }"
    :src="parsedImage"
  />
  <div
    v-else
    class="ImageViews"
    :style="{
      width: cssWidth,
      height: cssHeight,
      'border-radius': cssBorderRadius,
      'grid-template-areas': cssGridTemplateAreas,
    }"
  >
    <ImageView
      class="ImageViews-item"
      :style="{
        width: '100%',
        height: '100%',
        'grid-area': `img${index}`,
      }"
      v-for="(image, index) in parsedImages"
      :key="typeof image === 'string' ? image : image.toUrl()"
      :src="image"
    />
  </div>
</template>

<style lang="scss" scoped>
.ImageViews {
  display: grid;
  gap: 1px;
  overflow: hidden;
}
.ImageViews-item {
  object-fit: cover;
  overflow: hidden;
  object-fit: cover;
}
</style>
