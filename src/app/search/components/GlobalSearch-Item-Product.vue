<script setup lang="ts">
  import { computed, onMounted, ref, watch } from "vue";
  import ImageViews from "@/components/image-viewer/ImageViews.vue";
  import ItemSearch from "./GlobalSearch-Item.vue";
  import Labels from "./GlobalSearch-Item-Labels.vue";
  import { Product } from "@/data/product/Product";

  const categoryTitle = ref("");
  const title = ref("");

  const emits = defineEmits<{ "callback-click": [void]; click: [void] }>();
  const props = defineProps<{ item?: Product }>();

  const images = computed(() => {
    return props.item?.images;
  });

  watch(() => props.item, invalidate);

  async function invalidate() {
    categoryTitle.value = "";
    title.value = "";

    if (!props.item) return;

    categoryTitle.value = await props.item
      .fetchCategory()
      .then((category) => category?.title ?? "")
      .catch((error) => "");
    title.value = await props.item.fetchFullTitle().catch((error) => "");
  }

  onMounted(invalidate);
</script>

<template>
  <ItemSearch
    class="ItemSearchProduct"
    :to="{ path: '/product', query: { productId: item?.id } }"
    @click="() => $emit('click')"
  >
    <div
      class="ItemSearchProduct-image"
      :class="[
        images?.length ?? 0 > 0 ? '' : 'ItemSearchProduct-image-noImage',
      ]"
    >
      <ImageViews
        class="ItemSearchProduct-thumbnail"
        :width="56"
        :height="56"
        :images="images"
      />
    </div>
    <div class="ItemSearchProduct-body">
      <Labels :labels="['Product', categoryTitle]" />
      <span class="ItemSearchProduct-title">{{ title }}</span>
    </div>
  </ItemSearch>
</template>

<style lang="scss" scoped>
  .ItemSearchProduct {
    .ItemSearchProduct-image {
      width: 3.5em;
      height: 3.5em;
      border-radius: 0.2em;
      .ItemSearchProduct-thumbnail {
        width: 3.5em;
        height: 3.5em;
        border-radius: 0.2em;
        object-fit: contain;
      }
    }
    .ItemSearchProduct-image-noImage {
      background: #ffffff80;
      .ItemSearchProduct-thumbnail {
        display: none;
      }
    }

    .ItemSearchProduct-body {
      min-height: 3.5em;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 0.3em;

      .ItemSearchProduct-title {
        font-weight: 600;
      }
    }
  }
</style>
