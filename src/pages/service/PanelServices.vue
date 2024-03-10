<script setup lang="ts">
  import Actionbar from "./PanelServices-Actionbar.vue";
  import ListServices from "./ListServices.vue";
  import Empty from "@/components/Empty.vue";
  import PageService from "@/pages/service/PageService.vue";

  import ServiceState from "@/data/service/ServiceState";

  import IconGrid from "@/assets/icon/grid-000000.svg";
  import IconList from "@/assets/icon/list-000000.svg";
  import IconDetail from "@/assets/icon/detail-000000.svg";
  import Service from "@/data/service/Service";
  import { computed, onMounted, ref, watch } from "vue";
  import { useLoginStore } from "@/stores/login.store";
  import { useRoute } from "vue-router";
  import { useStore } from "@/stores/store";
  import { useServiceStore } from "@/data-stores/service.store";
  import { GroupMenu, LayoutMenu, SortMenu } from "./PanelServices";
  import { Menu } from "@/stores/popup-menu/PopupMenu";
  import { optString } from "@/U";
  import { useRouteStore } from "@/stores/route.store";

  const route = useRoute();

  const emits = defineEmits<{
    clickAdd: [void];
    clickImport: [void];
    clickService: [Service];
    clickSearch: [void];
  }>();
  const props = withDefaults(
    defineProps<{
      menus?: Menu[];
      services?: Service[];
      currentItem?: Service;
    }>(),
    { menus: () => [], services: () => [] },
  );

  const selfRef = ref();
  const scrollTop = ref(0);

  const stateMenuIndex = ref(0);
  const currentLayoutIndex = ref(1);
  const currentGroupIndex = ref(1);
  const currentSortIndex = ref(0);

  const stateMenus = ref<
    {
      state: ServiceState;
      list: any[];
      iconSelected: string;
      isSelected: () => boolean;
      click: () => void;
    }[]
  >([]);
  const layoutMenus = ref<LayoutMenu[]>([]);
  const groupMenus = ref<GroupMenu[]>([]);
  const sortMenus = ref<SortMenu[]>([]);

  const iconEmpty = computed(() => PageService.icon.dark.toUrl());

  const items = computed(
    () => stateMenus.value[stateMenuIndex.value]?.list ?? [],
  );

  const layoutMode = computed(() => {
    if (currentLayoutIndex.value === 0) return ListServices.LayoutMode.Grid;
    if (currentLayoutIndex.value === 1) return ListServices.LayoutMode.List;
    if (currentLayoutIndex.value === 2) return ListServices.LayoutMode.Detail;
    return 0;
  });
  const sortMode = computed(() => {
    const menu = sortMenus.value.find((menu) => {
      if (typeof menu.isSelected === "function") return menu.isSelected();
    });
    return menu?.key ?? ListServices.SortMode.DateCreated;
  });
  const groupMode = computed(() => {
    const menu = groupMenus.value.find((menu) => {
      if (typeof menu.isSelected === "function") return menu.isSelected();
    });
    return menu?.key ?? ListServices.GroupMode.DateCreated;
  });

  const currentUser = computed(() => useLoginStore().user);
  const isCurrentUserAdmin = computed(() => currentUser.value.isTypeAdmin());
  const isCurrentUserDefault = computed(() => currentUser.value.isDefault());

  const currentState = computed(() => optString(route.query.state));
  const isCurrentStatePending = computed(
    () => currentState.value === "pending",
  );

  watch(() => currentState.value, invalidateState);
  watch(() => props.services, invalidateList);

  function setPageSelected(state: string) {
    const menu = stateMenus.value.find((menu) => menu.state.key === state);

    const states = ServiceState.map((state) => state);
    if (!menu && stateMenus.value.length && states.length) {
      useRouteStore().replaceQuery({ query: { state: states[0].key } });
    }

    if (menu) stateMenuIndex.value = stateMenus.value.indexOf(menu);

    if (currentState.value === state) return;

    if (selfRef.value) selfRef.value.scrollTop = 0;
  }

  function filterList(services: Service[], key: string) {
    const tab = stateMenus.value.find((tab) => tab.state.key === key);
    if (tab) tab.list = services.filter((service) => service.state === key);
  }

  const PanelGroupServiceTabs = ref();

  function invalidateList() {
    const xServices = Array.isArray(props.services) ? props.services : [];
    ServiceState.map((state) => {
      filterList(xServices, state.key);
    });

    invalidateState();

    setTimeout(() => {
      if (PanelGroupServiceTabs.value)
        PanelGroupServiceTabs.value.scrollLeft = 0;
    }, 2000);
  }
  function invalidateState() {
    setPageSelected(currentState.value);
  }

  onMounted(() => {
    stateMenus.value = ServiceState.map((state) => {
      return {
        key: state.key,
        title: state.title,
        icon: state.icon.color,
        iconSelected: state.icon.white,
        primaryColor: state.primaryColor,
        isPrimaryColorBright: true,
        list: [],
      };
    });

    layoutMenus.value = [
      {
        key: ListServices.LayoutMode.Grid,
        title: "Grid View",
        icon: IconGrid,
      },
      {
        key: ListServices.LayoutMode.List,
        title: "List View",
        icon: IconList,
      },
      {
        key: ListServices.LayoutMode.Detail,
        title: "Detail View",
        icon: IconDetail,
      },
    ];
    groupMenus.value = [
      { key: ListServices.GroupMode.None, title: "None" },
      { key: ListServices.GroupMode.DateCreated, title: "Date" },
    ];
    sortMenus.value = [
      { key: ListServices.SortMode.DateCreated, title: "Date" },
      { key: ListServices.SortMode.Name, title: "Customer Name" },
      { key: ListServices.SortMode.PhoneNumber, title: "Phone Number" },
    ];

    for (const menu of sortMenus.value) {
      menu.isSelected = () => {
        const state = sortMenus.value[stateMenuIndex.value];
        if (!state) return false;
        return state.key === menu.key;
      };
      menu.click = () => {
        if (currentState.value === menu.key) return;
        useRouteStore().replaceQuery({ query: { state: menu.key } });
      };
    }
    for (const menu of layoutMenus.value) {
      menu.click = (menu) => {
        currentLayoutIndex.value = layoutMenus.value.indexOf(menu);
      };
    }
    for (const menu of groupMenus.value) {
      menu.click = () => {
        currentGroupIndex.value = groupMenus.value.indexOf(menu);
      };
      menu.isSelected = () => {
        return groupMenus.value.indexOf(menu) === currentGroupIndex.value;
      };
    }
    for (const menu of sortMenus.value) {
      menu.click = () => {
        currentSortIndex.value = sortMenus.value.indexOf(menu);
      };
      menu.isSelected = () => {
        return sortMenus.value.indexOf(menu) === currentSortIndex.value;
      };
    }

    invalidateList();
    invalidateState();
  });
</script>

<template>
  <div
    ref="selfRef"
    class="PanelServices"
    @scroll="(e) => (scrollTop = (e.target as HTMLDivElement).scrollTop)"
  >
    <Actionbar
      :class="['PanelServices-actionbar', 'transition']"
      :menus="menus"
      :services="services"
      :stateMenus="stateMenus"
      :layoutMenus="layoutMenus"
      :layoutMenuIndex="currentLayoutIndex"
      :groupMenus="groupMenus"
      :groupMenuIndex="currentGroupIndex"
      :sortMenus="sortMenus"
      :sortMenuIndex="currentSortIndex"
      @click-service="(service) => emits('clickService', service)"
      @click-search="() => emits('clickSearch')"
    />

    <div class="PanelServices-toolbar" v-if="isCurrentStatePending">
      <button @click="() => emits('clickAdd')">Add Service</button>
      <button @click="() => emits('clickImport')" v-if="isCurrentUserAdmin">
        Import Service
      </button>
    </div>

    <ListServices
      v-if="
        stateMenus[stateMenuIndex] && stateMenus[stateMenuIndex].list.length
      "
      :layoutMode="layoutMode"
      :sortMode="sortMode"
      :groupMode="groupMode"
      :items="items"
      :item="currentItem"
      @click-item="(item) => emits('clickService', item)"
    />

    <Empty
      v-if="!items.length && !useServiceStore().isLoading"
      :icon="iconEmpty"
    />
  </div>
</template>

<style lang="scss" scoped>
  .PanelServices {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow-y: auto;
    overflow-x: auto;
    padding-bottom: 4rem;

    --max-width: 60rem;

    .PanelServices-actionbar {
      z-index: 2;
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      flex-grow: 0;
      z-index: 2;
      border-bottom: 1px solid #e4e4e4;
    }
    .PanelServices-toolbar {
      width: 100%;
      max-width: 34rem;
      min-height: 4.5rem;
      padding: 1rem;
      gap: 0.2rem;

      display: flex;
      flex-direction: row;
      align-items: stretch;
      justify-content: space-between;

      & > * {
        border-radius: 1rem;
        background: none;
        background: hsl(0, 0%, 98%);
        border: 1px solid hsl(0, 0%, 75%);
        font-size: 0.7rem;

        cursor: pointer;

        flex-grow: 1;

        transition: all 0.2s;

        &:hover {
          background: white;
        }
      }
    }
  }
</style>
