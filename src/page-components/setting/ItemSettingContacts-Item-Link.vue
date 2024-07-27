<script setup lang="ts">
import { ContactLink } from '@/data/ContactLink';

defineProps<{ link: ContactLink }>();
</script>

<template>
  <div class="ItemSettingContacts-Item-Link">
    <div class="ItemSettingContacts-Item-Link-header">
      <img
        v-if="link.socialMedia?.icon"
        class="ItemSettingContacts-Item-Link-icon"
        :src="link.socialMedia.icon"
        alt=""
      />
      <span>{{ link.socialMedia?.title }}</span>
    </div>
    <span>{{ link.id }}</span>
  </div>
</template>

<style lang="scss" scoped>
.ItemSettingContacts-Item-Link {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1em;
  .ItemSettingContacts-Item-Link-header {
    display: flex;
    flex-direction: row;
    gap: 0.2em;

    :nth-child(1) {
      --size: 0.8rem;
      width: var(--size);
      height: var(--size);
    }
  }
}
</style>
