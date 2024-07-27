<script setup lang="ts">
import MenuOption from '@/components/button/MenuOption.vue';
import ImageView from '@/components/image-viewer/ImageView.vue';
import { ServiceEvent } from '@/data/ServiceEvent';
import { ServiceImage } from '@/data/ServiceImage';
import { computed } from 'vue';

const emits = defineEmits<{
  click: [void];
  clickRemove: [typeof props.src];
}>();
const props = defineProps<{
  event: ServiceEvent;
  src: ServiceImage;
}>();

const menus = computed(() => {
  return [
    {
      key: 'delete',
      title: 'Delete Image',
      interact: () => emits('clickRemove', props.src),
    },
  ];
});
</script>

<template>
  <div class="ServiceEvent-Image">
    <button class="ServiceEvent-Image-img-button" @click="emits('click')">
      <ImageView class="ServiceEvent-Image-img" :src="src" />
    </button>

    <div class="ServiceEvent-Image-foreground transition"></div>
    <div class="ServiceEvent-Image-option">
      <MenuOption :menus="menus" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ServiceEvent-Image {
  width: max-content;
  min-width: 6rem;
  height: var(--image-height);
  position: relative;
  display: flex;
  flex-direction: row;
  border-radius: 0.3em;
  object-fit: cover;

  &:hover {
    .ServiceEvent-Image-foreground {
      opacity: 1;
    }
  }

  .ServiceEvent-Image-img-button {
    width: inherit;
    height: inherit;
    min-width: inherit;
    z-index: 1;
    display: flex;
    flex-direction: row;
    border: none;
    border-radius: inherit;
    background: none;
    cursor: pointer;
    object-fit: inherit;
    &:focus {
      .ServiceEvent-Image-img {
        transform: scale(0.96);
      }
    }

    .ServiceEvent-Image-img {
      width: inherit;
      height: inherit;
      min-width: inherit;
      object-fit: cover;
      display: flex;
      flex-direction: row;
      border-radius: inherit;
      border: 1px solid hsl(0, 0%, 80%);
      object-fit: inherit;
    }
  }
  .ServiceEvent-Image-foreground {
    z-index: 2;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    min-width: 100%;
    min-height: 100%;
    max-width: 100%;
    max-height: 100%;
    border-radius: inherit;
    pointer-events: none;
    background: hsla(0, 0%, 100%, 0.7);
    opacity: 0;
  }
  .ServiceEvent-Image-option {
    z-index: 3;
    position: absolute;
    top: 0.2rem;
    right: 0.2rem;
  }
}
</style>
