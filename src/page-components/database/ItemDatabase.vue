<script setup lang="ts">
import ButtonIconText from '@/components/button/ButtonIconText.vue';
import ItemCollection from './ItemCollection.vue';

import IconDownload from '@/assets/icon/download-black.svg';
import IconMinus from '@/assets/icon/minus-black.svg';
import IconPlus from '@/assets/icon/plus-black.svg';
import { computed, ref } from 'vue';
import { pushDownload } from '@/utils/U';
import { useDatabaseStore } from '@/data-stores/database.store';
import { useWindowStore } from '@/stores/window.store';

const props = defineProps<{
  database: {
    name: string;
    collections: { name: string; documents: { _id: string }[] }[];
  };
}>();

const isSelfExpand = ref(false);
const expands = ref<string[]>([]);

const collections = computed(() => props.database.collections);
const isWide = computed(() => useWindowStore().width > 500);

function addExpand(name: string) {
  expands.value.push(name);
}
function removeExpand(name: string) {
  expands.value.splice(expands.value.indexOf(name), 1);
}

function allCollapse() {
  expands.value = [];
}

function pushDownloadDatabase() {
  useDatabaseStore()
    .exportDatabase({ database: props.database.name })
    .then((databaseContext) => {
      let { filename, data } = databaseContext;
      let dataString = JSON.stringify(data, null, 0);
      pushDownload(filename, dataString);
    });
}
</script>

<template>
  <div class="ItemDatabase">
    <div class="ItemDatabase-header">
      <span class="ItemDatabase-title">{{ database.name }}</span>
      <div class="ItemDatabase-actions">
        <ButtonIconText
          :src="IconDownload"
          :text="isWide ? 'Export' : ''"
          @click="pushDownloadDatabase()"
        />
        <ButtonIconText
          :src="isSelfExpand ? IconMinus : IconPlus"
          :text="isWide ? (isSelfExpand ? 'Collapse' : 'Expand') : ''"
          @click="
            if (isSelfExpand) {
              isSelfExpand = false;
              allCollapse();
            } else {
              isSelfExpand = true;
              allCollapse();
            }
          "
        />
      </div>
    </div>

    <div class="ItemDatabase-body" v-if="isSelfExpand">
      <ItemCollection
        v-for="collection in collections"
        :key="collection.name"
        :collection="collection"
        :isExpand="expands.includes(collection.name)"
        @click-expand="
          if (expands.includes(collection.name)) removeExpand(collection.name);
          else addExpand(collection.name);
        "
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ItemDatabase {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  .ItemDatabase-header {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    .ItemDatabase-title {
      flex-grow: 1;
      font-size: 1rem;
      color: black;
    }
    .ItemDatabase-actions {
      width: max-content;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.1rem;
    }
  }
  .ItemDatabase-body {
    padding-left: 1rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    background: hsla(0, 0%, 0%, 0.025);
    border-left: 2px solid hsla(0, 0%, 0%, 0.2);
    border-radius: 0.2rem;
    padding: 1rem;
    padding-right: 0.4rem;
  }
}
</style>
@/stores/data-stores/database.store
