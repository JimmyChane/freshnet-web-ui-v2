<script setup lang="ts">
  import PanelAction from "@/components/panel/PanelAction.vue";
  import Customer from "@/data/customer/Customer";
  import Selector3 from "@/components/selector/Selector3.vue";
  import WindowSection from "./WindowSection.vue";
  import SpecificationInputs from "./SpecificationInputs.vue";
  import TextArea from "@/components/InputTextArea.vue";
  import { PopupWindow, useStore } from "@/stores/store";
  import { computed, onMounted, ref, watch } from "vue";
  import { useCustomerStore } from "@/data-stores/customer.store";
  import { useCategoryStore } from "@/data-stores/category.store";
  import { useSpecificationStore } from "@/data-stores/specification.store";
  import Specification from "@/data/specification/Specification";
  import { Menu } from "@/components/selector/Selector3/Menu";

  const props = defineProps<{ popupWindow: PopupWindow }>();

  const Requirement = ref(Customer.Requirement);
  const data = ref<{
    description: string;
    categoryKey: string;
    serialNumber: string;
    ownerCustomerId: string;
    specifications: Specification[];
  }>({
    description: "",
    categoryKey: "none",
    serialNumber: "",
    ownerCustomerId: "",
    specifications: [],
  });

  const isShowing = computed(() => props.popupWindow.isShowing);
  const item = computed(() => props.popupWindow.item);
  const isLoading = computed(() => useCustomerStore().isLoading);
  const isClickable = computed(() => !useCustomerStore().isLoading);

  const categoryMenus = computed(() => {
    const menus: Menu[] = [
      { key: "none", title: "None" },
      ...useCategoryStore().items.map((item) => item),
    ];

    return menus.map((item) => ({
      key: item.key,
      title: item.title,
      icon: item.icon?.toUrl() ?? "",
    }));
  });
  const dataSpecifications = computed(() => {
    return data.value.specifications;
  });

  const Description = ref<typeof TextArea>();

  watch(
    () => isShowing.value,
    () => {
      if (!isShowing.value) return;

      if (Description.value) Description.value.focus();
    },
  );
  watch(() => item.value, bindData);

  onMounted(() => {
    bindData();
  });

  function bindData() {
    useCategoryStore().getItems();
    useSpecificationStore().getItems();
  }

  function clickOk() {
    data.value.ownerCustomerId = item.value?.id ?? "";
    data.value.description = data.value.description.trim();
    data.value.categoryKey = data.value.categoryKey.trim();
    data.value.serialNumber = data.value.serialNumber.trim();
    data.value.specifications.map((specification) => {
      specification.typeKey = specification.typeKey.trim();
      specification.content = specification.content.trim();
      return specification;
    });

    if (data.value.categoryKey === "none") {
      useSnackbarStore().show("Category is Required");
    } else {
      useCustomerStore()
        .addDevice(data.value)
        .then((item) => props.popupWindow.close())
        .catch((error) => {
          console.error(error);
          useSnackbarStore().show("Error Adding Device");
        });
    }
  }
</script>

<template>
  <PanelAction
    class="WindowAddDevice"
    :title="`Add New Device${item ? ` for ${item.name}` : ''}`"
    :isShowing="isShowing"
    :isLoading="isLoading"
    :isClickable="isClickable"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => clickOk()"
  >
    <div class="WindowAddDevice-body">
      <TextArea
        class="WindowAddDevice-description"
        ref="Description"
        type="text"
        label="Description"
        :bindValue="data.description"
        @input="(value: string) => (data.description = value)"
      />

      <WindowSection title="Category" :isRequired="true">
        <Selector3
          :menus="categoryMenus"
          :selectedKey="data.categoryKey"
          @click-menu="(menu: Menu) => (data.categoryKey = menu.key ?? '')"
        />
      </WindowSection>

      <WindowSection title="Specification">
        <SpecificationInputs :items="dataSpecifications" />
      </WindowSection>
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
  .WindowAddDevice {
    width: 100%;
    .WindowAddDevice-body {
      width: 40rem;
      max-width: 100%;
      max-height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      gap: 2rem;
      .WindowAddDevice-description {
        height: 7rem;
      }
    }
  }
</style>
@/stores/data-stores/customer.store