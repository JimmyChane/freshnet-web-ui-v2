<script setup lang="ts">
import ImageView from '@/components/image-viewer/ImageView.vue';
import type { Image } from '@/data/Image';
import type { ServiceImage } from '@/data/ServiceImage';

withDefaults(
  defineProps<{
    image?: string | Image | ServiceImage;
    isSelected?: boolean;
  }>(),
  {
    isSelected: false,
  },
);
</script>

<template>
  <div
    :class="[
      'LayoutProductViewerImage',
      `LayoutProductViewerImage-${isSelected ? 'isSelected' : 'isDeselected'}`,
      'transition',
    ]"
  >
    <button
      :class="['LayoutProductViewerImage-item', 'transition']"
      @click="() => $emit('click', image)"
    >
      <ImageView class="LayoutProductViewerImage-item-img" :src="image" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.LayoutProductViewerImage {
  --box-padding: 0.18rem;

  --width: calc(var(--image-width) + var(--box-padding) + var(--box-padding));
  --height: calc(var(--image-height) + var(--box-padding) + var(--box-padding));

  width: var(--width);
  height: var(--height);
  min-width: var(--width);
  min-height: var(--height);

  overflow: hidden;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  --transition-timing: cubic-bezier(1, 0, 0, 1);

  .LayoutProductViewerImage-item {
    width: var(--image-width);
    height: var(--image-height);
    min-width: var(--image-width);
    min-height: var(--image-height);

    border: none;
    border-radius: 0.4rem;

    display: flex;
    justify-content: center;
    align-items: center;
    --transition-timing: cubic-bezier(1, 0, 0, 1);

    .LayoutProductViewerImage-item-img {
      height: var(--image-height);
      width: var(--image-width);
      border-radius: 0.4rem;
      object-fit: contain;
      --transition-timing: cubic-bezier(1, 0, 0, 1);
    }
  }
}

.LayoutProductViewerImage-isDeselected {
  --image-width: 4.5rem;
  --image-height: 3rem;
  @media (max-width: 480px) {
    --image-width: 3.8rem;
    --image-height: 2.2rem;
  }

  .LayoutProductViewerImage-item {
    background: hsla(0, 0%, 100%, 0.4);
    cursor: pointer;
    &:hover {
      background: hsla(0, 0%, 100%, 0.8);
    }
  }
}
.LayoutProductViewerImage-isSelected {
  --image-width: 7rem;
  --image-height: 3rem;

  @media (max-width: 480px) {
    --image-width: 3.8rem;
    --image-height: 2.2rem;
  }

  .LayoutProductViewerImage-item {
    background: hsla(0, 0%, 100%, 0.8);

    & > * {
      opacity: 0;
    }
  }
}
</style>
