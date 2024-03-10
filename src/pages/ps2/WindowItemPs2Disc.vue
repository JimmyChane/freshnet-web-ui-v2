<script setup lang="ts">
  import { serverCloudinary } from "@/data/server/Server";
  import Ps2Disc from "@/data/ps2/Ps2Disc";
  import { computed } from "vue";

  const props = defineProps<{ item: Ps2Disc }>();

  const code = computed(() => props.item.code);
  const title = computed(() => props.item.title);
  const imageUrl = computed(() => `ps2/disc/${code.value}.jpg`);
</script>

<template>
  <div class="WindowItemPs2Disc">
    <img
      class="WindowItemPs2Disc-img"
      :src="serverCloudinary({ url: imageUrl })"
    />

    <div class="WindowItemPs2Disc-text">
      <span>{{ title }}</span>
      <span>{{ code }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .WindowItemPs2Disc {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    background: linear-gradient(180deg, #ffffff 0%, hsl(231, 24%, 46%) 100%);

    .WindowItemPs2Disc-img {
      width: 100%;
    }

    .WindowItemPs2Disc-text {
      display: flex;
      flex-direction: column;
      padding: 2em;
      gap: 0.4em;
      :nth-child(1) {
        font-size: 3em;
      }
      :nth-child(2) {
        width: fit-content;
        background: rgba(255, 255, 255, 0.5);
        padding: 0.2em 1em;
        font-weight: 600;
        font-size: 0.9em;
        border-radius: 0.2em;
      }
    }
  }
</style>
