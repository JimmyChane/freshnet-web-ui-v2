import { optArray } from '@/utils/U';
import { Image } from '@/data/Image';
import { ServiceImage } from '@/data/ServiceImage';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface ImageViewerContext {
  isShowing: boolean;
  image: any;
  thumbnails: any[];
}
export const useImageViewerStore = defineStore('imageViewer', () => {
  const viewer = ref<ImageViewerContext>({
    isShowing: false,
    image: null,
    thumbnails: [],
  });
  function show(option: { image: Image | ServiceImage; thumbnails?: (Image | ServiceImage)[] }) {
    viewer.value.image = option.image;
    viewer.value.thumbnails = optArray(option.thumbnails);
    viewer.value.isShowing = true;
  }
  function close() {
    viewer.value.isShowing = false;
    setTimeout(() => {
      viewer.value.thumbnails = [];
      viewer.value.image = null;
    }, 300);
  }
  function select(image = null) {
    viewer.value.image = image;
  }

  return {
    viewer,
    show,
    close,
    select,
  };
});
