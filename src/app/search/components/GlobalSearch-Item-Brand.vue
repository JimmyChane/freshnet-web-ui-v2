<script setup lang="ts">
import ItemSearch from './GlobalSearch-Item.vue';
import Labels from './GlobalSearch-Item-Labels.vue';
import { Brand } from '@/data/Brand';
import { computed } from 'vue';

const props = defineProps<{ item?: Brand }>();
const icon = computed(() => props.item?.icon);
const thumbnail = computed(() => icon.value?.toUrl() ?? '');
const title = computed(() => props.item?.title ?? '');
</script>

<template>
  <ItemSearch
    class="ItemSearchBrand"
    :to="{ path: '/product', query: { brand: item?.id } }"
    @click="() => $emit('click')"
  >
    <div class="ItemSearchBrand-image" :class="[thumbnail ? '' : 'ItemSearchBrand-image-noImage']">
      <img class="ItemSearchBrand-icon" v-if="thumbnail" :src="thumbnail" />
    </div>
    <div class="ItemSearchBrand-body">
      <Labels :labels="['Product', 'Brand']" />
      <span class="ItemSearchBrand-title">{{ title }}</span>
    </div>
  </ItemSearch>
</template>

<style lang="scss" scoped>
.ItemSearchBrand {
  .ItemSearchBrand-image {
    width: 3.5em;
    height: 3.5em;
    border-radius: 0.2em;
    background: #ffffff80;
    .ItemSearchBrand-icon {
      width: 3.5em;
      height: 3.5em;
      padding: 0.5em;
      border-radius: 0.2em;
      object-fit: contain;
    }
  }
  .ItemSearchBrand-image-noImage {
    background: #ffffff80;
    .ItemSearchBrand-icon {
      display: none;
    }
  }

  .ItemSearchBrand-body {
    min-height: 3.5em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.3em;

    .ItemSearchBrand-title {
      font-weight: 600;
    }
  }
}
</style>
