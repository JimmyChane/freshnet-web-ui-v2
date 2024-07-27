<script setup lang="ts">
import { computed } from 'vue';
import ImageView from '@/components/image-viewer/ImageView.vue';
import ItemSearch from './GlobalSearch-Item.vue';
import Labels from './GlobalSearch-Item-Labels.vue';
import { Ps2Disc } from '@/data/Ps2Disc';
import { serverCloudinary } from '@/data/Server';

const props = defineProps<{ item: Ps2Disc }>();
const thumbnail = computed(() => serverCloudinary({ url: `ps2/disc/${code.value}.jpg` }));
const title = computed(() => props.item?.title ?? '');
const code = computed(() => props.item?.code ?? '');
</script>

<template>
  <ItemSearch
    class="ItemSearchPs2Disc"
    :to="{ path: '/ps2', query: { discCode: item.code } }"
    @click="() => $emit('click')"
  >
    <div
      class="ItemSearchPs2Disc-image"
      :class="[thumbnail ? '' : 'ItemSearchPs2Disc-image-noImage']"
    >
      <ImageView class="ItemSearchPs2Disc-thumbnail" :src="thumbnail" />
    </div>
    <div class="ItemSearchPs2Disc-body">
      <Labels :labels="['Product', 'PS2', 'Disc']" />
      <span class="ItemSearchPs2Disc-title">{{ title }}</span>
      <span class="ItemSearchPs2Disc-subTitle">{{ code }}</span>
    </div>
  </ItemSearch>
</template>

<style lang="scss" scoped>
.ItemSearchPs2Disc {
  .ItemSearchPs2Disc-image {
    width: 3.5em;
    height: 3.5em;
    border-radius: 0.2em;
    .ItemSearchPs2Disc-thumbnail {
      width: 3.5em;
      height: 3.5em;
      border-radius: 0.2em;
      object-fit: contain;
    }
  }
  .ItemSearchPs2Disc-image-noImage {
    background: #ffffff80;
    .ItemSearchPs2Disc-thumbnail {
      display: none;
    }
  }

  .ItemSearchPs2Disc-body {
    min-height: 3.5em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.3em;

    .ItemSearchPs2Disc-title {
      font-weight: 600;
    }
    .ItemSearchPs2Disc-subTitle {
      font-size: 0.8em;
      font-weight: 400;
      color: #808080;
    }
  }
}
</style>
