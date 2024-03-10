<script setup lang="ts">
  import WindowAdd from "./components/WindowAdd.vue";
  import Loading from "@/components/loading/Loading.vue";
  import Actionbar from "./components/Actionbar.vue";
  import SectionOrder from "./components/SectionOrder.vue";
  import { Order } from "@/data/order/Order";
  import { useRoute } from "vue-router";
  import { computed, onMounted, ref, watch } from "vue";
  import { useOrderStore } from "@/data-stores/order.store";
  import { usePopupWindowStore } from "@/stores/popup-window/popup-window.store";
  import { useSnackbarStore } from "@/stores/snackbar/snackbar.store";
  import { optArray } from "@/U";
  import { useRouteStore } from "@/stores/route.store";

  const route = useRoute();

  const display = ref({ showDialogAppendOrder: false });

  const scrollTop = ref(0);
  const pendingItems = ref<Order[]>([]);
  const completedItems = ref<Order[]>([]);

  const isLoading = computed(() => () => useOrderStore().isLoading);
  const items = computed(() => () => optArray(useOrderStore().items));
  const currentExpandedOrderid = computed<string>(() => {
    const { order } = route.query;

    if (typeof order === "string") return order;
    return "";
  });

  watch(() => useOrderStore().lastModified, invalidate);

  onMounted(() => invalidate());

  async function invalidate() {
    pendingItems.value = [];
    completedItems.value = [];

    const groups = await useOrderStore().getGroupsByStatus();
    const groupPending = groups.find((group) => {
      return group.status === Order.Status.Pending;
    });
    const groupCompleted = groups.find((group) => {
      return group.status === Order.Status.Completed;
    });

    pendingItems.value = groupPending?.items ?? [];
    completedItems.value = groupCompleted?.items ?? [];
  }
  function refresh() {
    useOrderStore()
      .refresh()
      .catch((error) => {
        useSnackbarStore().show("Error While Refreshing Order");
        console.error(error);
      });
  }
  function toAdd() {
    usePopupWindowStore().open({ component: WindowAdd });
  }
</script>

<template>
  <div
    class="PageOrder transition"
    @scroll="
      (event) => (scrollTop = (event.target as HTMLDivElement).scrollTop)
    "
  >
    <Actionbar
      class="PageOrder-actionbar"
      :title="$options.title"
      :items="items"
      @click-item="
        (item) => useRouteStore().replaceQuery({ query: { order: item.id } })
      "
      @click-item-add="() => toAdd()"
      @click-refresh="() => refresh()"
    />

    <main>
      <SectionOrder
        class="main-section"
        title="Pending"
        :items="pendingItems"
        :currentItemIdSelected="currentExpandedOrderid"
        @click-collapse="
          (item) => useRouteStore().replaceQuery({ query: { order: null } })
        "
        @click-expand="
          (item) => useRouteStore().replaceQuery({ query: { order: item.id } })
        "
        @click-complete="
          (item) => useOrderStore().updateToCompletedOfId(item.id)
        "
        @click-remove="
          (item) => useOrderStore().removeOItemOfId({ id: item.id })
        "
      />

      <SectionOrder
        class="main-section"
        title="Completed"
        :items="completedItems"
        :currentItemIdSelected="currentExpandedOrderid"
        @click-collapse="
          (item) => useRouteStore().replaceQuery({ query: { order: null } })
        "
        @click-expand="
          (item) => useRouteStore().replaceQuery({ query: { order: item.id } })
        "
        @click-pending="(item) => useOrderStore().updateToPendingOfId(item.id)"
        @click-remove="
          (item) => useOrderStore().removeOItemOfId({ id: item.id })
        "
      />
    </main>

    <Loading class="viewOrder-loading" :isShowing="useOrderStore().isLoading" />
  </div>
</template>

<style lang="scss" scoped>
  .PageOrder {
    --width-max: 550px;

    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-items: stretch;

    overflow-y: auto;
    height: 100%;
    width: 100%;
    padding-bottom: 80px;

    main {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 10px;

      .main-section {
        margin-top: 10px;
        margin-bottom: 20px;
        background: white;
        box-shadow: 0 2px 4px #b5b5b5;
        padding: 10px;
      }
      @media (min-width: 550px) {
        padding-left: 20px;
        padding-right: 20px;
        .main-section {
          border-radius: 1rem;
        }
      }
    }

    .viewOrder-item {
      .viewOrder-item-seperator {
        margin: 4px 0;
        min-width: auto;
        min-height: 0.5px;
        background: hsla(0, 0%, 0%, 0.1);
      }
    }

    .viewOrder-loading {
      position: absolute;
    }
  }
</style>
