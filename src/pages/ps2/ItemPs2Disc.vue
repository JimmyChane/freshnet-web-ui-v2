<script setup lang="ts">
  import ImageView from "@/components/image-viewer/ImageView.vue";
  import { serverCloudinary } from "@/data/server/Server";
  import { Ps2Disc } from "@/data/ps2/Ps2Disc";
  import { computed } from "vue";

  const props = defineProps<{ ps2Disc: Ps2Disc }>();

  const code = computed(() => props.ps2Disc.code);
  const title = computed(() => props.ps2Disc.title);
  const imageUrl = computed(() => `ps2/disc/${code.value}.jpg`);
</script>

<template>
  <div class="ItemPs2Disc">
    <ImageView
      class="ItemPs2Disc-image"
      :src="serverCloudinary({ url: imageUrl })"
    />

    <div class="ItemPs2Disc-content">
      <p>{{ code }}</p>
      <p>{{ title }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .ItemPs2Disc {
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    align-items: center;
    padding: 10px 0;

    .ItemPs2Disc-image {
      height: 4rem;
      aspect-ratio: 14/9;
      object-fit: contain;
      border-radius: 0.2rem;
    }

    .ItemPs2Disc-content {
      display: flex;
      flex-direction: column;
      :nth-child(1) {
        font-size: 0.8rem;
      }
      :nth-child(2) {
        font-size: 1rem;
      }
    }
  }
</style>
