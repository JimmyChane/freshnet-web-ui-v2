<script setup lang="ts">
  import ContactLink from "./ItemSettingContacts-Item-Link.vue";
  import { Contact } from "@/data/Contact";

  defineProps<{ value: Contact }>();
</script>

<template>
  <div class="ItemSettingContacts-Item">
    <span class="ItemSettingContacts-Item-title">{{ value.title }}</span>

    <ContactLink
      v-for="link of value.links"
      :key="`${value.title}${link.category?.key ?? ''}${link.id}`"
      :link="link"
    />
  </div>
</template>

<style lang="scss" scoped>
  .ItemSettingContacts-Item {
    border: 1px solid rgba(0, 0, 0, 0.2);
    padding: 1rem;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    gap: 0.5rem;

    display: flex;
    flex-direction: column;

    .ItemSettingContacts-Item-title {
      font-weight: 600;
    }
  }
</style>
