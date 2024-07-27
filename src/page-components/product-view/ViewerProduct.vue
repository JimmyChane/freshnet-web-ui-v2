<script setup lang="ts">
import SectionSpecification from './ViewerProduct-Section-Specification.vue';
import SectionInclude from './ViewerProduct-Section-Include.vue';
import SectionDescription from './ViewerProduct-Section-Description.vue';
import SectionPrice from './ViewerProduct-Section-Price.vue';
import SectionStock from './ViewerProduct-Section-Stock.vue';
import SectionCategory from './ViewerProduct-Section-Category.vue';
import SectionPlaylist from './ViewerProduct-Section-Playlist.vue';
import Tabs from './ViewerProduct-Tabs.vue';
import Title from './ViewerProduct-Title.vue';
import ProductViewerImagePreview from './ViewerProduct-ImagePreview.vue';
import ProductViewerImages from './ViewerProduct-Images.vue';
import BottomActionbar from './ViewerProduct-BottomActionbar.vue';
import { TypeKey } from '@/data/Specification';
import { SettingKey } from '@/data/Setting';
import Actionbar from '@/components/actionbar/Actionbar.vue';
import chroma from 'chroma-js';
import { Product } from '@/data/Product';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useSettingStore } from '@/data-stores/setting.store';
import { useProductStore } from '@/data-stores/product.store';
import { isObjectOnly, optString, trimText } from '@/utils/U';
import { useImageViewerStore } from '@/stores/image-viewer.store';
import type { Menu } from '@/stores/popup-menu/PopupMenu';
import type { Tab } from './ViewerProduct-Tabs-Tab.vue';

const emits = defineEmits<{
  'click-product-imageRemove': [{ product: Product | undefined; image: any }];
  'click-product-titleBrandUpdate': [void];
  'click-product-priceUpdate': [void];
  'click-product-descriptionUpdate': [void];
  'click-product-categoryUpdate': [void];
  'click-product-specificationsUpdate': [void];
}>();
const props = withDefaults(
  defineProps<{
    isWide?: boolean;
    isEditable?: boolean;
    isActionbarHidden?: boolean;
    openedWindowCount?: number;

    leftMenus?: Menu[];
    rightMenus?: Menu[];

    product?: Product;
    productPrevious?: Product;
    productNext?: Product;
  }>(),
  {
    isWide: false,
    isEditable: false,
    isActionbarHidden: false,
    openedWindowCount: 0,

    leftMenus: () => [],
    rightMenus: () => [],
  },
);

const colorTransitionDuration = ref('0');
const primaryColorHex = ref('inherit');
const imagePreviewIndex = ref(0);
let onKeyUp: undefined | ((event: KeyboardEvent) => void);
const category = ref();
const fullTitle = ref('');
const brand = ref();
const tabKeyNow = ref('');
const height = ref(0);
const scrollTop = ref(0);
const settingShowPrice = ref(false);

const selfRef = ref();
const keyplaylist = ref();

const tabs = computed<Tab[]>(() => {
  if (!props.product) return [];

  const tabs: Tab[] = [];

  if (!props.isWide && imagePreview.value) {
    tabs.push({ key: 'image', title: 'Image' });
  }

  tabs.push({ key: 'title', title: 'Title' });

  if (props.isEditable) {
    if (specifications.value.length) {
      tabs.push({ key: 'specification', title: 'Specification' });
    }
    if (whatIncludeds.value.length) {
      tabs.push({ key: 'include', title: "What's Included" });
    }
    if (description.value) {
      tabs.push({ key: 'description', title: 'Description' });
    }
    if (settingShowPrice.value) {
      tabs.push({ key: 'price', title: 'Price' });
    }

    tabs.push({ key: 'stock', title: 'Stock' });
    tabs.push({ key: 'category', title: 'Category' });
  }

  tabs.forEach((tab) => {
    tab.isSelected = () => tab.key === tabKeyNow.value;
  });

  return tabs;
});

const imagePreview = computed(() => {
  if (imagePreviewIndex.value >= images.value.length) {
    imagePreviewIndex.value = 0;
  }
  return images.value.length ? images.value[imagePreviewIndex.value] : undefined;
});
const images = computed(() => props.product?.images ?? []);
const hasImagePrevious = computed(() => images.value.length > 0 && imagePreviewIndex.value > 0);
const hasImageNext = computed(() => images.value.length - 1 > imagePreviewIndex.value);

const price = computed(() => {
  if (!props.isEditable && !settingShowPrice.value) return;
  return props.product?.price ?? null;
});

const description = computed(() => props.product?.description ?? '');

const specificationKeys = computed(() => {
  return Object.keys(TypeKey).map((key) => TypeKey[key]);
});
const specifications = computed(() => {
  if (!props.product) return [];
  if (!Array.isArray(props.product.specifications)) return [];

  return props.product.specifications
    .filter((spec) => spec && spec.type && spec.content)
    .sort((spec1, spec2) => {
      const key1 = obtainKeyOfSpecificationType(spec1?.type?.key ?? '');
      const key2 = obtainKeyOfSpecificationType(spec2?.type?.key ?? '');

      let index1 = specificationKeys.value.indexOf(key1);
      let index2 = specificationKeys.value.indexOf(key2);

      index1 = index1 >= 0 ? index1 : specificationKeys.value.length;
      index2 = index2 >= 0 ? index2 : specificationKeys.value.length;

      return index1 !== index2 ? index1 - index2 : key1.localeCompare(key2);
    });
});

const gifts = computed(() => props.product?.gifts ?? []);
const bundles = computed(() => props.product?.bundles ?? []);
const whatIncludeds = computed(() => {
  return [
    ...gifts.value.map((gift) => trimText(gift)).filter((gift) => gift.length),
    ...bundles.value
      .filter((bundle) => isObjectOnly(bundle))
      .map((bundle) => trimText(bundle.title))
      .filter((bundle) => bundle.length),
  ];
});

const primaryColor = computed(() =>
  chroma.valid(primaryColorHex.value) ? chroma(primaryColorHex.value) : chroma('bbbbbb'),
);
const actionbarColor = computed(() => primaryColor.value.mix('ffffff', 0.6));
const backgroundColor = computed(() => primaryColor.value.mix('ffffff', 0.6));

const isImageViewerShowing = computed(() => {
  return useImageViewerStore().viewer.isShowing;
});

watch(() => useSettingStore().lastModified, invalidateSettings);
watch(
  () => props.isWide,
  () => {
    setTimeout(() => invalidateBound(), 500);
  },
);
watch(
  () => props.product,
  (product, wasProduct) => {
    invalidateBound();
    invalidateProduct();

    colorTransitionDuration.value = '3s';
    if (!wasProduct && product) {
      colorTransitionDuration.value = '0';
      setTimeout(() => (colorTransitionDuration.value = '3s'), 700);
    }
  },
);
watch(() => imagePreview.value, invalidateImagePreview);

async function invalidateSettings() {
  settingShowPrice.value = await useSettingStore().findValueOfKey({
    key: SettingKey.PublicShowPrice,
    default: false,
  });
}

function invalidateBound() {
  scrollTop.value = selfRef.value.scrollTop;
  height.value = selfRef.value.offsetHeight;
}
async function invalidateProduct() {
  if (props.product) {
    scrollToTop(0);
  }
  tabKeyNow.value = tabs.value.length ? tabs.value[0].key : '';

  if (props.product) {
    addArrowListener();
  } else {
    removeArrowListener();
  }

  category.value = undefined;
  fullTitle.value = '';
  brand.value = null;
  if (!props.product) return;

  category.value = await props.product.fetchCategory();
  fullTitle.value = await props.product.fetchFullTitle();
  brand.value = await props.product.fetchBrand();
}
async function invalidateImagePreview() {}

function clickPreviousImage() {
  if (hasImagePrevious.value) {
    imagePreviewIndex.value--;
    return;
  }

  if (hasImagePrevious.value || !props.productPrevious) {
    return;
  }
  const ref = keyplaylist.value;
  if (!ref) return;

  imagePreviewIndex.value = props.productPrevious.images.length - 1;
  ref.clickPreviousProduct();
}
function clickNextImage() {
  if (hasImageNext.value) {
    imagePreviewIndex.value++;
    return;
  }

  if (hasImageNext.value || !props.productNext) {
    return;
  }
  const ref = keyplaylist.value;
  if (!ref) return;

  imagePreviewIndex.value = 0;
  ref.clickNextProduct();
}

function obtainKeyOfSpecificationType(type: string | { key: string }) {
  if (typeof type === 'object' && type) {
    return obtainKeyOfSpecificationType(type.key);
  }
  return optString(type);
}

function addArrowListener() {
  if (onKeyUp === undefined) {
    onKeyUp = (event: KeyboardEvent) => {
      const isExclude =
        event.shiftKey ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        props.openedWindowCount > 0 ||
        isImageViewerShowing.value;

      if (isExclude) return;
      if (event.key === 'ArrowLeft') clickPreviousImage();
      if (event.key === 'ArrowRight') clickNextImage();
    };
    window.addEventListener('keyup', onKeyUp);
  }
}
function removeArrowListener() {
  if (onKeyUp !== undefined) {
    window.removeEventListener('keyup', onKeyUp);
    onKeyUp = undefined;
  }
}

function scrollToTop(timeout = 300) {
  if (timeout > 0) {
    setTimeout(() => scrollToTop(0), timeout);
    return;
  }
  selfRef.value.scrollTo({ top: 0, behavior: 'smooth' });
}
function scrollTo(key = '') {
  const ref = this.$refs[`key${key}`];
  if (!ref) {
    return;
  }
  ref.$el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function scrolling(event: UIEvent) {
  invalidateBound();

  const pointHeight = 156; // 156px

  tabKeyNow.value = tabs.value.reduce((tabKeyNow, tab) => {
    const ref = this.$refs[`key${tab.key}`];
    if (!ref) {
      return tabKeyNow;
    }
    const target = ref.$el;
    if (!target) {
      return tabKeyNow;
    }

    const bound = target.getBoundingClientRect();

    const start = bound.y;
    if (0 < start && start < pointHeight) {
      return tab.key;
    }

    const end = bound.y + bound.height;
    if (0 < end && end < pointHeight) {
      return tab.key;
    }

    return tabKeyNow;
  }, tabKeyNow.value);
}

onMounted(() => {
  invalidateBound();
  invalidateProduct();
  invalidateImagePreview();
  invalidateSettings();
});
onUnmounted(() => {
  removeArrowListener();
});
</script>

<template>
  <div
    class="ViewerProduct"
    ref="selfRef"
    :style="{
      '--primary-color': primaryColor.toString(),
      'background-color': backgroundColor.toString(),
      '--color-transition-duration': colorTransitionDuration,
      '--actionbar-toolbar': isActionbarHidden ? '1.5rem' : '5.5rem',
    }"
    :isWide="`${isWide}`"
    @scroll="(e) => scrolling(e)"
  >
    <div class="ViewerProduct-toolbar" :style="{ 'background-color': actionbarColor.toString() }">
      <Actionbar
        class="ViewerProduct-actionbar"
        v-if="!isActionbarHidden"
        :leftMenus="leftMenus"
        :rightMenus="rightMenus"
        :style="{ 'background-color': actionbarColor }"
      >
        <span
          class="ViewerProduct-actionbar-title"
          v-if="fullTitle"
          :style="{
            padding: !leftMenus.length && !rightMenus.length ? '1.8rem' : '0',
          }"
        >
          {{ fullTitle }}
        </span>
      </Actionbar>

      <Tabs v-if="tabs.length" @click-item="(tab) => scrollTo(tab.key)" :items="tabs" />
    </div>

    <div class="ViewerProduct-header">
      <div class="ViewerProduct-preview" v-if="product">
        <ProductViewerImagePreview
          class="ViewerProduct-image"
          ref="keyimage"
          :primaryColor="backgroundColor"
          :allowEdit="isEditable"
          :product="product"
          :image="imagePreview"
          :hasImagePrevious="hasImagePrevious"
          :hasImageNext="hasImageNext"
          :hasProductPrevious="!!productPrevious"
          :hasProductNext="!!productNext"
          @click-image="(image) => useImageViewerStore().show({ image, thumbnails: images })"
          @click-previous="() => clickPreviousImage()"
          @click-next="() => clickNextImage()"
          @click-remove="(image) => emits('click-product-imageRemove', { product, image })"
        />
        <ProductViewerImages
          class="ViewerProduct-thumbnails"
          v-if="isEditable || images.length > 1"
          :images="images"
          :indexAt="imagePreviewIndex"
          :isEditable="isEditable"
          :primaryColor="primaryColor"
          @click-image="(image) => (imagePreviewIndex = images.indexOf(image))"
          @click-add-image-file="
            (files) => {
              if (product) useProductStore().addImageOfId({ id: product.id, files });
            }
          "
        />
        <Title
          ref="keytitle"
          :primaryColor="primaryColor"
          :allowEdit="isEditable"
          :product="product"
          @click-edit="(x) => emits('click-product-titleBrandUpdate', x)"
        />
      </div>
    </div>

    <div class="ViewerProduct-info">
      <SectionSpecification
        ref="keyspecification"
        :primaryColor="primaryColor"
        :allowEdit="isEditable"
        :product="product"
        @click-edit="(x) => emits('click-product-specificationsUpdate', x)"
      />
      <SectionInclude
        ref="keyinclude"
        :primaryColor="primaryColor"
        :allowEdit="isEditable"
        :product="product"
      />
      <SectionDescription
        ref="keydescription"
        :primaryColor="primaryColor"
        :allowEdit="isEditable"
        :product="product"
        @click-edit="(x) => emits('click-product-descriptionUpdate', x)"
      />
      <SectionPrice
        ref="keyprice"
        :primaryColor="primaryColor"
        :allowEdit="isEditable"
        :product="product"
        @click-edit="(x) => emits('click-product-priceUpdate', x)"
      />
      <SectionStock
        ref="keystock"
        :primaryColor="primaryColor"
        :allowEdit="isEditable"
        :product="product"
      />
      <SectionCategory
        ref="keycategory"
        :primaryColor="primaryColor"
        :allowEdit="isEditable"
        :product="product"
        @click-edit="(x) => emits('click-product-categoryUpdate', x)"
      />
      <SectionPlaylist
        ref="keyplaylist"
        :primaryColor="primaryColor"
        :allowEdit="isEditable"
        :product="product"
        :nextProduct="productNext"
        :previousProduct="productPrevious"
      />
    </div>

    <div class="ViewerProduct-emtpy" v-if="!product">
      <div class="ViewerProduct-emtpy-cardBackground"></div>
      <span class="ViewerProduct-emtpy-title">Viewer</span>
    </div>

    <BottomActionbar
      class="ViewerProduct-bottomActionbar"
      v-if="product"
      :product="product"
      :isWide="isWide"
      :parentScrollTop="scrollTop"
      @click-scrollToTop="() => scrollToTop(0)"
    />
  </div>
</template>

<style lang="scss" scoped>
.ViewerProduct {
  position: relative;

  width: 100%;
  height: 100%;

  display: grid;
  justify-items: center;
  align-items: start;

  background: hsl(0, 0%, 90%);
  font-size: 1.2rem;
  overflow-y: auto;
  scroll-padding-top: 8rem;
  transition: background-color var(--color-transition-duration);

  .ViewerProduct-toolbar {
    grid-area: toolbar;
    z-index: 4;
    width: 100%;
    position: sticky;
    border-bottom: 1px solid hsla(0, 0%, 0%, 0.1);
    top: 0;
    transition: background-color var(--color-transition-duration);
    .ViewerProduct-actionbar {
      border-bottom: 1px solid hsla(0, 0%, 0%, 0.1);
      transition: background-color var(--color-transition-duration);
      .ViewerProduct-actionbar-title {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: 0.1rem;
        line-height: 1.1rem;

        font-weight: 600;
        font-size: 1rem;

        overflow: hidden;
        color: black;
        text-align: start;
        text-overflow: clip;

        white-space: nowrap;

        width: 100%;
      }
    }
  }
  .ViewerProduct-header {
    --padding: 1.2rem;
    --padding: 0;

    width: 100%;
    z-index: 1;
    grid-area: header;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--padding);
    gap: 1rem;

    .ViewerProduct-preview {
      width: 100%;
      height: 100%;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      transition: background-color var(--color-transition-duration);
    }
  }

  .ViewerProduct-info {
    --padding: 1.2rem;

    grid-area: info;

    width: 100%;
    z-index: 2;
    gap: 1.5rem;
    gap: 1rem;
    color: black;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: var(--padding);
    padding-bottom: 10rem;
  }
  .ViewerProduct-emtpy {
    z-index: 2;
    width: 100%;
    height: 100%;
    position: relative;

    background: hsl(0, 0%, 90%);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .ViewerProduct-emtpy-cardBackground {
      z-index: 1;
      position: absolute;
      width: 100%;
      height: 100%;

      opacity: 0.15;
      background: var(--primary-color);

      pointer-events: none;
      display: flex;
    }
    .ViewerProduct-emtpy-title {
      color: black;
      opacity: 0.4;
    }
  }

  .ViewerProduct-bottomActionbar {
    z-index: 3;
    grid-area: bottomactionbar;
  }
}

.ViewerProduct[isWide='false'] {
  grid-template-rows: 8rem max-content minmax(1fr, max-content);
  grid-template-columns: 100%;
  grid-template-areas:
    'toolbar'
    'header'
    'info'
    'bottomactionbar';

  .ViewerProduct-header {
    max-width: 50rem;
    margin-bottom: -0.6rem;
  }
  .ViewerProduct-info {
    max-width: 50rem;
    margin-top: -0.6rem;
  }
}
.ViewerProduct[isWide='true'] {
  grid-template-rows: var(--actionbar-toolbar) 1fr;
  grid-template-columns: 45% 55%;
  grid-template-areas:
    'toolbar toolbar'
    'header info'
    'bottomactionbar bottomactionbar';
  .ViewerProduct-header {
    height: calc(100dvh - var(--actionbar-toolbar) - 3.5rem);
    position: sticky;
    left: 0;
    top: var(--actionbar-toolbar);
  }
  .ViewerProduct-header {
    --padding: 2rem;
    padding-right: calc(var(--padding) / 2);
  }
  .ViewerProduct-info {
    --padding: 2rem;
    padding-left: calc(var(--padding) / 2);
  }
}
</style>
