<script setup lang="ts">
import Bottomsheet from '@/components/window/BottomsheetWindow.vue';
import Actionbar from '@/components/actionbar/Actionbar.vue';
import ImageView from '@/components/image-viewer/ImageView.vue';
import IconClose from '@/assets/icon/close-000000.svg';
import { type StyleValue, computed, onMounted, ref, watch } from 'vue';
import { useImageViewerStore } from '@/stores/image-viewer.store';

const imageViewerStore = useImageViewerStore();

const containerWidth = ref(0);
const containerHeight = ref(0);
const containerMiddleX = ref(0);
const containerMiddleY = ref(0);
const isZoomedIn = ref(false);
const isHovering = ref(false);
const minZoomScale = ref(1);
const maxZoomScale = ref(4);
const translateY = ref(0);
const translateX = ref(0);

const isShowing = computed(() => imageViewerStore.viewer.isShowing);
const image = computed(() => imageViewerStore.viewer.image);
const thumbnails = computed(() => imageViewerStore.viewer.thumbnails);

const style = computed(() => {
  const transforms = [
    isZoomedIn.value ? `scale(${maxZoomScale.value})` : `scale(${minZoomScale.value})`,
  ];
  if (isZoomedIn.value) {
    transforms.push(`translateX(${translateX.value}px)`);
    transforms.push(`translateY(${translateY.value}px)`);
  }

  const style: StyleValue = {};
  if (isHovering.value) style['transition'] = 'none';
  style['transform'] = transforms.reduce((str, transform, i, arr) => {
    if (i === 0) return transform;
    if (i < arr.length) return `${str} ${transform}`;
    return str;
  });
  style['cursor'] = isZoomedIn.value ? 'zoom-out' : 'zoom-in';
  if (isHovering.value) style['pointer-events'] = 'none';
  return style;
});

const Container = ref<HTMLDivElement>();

watch(
  () => isShowing.value,
  (value) => {
    if (value) isZoomedIn.value = false;
  },
);
watch(
  () => isHovering.value,
  (value) => {
    if (!value) isZoomedIn.value = false;
  },
);

function clickDismiss() {
  imageViewerStore.close();
}

function invalidateContainerSize() {
  if (!Container.value) {
    window.removeEventListener('resize', invalidateContainerSize);
    return;
  }

  containerWidth.value = Container.value.offsetWidth;
  containerHeight.value = Container.value.offsetHeight;

  containerMiddleX.value = containerWidth.value / 2;
  containerMiddleY.value = containerHeight.value / 2;
}
function onMouseMove(e: MouseEvent) {
  const { offsetX, offsetY } = e;

  if (isZoomedIn.value) isHovering.value = true;

  translateX.value = containerMiddleX.value - offsetX;
  translateY.value = containerMiddleY.value - offsetY;
}
function onMouseLeave() {
  isHovering.value = false;
}
function onClickImage() {
  isZoomedIn.value = !isZoomedIn.value;
}
function onClickContainer() {
  if (isHovering.value) isHovering.value = false;
}

onMounted(() => {
  invalidateContainerSize();
  window.addEventListener('resize', invalidateContainerSize);
});
</script>

<template>
  <div class="App-overflow">
    <div class="App-overflow-body">
      <Bottomsheet
        class="ViewerImage"
        :isShowing="isShowing"
        @click-dismiss="() => clickDismiss()"
        :style="{
          '--thumbnails-height': thumbnails.length > 1 ? '5rem' : '0',
        }"
      >
        <div class="ViewerImage-body">
          <Actionbar
            class="ViewerImage-actionbar"
            :leftMenus="{ icon: IconClose, click: () => clickDismiss() }"
          />

          <div
            class="ViewerImage-main"
            :style="{
              height: thumbnails.length > 1 ? 'calc(100% - var(--thumbnails-height))' : '100%',
            }"
            ref="Container"
            @mousemove="onMouseMove"
            @mouseleave="onMouseLeave"
            @click="() => onClickContainer()"
          >
            <ImageView
              class="ViewerImage-image"
              ref="image"
              v-if="image"
              :src="image"
              :resize="false"
              :style="style"
              @click="() => onClickImage()"
            />
          </div>

          <div class="ImageView-footer" v-if="thumbnails.length > 1">
            <div class="ImageView-images scrollbar">
              <button
                :class="[
                  thumbnail === image
                    ? 'ImageView-images-item-button-isSelected'
                    : 'ImageView-images-item-button-isDeselected',
                  'ImageView-images-item-button',
                  'transition',
                ]"
                v-for="thumbnail of thumbnails"
                :key="thumbnail.toUrl()"
                @click="() => imageViewerStore.select(thumbnail)"
              >
                <ImageView class="ImageView-images-item" :src="thumbnail" />
              </button>
            </div>
          </div>
        </div>
      </Bottomsheet>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.App-overflow {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100dvw;
  height: 100dvh;
  display: flex;
  overflow: hidden;

  .App-overflow-body {
    position: relative;
    width: 100dvw;
    height: 100dvh;
    display: flex;
    overflow: hidden;

    .ViewerImage {
      z-index: 3;
    }
  }

  .ViewerImage {
    --default-size-top: 0;
    --default-size-right: 0;
    --default-size-bottom: 0;
    --default-size-left: 0;

    --default-border-radius: 0;

    --actionbar-height: 5rem;
    --thumbnails-height: 5rem;
    --thumbnail-height: 4.2rem;

    .ViewerImage-body {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: hsla(0, 0%, 100%, 0.5);
      .ViewerImage-actionbar {
        z-index: 1;
        background: none;
        color: black;
        height: var(--actionbar-height);
      }
      .ViewerImage-main {
        z-index: 2;
        width: 100dvw;
        max-width: 100%;
        max-height: calc(100% - var(--thumbnail-height) - var(--actionbar-height));
        padding: 1rem;
        flex-grow: 1;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .ViewerImage-image {
          max-width: 100%;
          max-height: 100%;
          border-radius: 0.5rem;
          object-fit: contain;
          background: rgba(255, 255, 255, 0.9);
        }
      }
      .ImageView-footer {
        z-index: 1;
        height: var(--thumbnails-height);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        .ImageView-images {
          width: max-content;
          max-width: 100%;
          height: var(--thumbnails-height);
          padding: 0 1rem;
          overflow-y: auto;
          display: flex;
          flex-direction: row;
          align-items: center;
          align-items: flex-start;
          justify-content: flex-start;
          gap: 0.5rem;

          .ImageView-images-item-button {
            min-width: max-content;
            height: var(--thumbnail-height);
            background: none;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.2rem;
            overflow: hidden;
            padding: 0.2rem;
            .ImageView-images-item {
              height: 100%;
              width: 100%;
              object-fit: contain;
            }
          }
          .ImageView-images-item-button-isSelected {
            background: var(--accent-color);
          }
          .ImageView-images-item-button-isDeselected {
            cursor: pointer;
            &:hover {
              background: hsla(0, 0%, 0%, 0.1);
            }
          }
        }
      }
    }
  }
}
</style>
