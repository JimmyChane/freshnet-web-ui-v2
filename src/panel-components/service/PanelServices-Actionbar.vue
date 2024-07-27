<script setup lang="ts">
import NavigationBar from '@/components/actionbar/NavigationBar.vue';
import SearchInput from '@/components/search/SearchInput.vue';
import Searcher from '@/data/Searcher';
import TabLayout from '@/components/tabLayout/TabLayout.vue';
import IconSearch from '@/assets/icon/search-000000.svg';
import { Service } from '@/data/Service';
import { computed, ref } from 'vue';
import { ServiceState } from '@/data/ServiceState';
import { useWindowStore } from '@/stores/window.store';
import type { Menu } from '@/stores/popup-menu/PopupMenu';
import type { Tab } from '@/components/tabLayout/TabLayout-Tab.vue';
import type { GroupMenu, LayoutMenu, SortMenu } from './PanelServices.vue';
import ItemService from '@/dialog-components/service/item-service/ItemService.vue';

const emits = defineEmits<{ clickService: [Service]; clickSearch: [void] }>();
const props = withDefaults(
  defineProps<{
    title?: string;
    menus?: Menu[];

    services?: Service[];
    stateMenus?: {
      state: ServiceState;
      list: any[];
      iconSelected: string;
      isSelected: () => boolean;
      click: () => void;
    }[];

    layoutMenus?: LayoutMenu[];
    layoutMenuIndex?: number;

    groupMenus?: GroupMenu[];
    groupMenuIndex?: number;

    sortMenus?: SortMenu[];
    sortMenuIndex?: number;
  }>(),
  {
    title: '',
    menus: () => [],
    services: () => [],
    stateMenus: () => [],
    layoutMenus: () => [],
    layoutMenuIndex: -1,
    groupMenus: () => [],
    groupMenuIndex: -1,
    sortMenus: () => [],
    sortMenuIndex: -1,
  },
);

const results = ref<Service[]>([]);

const isOver350 = computed(() => useWindowStore().width > 350);
const isOver550 = computed(() => useWindowStore().width > 550);

const tabLayoutMenus = computed(() => {
  return props.stateMenus.map((stateMenu) => {
    return {
      title: stateMenu.state.title,
      icon: stateMenu.isSelected() ? stateMenu.iconSelected : stateMenu.state.icon,
      count: stateMenu.list.length,
      primaryColor: stateMenu.state.primaryColor,
      isSelected: (tab: Tab) => stateMenu.isSelected(),
      click: (tab: Tab) => stateMenu.click(),
    } as Tab;
  });
});

function searchResults(str: string) {
  return Searcher.withItems(props.services).search(str);
}

const rightMenus = computed(() => {
  const xMenus: Menu[] = [];

  if (isOver350.value) {
    xMenus.push({
      title: 'Search',
      icon: IconSearch,
      click: () => emits('clickSearch'),
    });
  }

  xMenus.push(...props.menus);

  return xMenus;
});
</script>

<template>
  <div class="PanelServices-Actionbar">
    <NavigationBar class="PanelServices-Actionbar-top" :rightMenus="rightMenus">
      <SearchInput
        class="PanelServices-Actionbar-SearchInput"
        v-if="isOver350 && services.length"
        placeholder="Search services"
        :list="results"
        @callback-search="(strs) => (results = searchResults(strs))"
        v-slot="{ collapse }"
      >
        <ItemService
          v-for="item in results as Service[]"
          :key="item.getUnique()"
          :item="item"
          @click="
            () => {
              collapse();
              emits('clickService', item);
            }
          "
        />
      </SearchInput>
    </NavigationBar>

    <TabLayout
      class="PanelServices-Actionbar-tabs"
      :isScreenWide="isOver550"
      :menus="tabLayoutMenus"
    />
  </div>
</template>

<style lang="scss" scoped>
.PanelServices-Actionbar {
  height: max-content;
  background: #f3f3f3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .PanelServices-Actionbar-top {
    z-index: 3;
    max-width: var(--max-width);

    .PanelServices-Actionbar-SearchInput {
      z-index: 3;
      width: 100%;
      padding: 0;
      flex-grow: 2;
    }
  }
  .PanelServices-Actionbar-tabs {
    padding: 0.3rem 1rem;
    padding-right: 2rem;
  }
  .PanelServices-Actionbar-toolbar {
    width: 100%;
    padding: 0.3rem 1rem;

    z-index: 2;

    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    overflow-x: auto;

    & > * {
      width: 100%;
      max-width: var(--max-width);
      gap: 0.5rem;

      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-start;
    }

    .PanelServices-Actionbar-toolbar-menus {
      gap: 0.5rem;

      flex-grow: 1;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
</style>
