<script setup lang="ts">
  import PanelAction from "@/components/panel/PanelAction.vue";
  import Selector4 from "@/components/selector/Selector4.vue";
  import { useCategoryStore } from "@/data-stores/category.store";
  import { PopupWindow } from "@/stores/popup-window/PopupWindow";
  import { useSnackbarStore } from "@/stores/snackbar/snackbar.store";
  import { computed, onMounted, ref } from "vue";

  const props = defineProps<{ popupWindow: PopupWindow }>();

  const outputCategoryId = ref("");

  const isShowing = computed(() => props.popupWindow.isShowing);
  const input = computed(() => props.popupWindow.input);
  const product = computed(() => input.value?.product ?? null);
  const categoryId = computed(() => input.value?.categoryId ?? "");
  const categories = computed(() => useCategoryStore().items);

  const items = computed(() => [
    { key: "", title: "None" },
    ...categories.value.map((category) => {
      return {
        key: category.id,
        title: category.title,
        icon: category.icon,
      };
    }),
  ]);
  const itemMenus = computed(() =>
    items.value.map((item) => ({
      key: item.key,
      title: item.title,
      icon: item.icon?.toUrl() ?? "",
    })),
  );

  function clickConfirm() {
    if (categoryId.value === outputCategoryId.value) {
      useSnackbarStore().show("No Changes");
      return;
    }

    props.popupWindow.onConfirm({
      product: product.value,
      categoryId: outputCategoryId.value,
    });
  }

  onMounted(() => {
    outputCategoryId.value = categoryId.value;
  });
</script>

<template>
  <PanelAction
    class="WindowUpdateCategory"
    title="Edit Category"
    :isShowing="isShowing"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => clickConfirm()"
  >
    <div class="WindowUpdateCategory-body">
      <Selector4
        :menus="itemMenus"
        :selectedKey="outputCategoryId"
        @click-menu="
          (menu) => {
            let item = items.find((category) => category.key === menu.key);
            outputCategoryId = item ? item.key : '';
          }
        "
      />
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
  .WindowUpdateCategory-body {
    width: 35rem;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
