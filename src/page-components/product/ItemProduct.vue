<script setup lang="ts">
import { Mode } from './ItemProduct';
import { SettingKey } from '@/data/Setting';
import { ProductPrice } from '@/data/ProductPrice';
import ImageView from '@/components/image-viewer/ImageView.vue';
import Label from './ItemProduct-Label.vue';
import chroma from 'chroma-js';
import { Product } from '@/data/Product';
import { computed, onMounted, ref, watch } from 'vue';
import { useLoginStore } from '@/stores/login.store';
import { useSettingStore } from '@/data-stores/setting.store';
import { isColorDark } from '@/utils/U';
import { generateSpecificationLabels, generateStockLabels } from '@/data/ProductPreset';

const emits = defineEmits<{ click: [Product] }>();

const primaryColorHex = ref('');
const fullTitle = ref('');

const props = withDefaults(
  defineProps<{
    mode?: Mode;
    item?: Product;
    isSelected?: boolean;
  }>(),
  {
    mode: Mode.Grid,
    isSelected: false,
  },
);

const isList = computed(() => props.mode === Mode.List);
const isGrid = computed(() => props.mode === Mode.Grid);

const primaryColor = computed(() => {
  return chroma.valid(primaryColorHex.value) ? chroma(primaryColorHex.value) : chroma('cccccc');
});

const isPrimaryColorDark = computed(() => isColorDark(primaryColor.value));

const user = computed(() => useLoginStore().user);
const allowEdit = computed(() => user.value.isTypeAdmin() || user.value.isTypeStaff());

const shouldShowPrice = computed(() => {
  let setting = useSettingStore().items.find((setting) => {
    return setting.key === SettingKey.PublicShowPrice;
  });
  return setting?.value ?? false;
});

const preview = computed(() => props.item?.toImageThumbnail());
const productBrandId = computed(() => props.item?.brandId ?? '');
const isAvailable = computed(() => props.item?.isStockAvailable() ?? false);

const productPrice = computed(() => {
  if (!allowEdit.value && !shouldShowPrice.value) return null;
  return props.item?.price;
});
const productPriceNormal = computed(() => {
  return productPrice.value?.normal ?? new ProductPrice();
});
const productPricePromotion = computed(() => {
  return productPrice.value?.promotion ?? new ProductPrice();
});
const price = computed(() => {
  if (!allowEdit.value && !shouldShowPrice.value) return null;

  const normal = productPriceNormal.value;
  const promotion = productPricePromotion.value;

  if (normal.value > 0 && promotion.value <= 0) return { to: normal };
  if (normal.value > 0 && promotion.value > 0) return { from: normal, to: promotion };
  if (normal.value <= 0 && promotion.value > 0) return { from: normal, to: promotion };
  return null;
});

const specLabels = computed(() => {
  return generateSpecificationLabels(props.item);
});
const labels = computed(() => {
  return generateStockLabels(props.item).map((label) => {
    return { title: label.text, primaryColor: chroma(label.color) };
  });
});

watch(() => preview.value, invalidatePreview);
watch(() => props.item, invalidateFullTitle);
watch(() => productBrandId.value, invalidateFullTitle);

async function invalidateFullTitle() {
  try {
    fullTitle.value = '';
    if (!props.item) return;
    fullTitle.value = await props.item.fetchFullTitle();
  } catch (error) {
    console.error(error);
    fullTitle.value = '';
  }

  fullTitle.value = '';
  if (props.item) {
    fullTitle.value = (await props.item.fetchFullTitle()?.catch(() => null)) ?? '';
  }
}
async function invalidatePreview() {
  primaryColorHex.value = 'inherit';
}

onMounted(() => {
  useSettingStore().getItems();
  invalidateFullTitle();
  invalidatePreview();
});
</script>

<template>
  <div
    :class="[
      'ItemProduct',
      isList ? 'ItemProduct-modeList' : '',
      isGrid ? 'ItemProduct-modeGrid' : '',
      'transition',
    ]"
    :style="{
      '--available-opacity': isAvailable ? '1' : '0.1',
      '--primary-color': primaryColor.toString(),
    }"
    :ref="item?.id"
    :isSelected="`${isSelected}`"
    @click="
      () => {
        if (item) {
          emits('click', item);
        }
      }
    "
  >
    <div class="ItemProduct-preview transition">
      <ImageView class="ItemProduct-preview-image" v-if="preview" :src="preview" />
      <span :class="['ItemProduct-preview-empty', 'transition']" v-else>No Preview</span>

      <div class="ItemProduct-preview-labels" v-if="labels.length">
        <Label
          v-for="label of labels"
          :key="label.title"
          :title="label.title"
          :primaryColor="label.primaryColor"
        />
      </div>
    </div>

    <div
      :class="[
        'ItemProduct-title',
        !isPrimaryColorDark ? 'ItemProduct-title-isDark' : 'ItemProduct-title-isWhite',
      ]"
    >
      <span class="ItemProduct-title-text">{{ fullTitle }}</span>
      <span class="ItemProduct-title-price" v-if="price">{{ price.to }}</span>
      <div class="ItemProduct-title-bodySpecs">
        <div class="ItemProduct-title-specs" v-if="specLabels.length">
          <Label v-for="label in specLabels" :key="label.name" :title="label.name" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ItemProduct {
  --available-opacity: 1;

  width: 100%;
  text-decoration: none;
  border: none;

  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  border-radius: var(--border-radius);
  --transition-timing: cubic-bezier(1, 0, 0, 1);

  .ItemProduct-preview {
    flex-grow: 0;
    object-fit: cover;
    aspect-ratio: 16/12;

    --preview-border-radius: var(--border-radius);
    --preview-border-radius-focus: var(--border-radius);
    --transition-timing: cubic-bezier(1, 0, 0, 1);

    position: relative;

    .ItemProduct-preview-image {
      object-fit: contain;
    }
    .ItemProduct-preview-empty {
      font-size: 0.8rem;
      font-weight: 600;
      color: hsla(0, 0%, 0%, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ItemProduct-preview-image {
      width: 100%;
      height: 100%;
      aspect-ratio: inherit;
      border-radius: var(--preview-border-radius);
      background: white;
    }
    .ItemProduct-preview-empty {
      width: 100%;
      height: 100%;
      aspect-ratio: inherit;
      border-radius: var(--preview-border-radius);
      background: white;
    }

    .ItemProduct-preview-labels {
      position: absolute;
      bottom: 0;
      right: 0;

      width: 100%;
      max-height: 2.3rem;
      gap: 3px;
      padding: 0.5rem;

      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;

      overflow: hidden;
    }
  }

  .ItemProduct-title {
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: stretch;
    text-align: start;

    gap: 0.5rem;
    color: black;

    .ItemProduct-title-text {
      min-height: 1em;
      max-height: 2em;

      font-size: 1rem;
      font-weight: 600;
      overflow: hidden;

      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .ItemProduct-title-price {
      font-size: 0.7rem;
    }
    .ItemProduct-title-bodySpecs {
      flex-grow: 1;
      display: flex;
      justify-content: flex-start;
      align-items: flex-end;

      .ItemProduct-title-specs {
        width: 100%;
        gap: 2px;

        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-end;

        overflow: hidden;
      }
    }
  }
  .ItemProduct-title-isDark {
    --color-theme: black;
  }
  .ItemProduct-title-isWhite {
    --color-theme: white;
  }
}

.ItemProduct-modeList {
  --border-radius: 0.8rem;
  --height: 6rem;

  min-height: var(--height);
  max-height: var(--height);

  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  .ItemProduct-preview {
    height: var(--height);
    min-height: var(--height);
    max-height: var(--height);
    transform: scale(0.92);
    --preview-border-radius-focus: var(--border-radius) 0 0 var(--border-radius);
  }
  .ItemProduct-title {
    height: 100%;
    flex-grow: 1;
    padding: 0.3rem 0.3rem;
    .ItemProduct-title-specs {
      max-height: 1.2em;
    }
  }
}
.ItemProduct-modeGrid {
  --border-radius: 0.8rem;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 0.25rem;

  .ItemProduct-preview {
    width: 100%;
    transform: scale(0.92) translateY(1rem);
    --preview-border-radius-focus: var(--border-radius) var(--border-radius) 0 0;
  }
  .ItemProduct-title {
    width: 100%;
    padding: 1rem 0.5rem;
    .ItemProduct-title-specs {
      max-height: 2.4em;
      margin-top: -0.4em;
    }
  }
}

.ItemProduct[isSelected='false'] {
  cursor: pointer;

  &:hover,
  &:focus,
  &:focus-within {
    background: hsla(0, 0%, 0%, 0.1);
  }
}
.ItemProduct[isSelected='true'] {
  background: hsla(0, 0%, 0%, 0.2);
}
</style>
