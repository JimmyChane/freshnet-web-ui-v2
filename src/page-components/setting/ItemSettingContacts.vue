<script setup lang="ts">
import { SettingKey } from '@/data/Setting';
import ItemSettingHeader from './ItemSetting-Header.vue';
import ContactItem from './ItemSettingContacts-Item.vue';
import { onMounted, ref, watch } from 'vue';
import { useSettingStore } from '@/data-stores/setting.store';
import { Contact } from '@/data/Contact';

const title = ref('Contacts (Readonly)');
const values = ref<Contact[]>([]);

watch(() => useSettingStore().lastModified, invalidate);

async function invalidate() {
  values.value = await useSettingStore().findValueOfKey({
    key: SettingKey.Contacts,
    default: [],
  });
}

onMounted(() => invalidate());
</script>

<template>
  <div class="ItemSettingContacts">
    <ItemSettingHeader :title="title" />

    <div class="ItemSettingContacts-body">
      <ContactItem v-for="value of values" :key="value.title" :value="value" />
      <span class="ItemSettingContacts-empty" v-if="!values.length">Empty</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ItemSettingContacts {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-items: stretch;
  justify-content: flex-start;
  overflow: hidden;
  gap: 2px;
  border-radius: 1rem;

  .ItemSettingContacts-body {
    padding: 1rem;
    gap: 0.2rem;

    display: flex;
    flex-direction: column;
    align-items: stretch;
    background: white;

    .ItemSettingContacts-empty {
      font-size: 0.8rem;
      color: hsl(0, 0%, 75%);
    }
  }
}
</style>
