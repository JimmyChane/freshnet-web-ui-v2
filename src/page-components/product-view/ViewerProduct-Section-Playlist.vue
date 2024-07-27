<script setup lang="ts">
import { ref, computed } from 'vue';
import Section from './ViewerProduct-Section.vue';
import ItemProductSuggest from './ViewerProduct-Section-Playlist-Item.vue';
import type { Product } from '@/data/Product';
import type { Color } from 'chroma-js';

const props = withDefaults(
  defineProps<{
    primaryColor?: Color;
    allowEdit?: boolean;
    product?: Product;
    previousProduct?: Product;
    nextProduct?: Product;
  }>(),
  { allowEdit: false },
);

const keyprevious = ref();
const keynext = ref();

const previousProductId = computed(() => props.previousProduct?.id ?? '');
const nextProductId = computed(() => props.nextProduct?.id ?? '');

function clickPreviousProduct() {
  const ref = keyprevious.value;
  if (!ref) return;
  ref.$el.click();
}
function clickNextProduct() {
  const ref = keynext.value;
  if (!ref) return;
  ref.$el.click();
}
</script>

<template>
  <Section
    class="SectionPlaylist"
    v-if="nextProduct || previousProduct"
    :primaryColor="primaryColor"
  >
    <div class="SectionPlaylist-playlist">
      <ItemProductSuggest
        v-if="previousProduct"
        ref="keyprevious"
        title="Previous"
        :item="previousProduct"
        :to="{ query: { productId: previousProductId } }"
      />
      <ItemProductSuggest
        v-if="nextProduct"
        ref="keynext"
        title="Next"
        :item="nextProduct"
        :to="{ query: { productId: nextProductId } }"
      />
    </div>
  </Section>
</template>

<style lang="scss" scoped>
.SectionPlaylist {
  grid-area: playlist;
  width: 100%;
  max-width: 50rem;
  margin-top: 4rem;

  display: flex;
  flex-direction: column;

  .SectionPlaylist-playlist {
    width: 100%;
    overflow: hidden;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 3px;
  }
}
</style>
