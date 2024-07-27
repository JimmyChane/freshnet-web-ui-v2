<script setup lang="ts">
import PanelAction from '@/components/panel/PanelAction.vue';
import { Category } from '@/data/Category';
import Input from '@/components/input/Input.vue';
import LabelMenus from '@/components/label/LabelMenus.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useBrandStore } from '@/data-stores/brand.store';
import { useCategoryStore } from '@/data-stores/category.store';
import { useProductStore } from '@/data-stores/product.store';
import type { PopupWindow } from '@/stores/popup-window/PopupWindow';
import { useSnackbarStore } from '@/stores/snackbar/snackbar.store';
import type { Menu } from '@/stores/popup-menu/PopupMenu';

const props = defineProps<{ popupWindow: PopupWindow }>();

const categoryMenus = ref<Menu[]>([]);
const brandMenus = ref<Menu[]>([]);

const titleError = ref('');

const brandMenu = ref<Menu | undefined>({ key: 'none', title: 'None' });
const categoryMenu = ref<Menu>();
const title = ref('');

const isShowing = computed(() => props.popupWindow.isShowing);

watch(
  () => isShowing.value,
  () => {
    if (isShowing.value) {
      invalidate();
    } else {
      categoryMenus.value = [];
      brandMenus.value = [];
    }
  },
);

async function invalidate() {
  const brands = await useBrandStore().getItems();
  const categories = await useCategoryStore().getItems();

  brandMenus.value = [
    { key: 'none', title: 'None' },
    ...brands
      .sort((brand1, brand2) => brand1.compare(brand2))
      .map((brand) => {
        return {
          key: brand.id,
          title: brand.title,
          click: (menu) => (brandMenu.value = menu),
        } as Menu;
      }),
  ];
  categoryMenus.value = categories
    .sort((category1, category2) => category1.compare(category2))
    .map((category) => {
      return {
        key: category.id,
        title: category.title,
        click: (menu) => (categoryMenu.value = menu),
      };
    });

  if (!brandMenu.value) {
    brandMenu.value = brandMenus.value.find((menu) => menu.key === 'none');
  }

  const categoryOther = categories.find((category) => {
    return category.key === Category.Key.Other;
  });
  if (!categoryMenu.value && categoryOther) {
    categoryMenu.value = categoryMenus.value.find((menu) => {
      return menu.key === categoryOther.id;
    });
  }
}
function clickConfirm() {
  const xTitle = title.value.trim();
  const brandId = brandMenu.value?.key ?? '';
  const categoryId = categoryMenu.value?.key ?? '';

  if (!xTitle) {
    titleError.value = 'Title Missing';
    useSnackbarStore().show('Title Missing');
    return;
  }

  const output = { title: xTitle, brandId, categoryId };
  props.popupWindow.onConfirm(output);
}

onMounted(() => {
  invalidate();
  useBrandStore().getItems();
  useCategoryStore().getItems();
  useProductStore().getItems();
});
</script>

<template>
  <PanelAction
    class="WindowAddProduct"
    title="New Product"
    :isShowing="isShowing"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => clickConfirm()"
  >
    <div class="WindowAddProduct-body">
      <div class="WindowAddProduct-menus">
        <LabelMenus title="Brand" :menus="brandMenus" :menu="brandMenu" />
        <LabelMenus title="Category" :menus="categoryMenus" :menu="categoryMenu" />
      </div>

      <Input
        class="WindowAddProduct-title"
        label="Title"
        autocapitalize="words"
        :isRequired="true"
        :error="titleError"
        v-model="title"
      />
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
.WindowAddProduct-reuse-title {
  font-size: 1.1rem;
  font-weight: 600;
}
.WindowAddProduct-reuse-required {
  color: hsl(0, 50%, 50%);
  font-size: 0.8rem;
}

.WindowAddProduct {
  .WindowAddProduct-body {
    width: 26rem;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 3em;

    .WindowAddProduct-menus {
      z-index: 2;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 0.5rem;
    }

    .WindowAddProduct-title {
      z-index: 1;
      padding-left: 0;
      padding-right: 0;
    }
  }
}
</style>
@/stores/data-stores/brand.store
