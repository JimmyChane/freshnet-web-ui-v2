<script setup lang="ts">
import PanelAction from '@/components/panel/PanelAction.vue';
import Selector3 from '@/components/selector/Selector3.vue';
import Input from '@/components/input/Input.vue';
import { computed, onMounted, ref } from 'vue';
import { useBrandStore } from '@/data-stores/brand.store';
import { useSnackbarStore } from '@/stores/snackbar/snackbar.store';
import type { PopupWindow } from '@/stores/popup-window/PopupWindow';
import type { Product } from '@/data/Product';
import { Brand } from '@/data/Brand';

export interface DataContent {
  product: Product;
  title: string;
  brandId: string;
}

export interface DataProps {
  input: DataContent;
  onConfirm: (data: DataContent) => void;
}

const props = defineProps<{ popupWindow: PopupWindow<DataProps> }>();

const data = ref<{ title: string; brandId: string }>({ title: '', brandId: '' });

const isShowing = computed(() => props.popupWindow.isShowing);
const input = computed(() => props.popupWindow.data.input);
const product = computed(() => input.value?.product);
const title = computed(() => data.value?.title ?? '');
const brandId = computed(() => data.value?.brandId ?? '');
const brand = computed(() => useBrandStore().items.find((brand) => brand.id === brandId.value));
const brandTitle = computed(() => brand.value?.title ?? '');
const parsedTitleBrand = computed(() => {
  if (title.value && brandTitle.value) return `${brandTitle.value} ${title.value}`;
  if (title.value) return title.value;
  if (brandTitle.value) return brandTitle.value;
  return '';
});

const brandMenus = computed(() => {
  return [new Brand({ _id: '', title: 'None' }), ...useBrandStore().items].map((item) => {
    return {
      key: item.id,
      title: item.title,
      icon: item.icon?.toUrl() ?? '',
    };
  });
});

function clickConfirm() {
  const output = {
    product: product.value,
    title: title.value,
    brandId: brandId.value,
  };

  if (!output.title) {
    useSnackbarStore().show('You must specify title');
    return;
  }

  props.popupWindow.data.onConfirm(output);
}

onMounted(() => {
  data.value = {
    title: input.value.title,
    brandId: input.value.brandId,
  };
});
</script>

<template>
  <PanelAction
    class="WindowUpdateTitleBrand"
    title="Update Title &amp; Brand"
    :isShowing="isShowing"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => clickConfirm()"
  >
    <div class="WindowUpdateTitleBrand-body">
      <Input
        class="WindowUpdateTitleBrand-input"
        autocapitalize="words"
        :bindValue="title"
        v-model="data.title"
      />

      <Selector3
        :menus="brandMenus"
        :selectedKey="brandId"
        @click-menu="
          (menu) => {
            if (data) data.brandId = menu.key ?? '';
          }
        "
      />
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
.WindowUpdateTitleBrand-body {
  width: 26rem;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  .WindowUpdateTitleBrand-input {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
@/stores/data-stores/brand.store
