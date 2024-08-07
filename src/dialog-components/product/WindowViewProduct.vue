<script setup lang="ts">
import ItemPrice from '../item/ItemPrice.vue';
import ItemProductSpecification from '../item/ItemProductSpecification.vue';
import ButtonImageAdd from './components/ButtonImageAdd.vue';
import ToggleButton from '@/components/button/ToggleButton.vue';
import MenuOption from '@/components/button/MenuOption.vue';
import ButtonIcon from '@/components/button/ButtonIcon.vue';
import IconEdit from '@/assets/icon/edit-505050.svg';
import { Product } from '@/data/Product';
import { onMounted, ref, watch } from 'vue';
import { useProductStore } from '@/data-stores/product.store';
import { Specification } from '@/data/Specification';
import ButtonImage from '@/pages/service/components/ButtonImage.vue';
import type { Category } from '@/data/Category';
import type { Brand } from '@/data/Brand';
import type { Image } from '@/data/Image';

const emits = defineEmits<{
  'request-viewImage': [Image];
  'request-removeImage': [{ product: Product; image: Image }];
  'request-editTitle': [string];
  'request-editBrand': [Brand];
  'request-editCategory': [Category];
  'request-editDescription': [string];
  'request-addSpecification': [Specification[]];
  'request-deleteSpecification': [void];
  'request-addBundle': [void];
  'request-deleteBundle': [void];
  'request-addGift': [void];
  'request-deleteGift': [void];
  'request-addPrice': [void];
  'request-deletePrice': [void];
}>();
const props = defineProps<{ product?: Product }>();

const item = ref<Product>();

const title = ref('');
const primaryProcessor = ref<Specification[]>();
const primaryRam = ref<Specification[]>();
const primaryDisk = ref<Specification[]>();

watch(
  () => props.product,
  (newItem) => onItemChange(newItem),
);

function onItemChange(newItem?: Product) {
  if (!newItem || Object.keys(newItem).length <= 0) {
    item.value = undefined;
    return;
  }

  item.value = newItem;

  if (item.value.title && item.value.brand) {
    title.value = `${item.value.brand.title} ${item.value.title}`;
  } else if (item.value.title) {
    title.value = item.value.title;
  } else if (item.value.brand) {
    title.value = item.value.brand.title;
  } else {
    title.value = '';
  }
  primaryProcessor.value = getSpecWith('processor');
  primaryRam.value = getSpecWith('ram');
  primaryDisk.value = getSpecWith('storage');
}
function getSpecWith(...names: string[]) {
  return item.value?.specifications.filter((spec) => {
    return spec.type && names.includes(spec.type.key ?? '');
  });
}
function getSpecWithout(...names: string[]): Specification[] {
  return (
    item.value?.specifications.filter((spec) => {
      return !spec.type || !names.includes(spec.type.key ?? '');
    }) ?? []
  );
}

onMounted(() => {
  onItemChange(props.product);
});
</script>

<template>
  <div class="WindowProduct">
    <div class="WindowProduct-main" v-if="item">
      <div class="WindowProduct-abstract-section WindowProduct-image">
        <div class="WindowProduct-abstract-section-header">
          <span class="WindowProduct-abstract-title">Image</span>
        </div>
        <div
          class="WindowProduct-image-main"
          :style="{
            '--image-size': item.images.length ? '160px' : '100px',
          }"
        >
          <ButtonImage
            class="WindowProduct-image-item-button"
            v-for="image in item.images"
            :key="image.toUrl()"
            :src="image.toUrl()"
            @callback-click="() => emits('request-viewImage', image)"
            @callback-delete="emits('request-removeImage', { product: item, image })"
          />

          <ButtonImageAdd
            class="WindowProduct-image-add"
            @callback-result="
              (files) => {
                useProductStore()
                  .addImageOfId({ id: item.id, files })
                  .then((product) => {
                    item.data.images = item.data.images;
                  });
              }
            "
          />
        </div>
      </div>

      <div class="WindowProduct-abstract-section-separator"></div>

      <div class="WindowProduct-abstract-section WindowProduct-title">
        <div class="WindowProduct-abstract-section-header">
          <span class="WindowProduct-abstract-title">Title</span>
          <ButtonIcon
            :src="IconEdit"
            @click="
              () => {
                if (item) emits('request-editTitle', item.title);
              }
            "
          />
        </div>
        <span class="WindowProduct-abstract-section-main" v-if="item.title">{{ item.title }}</span>
        <span class="WindowProduct-abstract-empty" v-else>Empty</span>
      </div>

      <div class="WindowProduct-abstract-section-separator"></div>

      <div class="WindowProduct-abstract-section WindowProduct-brand">
        <div class="WindowProduct-abstract-section-header">
          <span class="WindowProduct-abstract-title">Brand</span>
          <ButtonIcon
            :src="IconEdit"
            @click="
              () => {
                if (item?.brand) emits('request-editBrand', item.brand);
              }
            "
          />
        </div>

        <div class="WindowProduct-abstract-section-main WindowProduct-brand-main" v-if="item.brand">
          <img
            v-if="item.brand.icon"
            class="WindowProduct-brand-main-icon"
            :src="item.brand.icon.toUrl()"
          />
          <span class="WindowProduct-brand-main-title">{{ item.brand.title }}</span>
        </div>
        <span class="WindowProduct-abstract-empty" v-else>Empty</span>
      </div>

      <div class="WindowProduct-abstract-section-separator"></div>

      <div class="WindowProduct-abstract-section WindowProduct-category">
        <div class="WindowProduct-abstract-section-header">
          <span class="WindowProduct-abstract-title">Category</span>
          <ButtonIcon
            :src="IconEdit"
            @click="
              () => {
                if (item?.category) emits('request-editCategory', item.category);
              }
            "
          />
        </div>
        <div
          class="WindowProduct-abstract-section-main WindowProduct-category-main"
          v-if="item.category"
        >
          <img
            v-if="item.category.icon"
            class="WindowProduct-category-main-icon"
            :src="item.category.icon.toUrl()"
          />
          <span v-if="item.category.title" class="WindowProduct-category-main-title">
            {{ item.category.title }}
          </span>
        </div>
        <span class="WindowProduct-abstract-empty" v-else>Empty</span>
      </div>

      <div class="WindowProduct-abstract-section-separator"></div>

      <div class="WindowProduct-abstract-section WindowProduct-description">
        <div class="WindowProduct-abstract-section-header">
          <span class="WindowProduct-abstract-title">Description</span>
          <ButtonIcon
            :src="IconEdit"
            @click="
              () => {
                if (item) emits('request-editDescription', item.description);
              }
            "
          />
        </div>
        <span class="WindowProduct-abstract-section-main" v-if="item.description">
          {{ item.description }}
        </span>
        <span class="WindowProduct-abstract-empty" v-else>Empty</span>
      </div>

      <div class="WindowProduct-abstract-section-separator"></div>

      <div class="WindowProduct-abstract-section WindowProduct-specification">
        <div class="WindowProduct-abstract-section-header">
          <span class="WindowProduct-abstract-title">Specification</span>
          <ButtonIcon
            :src="IconEdit"
            @click="
              () => {
                if (item) emits('request-addSpecification', item.specifications);
              }
            "
          />
        </div>
        <div
          v-if="getSpecWithout().length"
          class="WindowProduct-abstract-section-main WindowProduct-specification-main"
        >
          <ItemProductSpecification
            v-for="spec in getSpecWithout()"
            :key="spec.typeKey"
            :item="spec"
          />
        </div>
        <span class="WindowProduct-abstract-empty" v-else>Empty</span>
      </div>

      <div class="WindowProduct-abstract-section-separator"></div>

      <div class="WindowProduct-abstract-section WindowProduct-isAvailable">
        <div class="WindowProduct-abstract-section-header">
          <span class="WindowProduct-abstract-title">Availability</span>
        </div>
        <ToggleButton
          :isToggled="item.stock?.isAvailable"
          @click-toggle="
            (toggle) => {
              useProductStore().updateAvailabilityOfId({
                id: item?.id ?? '',
                isAvailable: toggle,
              });
            }
          "
        />
      </div>
      <div class="WindowProduct-abstract-section WindowProduct-isSecondHand">
        <div class="WindowProduct-abstract-section-header">
          <span class="WindowProduct-abstract-title">SecondHand</span>
        </div>
        <ToggleButton
          :isToggled="item.stock?.isSecondHand"
          @click-toggle="
            (toggle) => {
              useProductStore().updateSecondHandOfId({
                id: item?.id ?? '',
                isSecondHand: toggle,
              });
            }
          "
        />
      </div>

      <div class="WindowProduct-abstract-section-separator"></div>

      <div class="WindowProduct-abstract-section WindowProduct-bundle">
        <div class="WindowProduct-abstract-section-header">
          <span class="WindowProduct-abstract-title">Bundle</span>
          <ButtonIcon :src="IconEdit" @click="() => emits('request-addBundle')" />
        </div>

        <div
          v-if="item.bundles && item.bundles.length"
          class="WindowProduct-abstract-section-main WindowProduct-bundle-main"
        >
          <div class="WindowProduct-bundle-item" v-for="bundle in item.bundles" :key="bundle.title">
            <div class="WindowProduct-bundle-item-icon">
              <div class="WindowProduct-bundle-item-icon-main"></div>
            </div>
            <span class="WindowProduct-bundle-item-title">
              {{ bundle.title }}
            </span>
            <MenuOption
              :menus="[
                {
                  key: 'delete',
                  title: 'Delete',
                  interact: () => {
                    useProductStore()
                      .removeBundleOfId({ id: item?.id ?? '', bundle })
                      .then((product) => {});
                  },
                },
              ]"
            />
          </div>
        </div>

        <span class="WindowProduct-abstract-empty" v-else>Empty</span>
      </div>

      <div class="WindowProduct-abstract-section-separator"></div>

      <div class="WindowProduct-abstract-section WindowProduct-gift">
        <div class="WindowProduct-abstract-section-header">
          <span class="WindowProduct-abstract-title">Gift</span>
          <ButtonIcon :src="IconEdit" @click="() => emits('request-addGift')" />
        </div>

        <div
          class="WindowProduct-abstract-section-main WindowProduct-gift-main"
          v-if="item.gifts && item.gifts.length"
        >
          <div class="WindowProduct-gift-item" v-for="gift in item.gifts" :key="gift">
            <div class="WindowProduct-gift-item-icon">
              <div class="WindowProduct-gift-item-icon-main"></div>
            </div>
            <span class="WindowProduct-gift-item-title">
              {{ gift }}
            </span>
            <MenuOption
              :menus="[
                {
                  key: 'delete',
                  title: 'Delete',
                  interact: () => {
                    useProductStore()
                      .removeGiftOfId({ id: item?.id ?? '', gift })
                      .then((product) => {});
                  },
                },
              ]"
            />
          </div>
        </div>

        <span class="WindowProduct-abstract-empty" v-else>Empty</span>
      </div>

      <div class="WindowProduct-abstract-section-separator"></div>

      <div class="WindowProduct-abstract-section WindowProduct-price">
        <div class="WindowProduct-abstract-section-header">
          <span class="WindowProduct-abstract-title">Price</span>
          <ButtonIcon :src="IconEdit" @click="() => emits('request-addPrice')" />
        </div>
        <div
          class="WindowProduct-abstract-section-main WindowProduct-price-main"
          v-if="item.stock && item.stock.prices && item.stock.prices.length"
        >
          <ItemPrice
            v-for="price in item.stock.prices"
            :key="JSON.stringify(price)"
            :price="price"
            @request-delete="
              () => {
                if (item) useProductStore().updatePriceOfId({ id: item.id, price: undefined });
              }
            "
          />
        </div>
        <span class="WindowProduct-abstract-empty" v-else>Empty</span>
      </div>

      <div class="WindowProduct-abstract-section-separator"></div>
    </div>

    <div class="WindowProduct-404" v-else>
      <span>Choose a Product</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.WindowProduct-abstract-section {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  row-gap: 0.2rem;
  row-gap: 1.6rem;
  .WindowProduct-abstract-section-header {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    gap: 1rem;
    .WindowProduct-abstract-title {
      flex-grow: 1;
      font-size: 1.05rem;
      font-weight: 600;
      color: hsl(0, 0%, 40%);
      color: black;
      text-align: start;
      letter-spacing: 0.1rem;
    }
  }
  .WindowProduct-abstract-section-main {
    width: 100%;
  }
  .WindowProduct-abstract-empty {
    font-size: 1rem;
    font-weight: 400;
    text-align: start;
    color: hsl(0, 0%, 60%);
  }
}
.WindowProduct-abstract-section-separator {
  min-height: 1px;
  min-width: 100%;
  background: hsl(0, 0%, 90%);
}

.WindowProduct {
  height: 100%;
  width: 100%;

  .WindowProduct-main {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    row-gap: 2rem;
    padding: 2rem;
    padding-bottom: 8rem;
  }
  .WindowProduct-404 {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.2rem;
    padding: 2.6rem;
    font-size: 1.2rem;
    span {
      text-align: center;
    }
  }
}

.WindowProduct-brand {
  &-main {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 0.5rem;
    &-icon {
      height: 1rem;
    }
    &-title {
      font-size: 1rem;
    }
  }
}
.WindowProduct-category {
  &-main {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 0.5rem;
    &-icon {
      width: 1rem;
      height: 1rem;
    }
    &-title {
      font-size: 1rem;
    }
  }
}
.WindowProduct-specification {
  &-main {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    row-gap: 0.5rem;
  }
}
.WindowProduct-isAvailable {
  flex-direction: row;
  column-gap: 1rem;
}
.WindowProduct-isSecondHand {
  flex-direction: row;
  column-gap: 1rem;
}
.WindowProduct-bundle {
  &-main {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-wrap: nowrap;
    row-gap: 0.2rem;
  }
  &-item {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    column-gap: 0.2rem;
    &-icon {
      --size: 1.7rem;
      min-width: var(--size);
      min-height: var(--size);
      max-width: var(--size);
      max-height: var(--size);
      padding: 0.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      &-main {
        --size: 0.4rem;
        min-width: var(--size);
        min-height: var(--size);
        max-width: var(--size);
        max-height: var(--size);
        border-radius: 50%;
        display: flex;
        background: hsl(0, 0%, 60%);
      }
    }
    &-title {
      flex-grow: 1;
    }
  }
}
.WindowProduct-gift {
  &-main {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-wrap: nowrap;
    row-gap: 0.2rem;
  }
  &-item {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 0.2rem;
    &-icon {
      --size: 1.7rem;
      min-width: var(--size);
      min-height: var(--size);
      max-width: var(--size);
      max-height: var(--size);
      padding: 0.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      &-main {
        --size: 0.4rem;
        min-width: var(--size);
        min-height: var(--size);
        max-width: var(--size);
        max-height: var(--size);
        border-radius: 50%;
        display: flex;
        background: hsl(0, 0%, 60%);
      }
    }
    &-title {
      flex-grow: 1;
    }
  }
}
.WindowProduct-price {
  &-main {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    row-gap: 0rem;
  }
}
.WindowProduct-image {
  .WindowProduct-image-main {
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow-x: auto;
    overflow-y: visible;
    column-gap: 0.5rem;
    padding: 4px 100px 4px var(--section-padding);

    --image-size: 160px;

    .WindowProduct-image-item-button {
      height: var(--image-size);
    }
    .WindowProduct-image-add {
      min-width: var(--image-size);
      min-height: var(--image-size);
      max-width: var(--image-size);
      max-height: var(--image-size);
    }
  }
}

@media (max-width: 400px) {
  .WindowProduct {
    .WindowProduct-main {
      padding: 0.8rem;
    }
  }
}
</style>
