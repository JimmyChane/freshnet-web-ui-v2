<script setup lang="ts">
import { Image, type ImageUrlOption } from '@/data/Image';
import { ServiceImage } from '@/data/ServiceImage';
import { computed, onMounted, ref, watch } from 'vue';

class Container {
  readonly image: string | Image | ServiceImage;

  constructor(image: string | Image | ServiceImage) {
    this.image = image;
  }

  isString() {
    return typeof this.image === 'string';
  }
  isImage() {
    return this.image instanceof Image;
  }
  isServiceImage() {
    return this.image instanceof ServiceImage;
  }

  getKey(): string {
    if (typeof this.image === 'string') return this.image;
    return this.image.toUrl();
  }

  async toValue(option: ImageUrlOption): Promise<string> {
    if (typeof this.image === 'string') return this.image;
    if (this.image instanceof Image) return this.image.toUrl(option);
    if (this.image instanceof ServiceImage) return await this.image.toBlob(option);

    return '';
  }
}

const emits = defineEmits<{
  load: [Event];
  error: [Event];
  abort: [Event];
  click: [Event];
}>();
const props = withDefaults(
  defineProps<{
    src?: string | Image | ServiceImage;
    alt?: string;
    resize?: boolean;
    loading?: 'lazy' | 'eager';
  }>(),
  { src: '', alt: '', resize: true, loading: 'lazy' },
);

const approximateSize = ref(100);
const state = ref('');
const requestValue = ref('');

const style = computed(() => {
  return { opacity: state.value === 'loaded' ? '1' : '0.2' };
});
const isValueEmpty = computed(() => requestValue.value === '');

const selfRef = ref();

watch(() => props.src, invalidateSrc);

async function invalidateSrc() {
  state.value = '';

  const previousValue = requestValue.value;

  const option = await getDimension();
  const container = new Container(props.src);
  const value = await container.toValue(option);

  if (previousValue !== requestValue.value) return;

  requestValue.value = value;
  if (selfRef.value instanceof HTMLImageElement && selfRef.value.complete) state.value = 'loaded';
}

function onLoad(event: Event) {
  state.value = 'loaded';
  emits('load', event);
}
function onError(event: Event) {
  state.value = 'error';
  emits('error', event);
}
function onAbort(event: Event) {
  state.value = 'aborted';
  emits('abort', event);
}
function onClick(event: Event) {
  emits('click', event);
}

async function getDimension(): Promise<{ width?: number; height?: number }> {
  if (!props.resize) return { width: 0, height: 0 };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (selfRef.value instanceof HTMLImageElement) {
        resolve(parseDimension(0, 0));
        return;
      }

      const width = Math.max(selfRef.value.offsetWidth, 0);
      const height = Math.max(selfRef.value.offsetHeight, 0);
      resolve(parseDimension(width, height));
    }, 100);
  });
}
function parseDimension(width: number, height: number): { width?: number; height?: number } {
  if (width > height) return { width: getApproximateSize(width) };
  if (width < height) return { height: getApproximateSize(height) };

  return {
    width: getApproximateSize(width),
    height: getApproximateSize(height),
  };
}

function getApproximateSize(size: number) {
  const divide = size / approximateSize.value;
  return approximateSize.value * Math.max(Math.round(divide), 1);
}

onMounted(() => invalidateSrc());
</script>

<template>
  <span v-if="state === 'error'" class="ImageView-error" ref="selfRef">Error</span>
  <div class="ImageView-empty" v-else-if="isValueEmpty" ref="selfRef"></div>
  <img
    v-else
    ref="selfRef"
    class="ImageView-img"
    :style="style"
    :src="requestValue"
    :alt="alt"
    :loading="loading"
    @load="(event) => onLoad(event)"
    @error="(event) => onError(event)"
    @abort="(event) => onAbort(event)"
    @click="(event) => onClick(event)"
  />
</template>

<style lang="scss" scoped>
.ImageView-error {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  font-size: 0.8em;
  background: hsla(0, 0%, 0%, 0.1);
  color: hsla(0, 0%, 0%, 0.6);
}
.ImageView-empty {
  background: hsla(0, 0%, 0%, 0.1);
}
.ImageView-img {
  display: flex;
  transition: all var(--transition-duration);
}
</style>
