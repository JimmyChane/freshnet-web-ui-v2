<script setup lang="ts">
  import { computed } from "vue";
  import NavigationLeftClickable from "./NavigationDrawer-Clickable.vue";
  import type { NavigationGroup } from "../NavigationDrawer";

  const props = defineProps<{ group2: NavigationGroup }>();

  const title = computed(() => props.group2.title);
  const group3s = computed(() => props.group2.groups);
  const isWide = computed(() => props.group2.isWide());
</script>

<template>
  <div class="NavViewGroup" :isWide="`${isWide}`">
    <span class="NavViewGroup-title" v-if="isWide && title">{{ title }}</span>

    <div class="NavViewGroup-groups" v-if="group3s">
      <div v-for="group3 of group3s" :key="group3.key">
        <NavigationLeftClickable
          v-if="!group3.getParent().isQuery"
          :item="group3"
          :href="group3.getLink()"
          @click="() => group3.click()"
        />
        <NavigationLeftClickable
          v-if="group3.getParent().isQuery"
          :item="group3"
          @click="() => group3.click()"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .NavViewGroup {
    display: flex;
    flex-direction: column;

    .NavViewGroup-title {
      width: fit-content;
      margin-left: 0.4em;
      padding: 0.6rem 1rem;

      font-size: 0.7em;
      font-weight: 600;
      opacity: 1;
      letter-spacing: 0.3em;
    }

    .NavViewGroup-groups {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 0.2em;

      & > * {
        width: 100%;
      }
    }
  }

  .NavViewGroup[isWide="true"] {
    width: 100%;
    .NavViewGroup-group3s {
      width: 100%;
    }
  }
</style>
