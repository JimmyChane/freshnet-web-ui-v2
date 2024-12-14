<script setup lang="ts">
import PanelProducts from '@/panel-components/product/PanelProducts.vue';
import PanelProduct from '@/panel-components/product/PanelProduct.vue';
import WindowSearch from '@/dialog-components/product/WindowSearch.vue';
import WindowAddProduct, {
  type DataProps as AddProductDataProps,
} from '@/dialog-components/product/WindowAddProduct.vue';
import WindowRemoveProduct, {
  type DataContent as RemoveProductDataContent,
  type DataProps as RemoveProductDataProps,
} from '@/dialog-components/product/WindowRemoveProduct.vue';
import WindowRemoveImage, {
  type DataContent as RemoveImageDataContent,
  type DataProps as RemoveImageDataProps,
} from '@/dialog-components/product/WindowRemoveImage.vue';
import WindowUpdateTitleBrand, {
  type DataContent as UpdateTitleBrandDataContent,
  type DataProps as UpdateTitleBrandDataProps,
} from '@/dialog-components/product/WindowUpdateTitleBrand.vue';
import WindowUpdatePrice, {
  type DataContent as UpdatePriceDataContent,
  type DataProps as UpdatePriceDataProps,
} from '@/dialog-components/product/WindowUpdatePrice.vue';
import WindowUpdateDescription, {
  type DataContent as UpdateDescriptionDataContent,
  type DataProps as UpdateDescriptionDataProps,
} from '@/dialog-components/product/WindowUpdateDescription.vue';
import WindowUpdateCategory, {
  type DataContent as UpdateCategoryDataContent,
  type DataProps as UpdateCategoryDataProps,
} from '@/dialog-components/product/WindowUpdateCategory.vue';
import WindowUpdateSpecifications, {
  type DataContent as UpdateSpecificationsDataContent,
  type DataProps as UpdateSpecificationsDataProps,
} from '@/dialog-components/product/WindowUpdateSpecifications.vue';
import PanelRight from '@/components/panel/PanelRight.vue';
import { useCategoryStore } from '@/data-stores/category.store';
import { useProductStore } from '@/data-stores/product.store';
import { useLoginStore } from '@/stores/login.store';
import { computed, onMounted, ref, watch } from 'vue';
import { Product } from '@/data/Product';
import { useRoute } from 'vue-router';
import { useRouteStore } from '@/stores/route.store';
import { usePopupWindowStore } from '@/stores/popup-window/popup-window.store';
import { useSnackbarStore } from '@/stores/snackbar/snackbar.store';
import { Layout, useNavigationStore } from '@/stores/navigation.store';
import { optArray } from '@/utils/U';

const stylePanelProducts = ref({});
const stylePanelEmpty = ref({});
const panelListened = ref({ isShowing: false, isWide: false });

const groups = ref<{ products: Product[] }[]>();

const product = ref();
const drawerProduct = ref();
const productBrand = ref();

const isEditable = computed(() => {
  const { user } = useLoginStore();
  return user.isTypeAdmin() || user.isTypeStaff();
});

const products = computed(() => {
  if (groups.value === undefined) return [];

  return groups.value
    .reduce((products: Product[], group) => {
      products.push(...group.products);
      return products;
    }, [])
    .filter((product) => {
      if (!isEditable.value) return product.isStockAvailable();
      return true;
    });
});
const productId = computed(() => useRoute().query.productId);

const productPrevious = computed(() => {
  const categoryProducts = products.value.filter((p) => {
    if (!product.value) {
      return true;
    }
    return p.category === product.value.category;
  });

  let productIndex = categoryProducts.indexOf(product.value);
  let productPreviousIndex = productIndex - 1;
  if (0 <= productPreviousIndex && productPreviousIndex <= categoryProducts.length - 1) {
    return categoryProducts[productPreviousIndex];
  }

  return undefined;
});
const productNext = computed(() => {
  const categoryProducts = products.value.filter((p) => {
    if (!product.value) return true;
    return p.category === product.value.category;
  });

  let productIndex = categoryProducts.indexOf(product.value);
  let productNextIndex = productIndex + 1;
  if (0 <= productNextIndex && productNextIndex <= categoryProducts.length - 1) {
    return categoryProducts[productNextIndex];
  }

  return undefined;
});

watch(() => product.value, onProduct);
watch(() => productId.value, onProductId);
watch(() => useProductStore().lastModified, invalidate);
watch(() => useCategoryStore().lastModified, invalidate);

async function invalidate() {
  groups.value = [];

  let xGroups = await useProductStore().getGroupsByCategory();

  const categories = await useCategoryStore().getItems();
  categories.forEach((category) => {
    const group = xGroups.find((group) => group.parent?.id === category.id);
    if (!group) {
      xGroups.push({ parent: category, items: [] });
    }
  });

  groups.value = xGroups
    .map((group) => {
      const products = !isEditable.value
        ? group.items.filter((product) => {
            return product.isStockAvailable();
          })
        : group.items;
      products.sort((product1, product2) => {
        return product1.compare(product2);
      });
      return { category: group.parent, products };
    })
    .filter((group) => {
      return group.products.length > 0;
    })
    .sort((group1, group2) => {
      if (group1.category && group2.category) return group1.category.compare(group2.category);
      return 0;
    });
}

function invalidateStyle() {
  if (panelListened.value.isWide || !panelListened.value.isShowing) {
    stylePanelProducts.value = {};
  } else {
    delayOnPanelListened((isSamePreviously) => {
      if (isSamePreviously) {
        stylePanelProducts.value = { display: 'none' };
      }
    });
  }

  if (!panelListened.value.isWide || !panelListened.value.isShowing) {
    stylePanelEmpty.value = {};
  } else {
    delayOnPanelListened((isSamePreviously) => {
      if (isSamePreviously) {
        stylePanelEmpty.value = { display: 'none' };
      }
    });
  }
}

function delayOnPanelListened(callback = (isSamePreviously: boolean) => {}, delay = 700) {
  const isPreviousWide = panelListened.value.isWide;
  const isPreviousShowing = panelListened.value.isShowing;

  setTimeout(() => {
    const isSamePreviously =
      panelListened.value.isWide === isPreviousWide &&
      panelListened.value.isShowing === isPreviousShowing;

    callback(isSamePreviously);
  }, delay);
}

function invalidatePanelShowing(isShowing: boolean) {
  panelListened.value.isShowing = isShowing;
  invalidateStyle();
}
function invalidatePanelWide(isWide: boolean) {
  panelListened.value.isWide = isWide;
  invalidateStyle();
}

async function onProduct() {
  productBrand.value = null;
  if (product.value) {
    productBrand.value = await product.value.fetchBrand();
  }

  if (!product.value) {
    setTimeout(() => (drawerProduct.value = product.value), 700);
  } else {
    drawerProduct.value = product.value;
  }
}
async function onProductId() {
  product.value = null;
  if (productId.value) {
    const products = await useProductStore().getItems();
    product.value = products.find((product) => {
      return product.id === productId.value;
    });
  }
}

function setProduct(product?: Product) {
  setProductId(product?.id ?? undefined);
}
function setProductId(productId?: string) {
  useRouteStore().nextQuery({ query: { productId: productId ?? null } });
}

async function clickSearch() {
  usePopupWindowStore().open({
    component: WindowSearch,
    data: products.value,
  });
}

async function clickAddProduct() {
  const popupWindow = usePopupWindowStore().open<AddProductDataProps>({
    component: WindowAddProduct,
    data: {
      onConfirm: (output) => {
        useProductStore()
          .addItem({ data: output })
          .then((product) => {
            if (product) {
              popupWindow.close();
              setProduct(product);
            }
          })
          .catch((error) => {
            useSnackbarStore().show('Product Creation Failed');
          });
      },
    },
  });
}

async function clickRemoveProduct(input: RemoveProductDataContent) {
  const popupWindow = usePopupWindowStore().open<RemoveProductDataProps>({
    component: WindowRemoveProduct,
    data: {
      input,
      onConfirm: (input) => {
        useProductStore()
          .removeItemOfId({ id: input.product.id })
          .then(() => {
            popupWindow.close();
            setProduct(undefined);
          })
          .catch((error) => {
            useSnackbarStore().show('Product Deletion Failed');
          });
      },
    },
  });
}
async function clickRemoveProductImage(input: RemoveImageDataContent) {
  const popupWindow = usePopupWindowStore().open<RemoveImageDataProps>({
    component: WindowRemoveImage,
    data: {
      input,
      onConfirm: (input) => {
        const { product, image } = input;
        useProductStore()
          .removeImageOfId({ id: product.id, image })
          .then(() => popupWindow.close())
          .catch(() => {});
      },
    },
  });
}

async function clickUpdateProductTitleBrand(input: UpdateTitleBrandDataContent) {
  const popupWindow = usePopupWindowStore().open<UpdateTitleBrandDataProps>({
    component: WindowUpdateTitleBrand,
    data: {
      input,
      onConfirm: (input) => {
        const { product, title, brandId } = input;

        const promiseTitle = useProductStore().updateTitleOfId({
          id: product.id,
          title,
        });
        const promiseBrand = useProductStore().updateBrandIdOfId({
          id: product.id,
          brandId,
        });
        Promise.all([promiseTitle, promiseBrand])
          .then(() => popupWindow.close())
          .catch((error) => {
            useSnackbarStore().show('Some Cannot Update');
          });
      },
    },
  });
}
async function clickUpdateProductPrice(input: UpdatePriceDataContent) {
  const popupWindow = usePopupWindowStore().open<UpdatePriceDataProps>({
    component: WindowUpdatePrice,
    data: {
      input,
      onConfirm: (input) => {
        useProductStore()
          .updatePriceOfId({ id: input.product?.id ?? '', price: input.price })
          .then((product) => popupWindow.close())
          .catch((error) => {
            useSnackbarStore().show('Cannot Update');
          });
      },
    },
  });
}
async function clickUpdateProductDescription(input: UpdateDescriptionDataContent) {
  const popupWindow = usePopupWindowStore().open<UpdateDescriptionDataProps>({
    component: WindowUpdateDescription,
    data: {
      input,
      onConfirm: (input) => {
        useProductStore()
          .updateDescriptionOfId({ id: input.product.id, description: input.description })
          .then((product) => popupWindow.close())
          .catch((error) => {
            useSnackbarStore().show('Cannot Update');
          });
      },
    },
  });
}
async function clickUpdateProductCategory(input: UpdateCategoryDataContent) {
  const popupWindow = usePopupWindowStore().open<UpdateCategoryDataProps>({
    component: WindowUpdateCategory,
    data: {
      input,
      onConfirm: (input) => {
        const { product, categoryId } = input;
        useProductStore()
          .updateCategoryIdOfId({ id: product.id, categoryId })
          .then((product) => popupWindow.close())
          .catch((error) => {
            useSnackbarStore().show('Cannot Update');
          });
      },
    },
  });
}
async function clickUpdateProductSpecifications(input: UpdateSpecificationsDataContent) {
  const popupWindow = usePopupWindowStore().open<UpdateSpecificationsDataProps>({
    component: WindowUpdateSpecifications,
    data: {
      input,
      onConfirm: (input) => {
        useProductStore()
          .updateSpecificationsOfId({
            id: input.product?.id ?? '',
            specifications: optArray(input.specifications).map((specification) => {
              return {
                type: specification.typeKey,
                content: specification.content,
              };
            }),
          })
          .then((product) => popupWindow.close())
          .catch((error) => {
            useSnackbarStore().show('Cannot Update');
          });
      },
    },
  });
}

onMounted(() => {
  invalidate();
  onProduct();
  onProductId();
  useNavigationStore().setLayout(Layout.THIN);
});
</script>

<template>
  <div class="PageProduct" :isPanelWide="`${panelListened.isWide}`">
    <PanelProducts
      class="PageProduct-products"
      :style="stylePanelProducts"
      :products="products"
      @click-productAdd="() => clickAddProduct()"
      @click-search="() => clickSearch()"
    />

    <PanelRight
      class="PageProduct-PanelRight"
      titleEmpty="Select product to view"
      :isShowing="!!product"
      @click-collapse="() => setProduct(undefined)"
      @on-showing="(isShowing) => invalidatePanelShowing(isShowing)"
      @on-wide="(isWide) => invalidatePanelWide(isWide)"
    >
      <PanelProduct
        class="PageProduct-PanelProduct"
        :product="drawerProduct"
        :productPrevious="productPrevious"
        :productNext="productNext"
        :isWide="false"
        :isEditable="isEditable"
        @click-dismiss="() => setProduct(undefined)"
        @click-productRemove="(output) => clickRemoveProduct(output)"
        @click-product-imageRemove="(output) => clickRemoveProductImage(output)"
        @click-product-titleBrandUpdate="(output) => clickUpdateProductTitleBrand(output)"
        @click-product-priceUpdate="(output) => clickUpdateProductPrice(output)"
        @click-product-descriptionUpdate="(output) => clickUpdateProductDescription(output)"
        @click-product-categoryUpdate="(output) => clickUpdateProductCategory(output)"
        @click-product-specificationsUpdate="(output) => clickUpdateProductSpecifications(output)"
      />
    </PanelRight>
  </div>
</template>

<style lang="scss" scoped>
.PageProduct {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  overflow: hidden;
  position: relative;

  .PageProduct-products {
    z-index: 1;
  }
  .PageProduct-PanelRight {
    z-index: 2;
  }
}
.PageProduct[isPanelWide='false'] {
  .PageProduct-products {
    max-width: 100%;
  }
}
.PageProduct[isPanelWide='true'] {
  .PageProduct-products {
    width: 100dvw;
    max-width: 60%;
    min-width: 60%;
  }
}
</style>
