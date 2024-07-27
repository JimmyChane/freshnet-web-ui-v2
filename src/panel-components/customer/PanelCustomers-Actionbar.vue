<script setup lang="ts">
import NavigationBar from '@/components/actionbar/NavigationBar.vue';
import SearchInput from '@/components/search/SearchInput.vue';
import ItemCustomerSearch from './ItemCustomerSearch.vue';
import Searcher from '@/data/Searcher';
import TabLayout from '@/components/tabLayout/TabLayout.vue';
import IconAdd from '@/assets/icon/add-000000.svg';
import IconRefresh from '@/assets/icon/refresh-000000.svg';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Customer } from '@/data/Customer';
import { optString } from '@/utils/U';
import { useRouteStore } from '@/stores/route.store';
import type { Tab } from '@/components/tabLayout/TabLayout-Tab.vue';

const emits = defineEmits<{ clickItemAdd: [void]; clickRefresh: [void] }>();
const props = withDefaults(defineProps<{ title?: string; items?: Customer[] }>(), {
  title: '',
  items: () => [],
});

const results = ref<Customer[]>([]);

const filter = computed(() => optString(useRoute().query.filter));

const listService = computed(() => props.items.filter((item) => item.services.length));
const listOrder = computed(() => props.items.filter((item) => item.orders.length));

const navigationMenus = computed(() => {
  return [
    { title: 'Add', icon: IconAdd, click: () => emits('clickItemAdd') },
    {
      title: 'Refresh',
      icon: IconRefresh,
      click: () => emits('clickRefresh'),
    },
  ];
});
const tabLayoutMenus = computed<Tab[]>(() => {
  const tabs: Tab[] = [
    { key: '', title: 'All', count: props.items.length },
    {
      key: 'service',
      title: 'From Services',
      count: listService.value.length,
    },
    {
      key: 'order',
      title: 'From Orders',
      count: listOrder.value.length,
    },
  ];

  return tabs.map((menu) => {
    menu.isSelected = (menu) => filter.value === menu.key;
    menu.click = (menu) => {
      useRouteStore().replaceQuery({ query: { filter: menu.key } });
    };
    return menu;
  });
});

function searchResults(str: string) {
  return Searcher.withItems(props.items).search(str);
}

function itemKey(item: Customer) {
  return `${itemName(item)}${itemPhoneNumberValue(item)}`;
}
function itemName(item: Customer) {
  return item?.name ?? '';
}
function itemPhoneNumberValue(item: Customer) {
  return item?.phoneNumber?.value ?? '';
}
</script>

<template>
  <div class="PanelCustomers-Actionbar">
    <NavigationBar
      class="PanelCustomers-navigationbar"
      :title="items.length ? '' : title"
      :rightMenus="navigationMenus"
    >
      <SearchInput
        class="Actionbar-search"
        v-if="items.length"
        placeholder="Search customers & devices"
        :list="results"
        @callback-search="(str) => (results = searchResults(str))"
        v-slot="{ collapse }"
      >
        <router-link
          class="Actionbar-search-link transition"
          v-for="item in results"
          :key="itemKey(item)"
          :to="{
            query: {
              name: itemName(item),
              phoneNumber: itemPhoneNumberValue(item),
            },
          }"
          @click="() => collapse()"
        >
          <ItemCustomerSearch :item="item" />
        </router-link>
      </SearchInput>
    </NavigationBar>

    <TabLayout class="PanelCustomers-tabLayout" :isScreenWide="true" :menus="tabLayoutMenus" />
  </div>
</template>

<style lang="scss" scoped>
.PanelCustomers-Actionbar {
  height: max-content;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid hsl(0, 0%, 90%);

  .PanelCustomers-navigationbar {
    z-index: 2;
    border: none;

    .Actionbar-search {
      .Actionbar-search-link {
        text-decoration: none;
        color: inherit;
        text-align: start;
        font-size: 1rem;
        cursor: pointer;
        border: none;
        border-radius: 0.6rem;
        background: none;
        &:hover {
          background: rgba(0, 0, 0, 0.05);
        }
      }
    }
  }
  .PanelCustomers-tabLayout {
    z-index: 1;
    padding: 0.3rem 1rem;
    padding-top: 0;
    padding-right: 2rem;
  }
}
</style>
