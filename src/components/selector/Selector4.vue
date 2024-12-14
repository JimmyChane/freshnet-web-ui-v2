<script setup lang="ts">
import { optArray, optString } from '@/utils/U';
import Item from './Selector4-Item.vue';
import { computed, onMounted, watch } from 'vue';

export interface Menu {
  key: string;
  title: string;
  icon: string;
}

const emits = defineEmits<{ clickMenu: [Menu] }>();
const props = defineProps<{
  menus: Menu[];
  defaultKey?: string;
  selectedKey?: string;
}>();

const Menus = computed(() => optArray(props.menus).map((menu) => menu));
const DefaultKey = computed(() => optString(props.defaultKey));
const DefaultMenu = computed(() => Menus.value.find((menu) => menu.key === DefaultKey.value));

watch(() => DefaultMenu.value, invalidateDefaultMenu);

function invalidateDefaultMenu() {
  setSelectedMenu(DefaultMenu.value);
}
function setSelectedMenu(menu?: Menu) {
  if (menu) emits('clickMenu', menu);
}

onMounted(() => invalidateDefaultMenu());
</script>

<template>
  <div class="Selector4">
    <Item
      v-for="menu of Menus"
      :key="menu.key"
      :title="menu.title"
      :icon="menu.icon"
      :isSelected="menu.key === selectedKey"
      @click="setSelectedMenu(menu)"
    />
  </div>
</template>

<style lang="scss" scoped>
.Selector4 {
  gap: 0.2rem;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
}
</style>
