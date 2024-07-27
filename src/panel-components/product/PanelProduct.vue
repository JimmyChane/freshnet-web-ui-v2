<script setup lang="ts">
import IconClose from '@/assets/icon/close-000000.svg';
import IconView from '@/assets/icon/view-000000.svg';
import IconCopyLight from '@/assets/icon/copy-FFFFFF.svg';
import IconCopyDark from '@/assets/icon/copy-000000.svg';
import IconPrinter from '@/assets/icon/printer-000000.svg';
import IconTrash from '@/assets/icon/trash-000000.svg';
import { Product } from '@/data/Product';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { copyText, getOrigin, openLink } from '@/utils/U';
import { useSnackbarStore } from '@/stores/snackbar/snackbar.store';
import { usePopupWindowStore } from '@/stores/popup-window/popup-window.store';
import type { Menu } from '@/stores/popup-menu/PopupMenu';
import ViewerProduct from '@/page-components/product-view/ViewerProduct.vue';

const router = useRouter();

const emits = defineEmits<{
  clickDismiss: [void];
  'click-dismiss': [void];
  'click-productRemove': [{ product: Product }];
  'click-product-imageRemove': [void];
  'click-product-titleBrandUpdate': [void];
  'click-product-priceUpdate': [void];
  'click-product-descriptionUpdate': [void];
  'click-product-categoryUpdate': [void];
  'click-product-specificationsUpdate': [void];
}>();
const props = withDefaults(
  defineProps<{
    product?: Product;
    productPrevious?: Product;
    productNext?: Product;

    isWide?: boolean;
    isEditable?: boolean;
    isBackable?: boolean;
  }>(),
  {
    isWide: false,
    isEditable: false,
    isBackable: false,
  },
);

const openedWindowCount = computed(() => usePopupWindowStore().items.length);
const actionbarLeftMenus = computed(() => {
  return [
    {
      key: 'close',
      title: 'Close',
      icon: IconClose,
      click: () => emits('click-dismiss'),
    },
  ];
});
const actionbarRightMenus = computed<Menu[]>(() => {
  if (!props.product) return [];

  const menus: Menu[] = [
    {
      key: 'view',
      title: 'View Product in Display',
      icon: IconView,
      isHidden: true,
      click: (menu) => clickView(),
    },
    {
      key: 'copy',
      title: 'Copy Product Link',
      icon: IconCopyDark,
      click: (menu) => clickCopyLink(),
    },
  ];

  if (props.isEditable) {
    menus.push({
      key: 'print',
      title: 'Print Product Catalog',
      icon: IconPrinter,
      isHidden: true,
      click: (menu) => {
        if (props.product)
          router.push({
            path: '/product/export',
            query: { productId: props.product.id },
          });
      },
    });
    menus.push({
      key: 'delete',
      title: 'Delete Product',
      icon: IconTrash,
      isHidden: true,
      click: (menu) => {
        if (props.product) emits('click-productRemove', { product: props.product });
      },
    });
  }

  return menus;
});

function clickCopyLink() {
  if (!props.product) {
    useSnackbarStore().show('Cannot Copy');
    return;
  }
  const link = props.product.getLink();
  if (!link) {
    useSnackbarStore().show('Cannot Copy');
    return;
  }
  copyText(link);
  useSnackbarStore().show({
    icon: IconCopyLight,
    text: 'Copied to Clipboard',
    actions: [{ key: 'open', title: 'Open', click: () => clickView() }],
  });
}
function clickView() {
  let urlView = `${getOrigin()}/product/view`;

  if (!props.product) {
    openLink(urlView);
  } else {
    openLink(`${urlView}?productId=${props.product.id}`);
  }
}
</script>

<template>
  <div class="PanelProduct">
    <ViewerProduct
      ref="Viewer"
      :openedWindowCount="openedWindowCount"
      :isWide="isWide"
      :isEditable="isEditable"
      :leftMenus="actionbarLeftMenus"
      :rightMenus="actionbarRightMenus"
      :product="product"
      :productPrevious="productPrevious"
      :productNext="productNext"
      @click-product-imageRemove="(x) => $emit('click-product-imageRemove', x)"
      @click-product-titleBrandUpdate="(x) => $emit('click-product-titleBrandUpdate', x)"
      @click-product-priceUpdate="(x) => $emit('click-product-priceUpdate', x)"
      @click-product-descriptionUpdate="(x) => $emit('click-product-descriptionUpdate', x)"
      @click-product-categoryUpdate="(x) => $emit('click-product-categoryUpdate', x)"
      @click-product-specificationsUpdate="(x) => $emit('click-product-specificationsUpdate', x)"
    />
  </div>
</template>

<style lang="scss" scoped>
.PanelProduct {
  width: 100%;
  height: 100%;
  width: 100dvw;
  max-width: 100%;

  font-size: 1.2rem;

  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
}
</style>
