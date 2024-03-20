<script setup lang="ts">
  import PanelAction from "@/components/panel/PanelAction.vue";
  import SpecificationInputs from "@/pages/customer/components/SpecificationInputs.vue";
  import type { PopupWindow } from "@/stores/popup-window/PopupWindow";
  import { computed, onMounted, ref } from "vue";
  import { Specification } from "@/data/specification/Specification";
  import { optArray } from "@/U";
  import { CustomerDeviceSpecification } from "@/data/customer/CustomerDeviceSpecification";
  import type { Product } from "@/data/product/Product";

  const props = defineProps<{
    popupWindow: PopupWindow<{
      product?: Product;
      specifications?: Specification[];
      onConfirm: (data: {
        product?: Product;
        specifications: Specification[];
      }) => void;
    }>;
  }>();

  const data = ref<{ specifications: Specification[] }>({ specifications: [] });

  const isShowing = computed(() => props.popupWindow.isShowing);
  const input = computed(() => props.popupWindow.data);
  const product = computed(() => input.value?.product ?? undefined);
  const inputSpecifications = computed(() => {
    return optArray(input.value?.specifications);
  });
  const specifications = computed(() => data.value?.specifications ?? []);

  function clickConfirm() {
    props.popupWindow.data.onConfirm({
      product: product.value,
      specifications: specifications.value,
    });
  }

  onMounted(() => {
    data.value.specifications = inputSpecifications.value
      .map((specification) => {
        specification.typeKey = specification.type
          ? specification.type.key
          : "";
        return specification;
      })
      .map((specification) => {
        return new Specification(specification).toData();
      });
  });
</script>

<template>
  <PanelAction
    class="WindowUpdateSpecifications"
    title="Update Specifications"
    :isShowing="isShowing"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => clickConfirm()"
  >
    <div class="WindowUpdateSpecifications-body">
      <SpecificationInputs :items="specifications" />
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
  .WindowUpdateSpecifications-body {
    width: 40rem;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
</style>
