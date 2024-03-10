<script setup lang="ts">
  import Actionbar from "./PanelCustomers-Actionbar.vue";
  import ItemCustomer from "./ItemCustomer.vue";
  import Empty from "@/components/Empty.vue";
  import PageCustomer from "@/pages/customer/PageCustomer.vue";
  import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
  import { computed, ref } from "vue";
  import { Customer } from "@/data/customer/Customer";
  import { useRoute } from "vue-router";
  import { useCustomerStore } from "@/data-stores/customer.store";
  import { optString } from "@/U";

  const emits = defineEmits<{
    clickRefresh: [void];
    clickItemAdd: [void];
    clickItemRemove: [void];
  }>();
  const props = withDefaults(
    defineProps<{
      title?: string;
      items?: Customer[];
      itemSelected?: Customer;
    }>(),
    { title: "", items: () => [] },
  );

  const scrollTop = ref(0);
  const itemSelect = ref<Customer>();

  const iconEmpty = computed(() => PageCustomer.icon.dark.toUrl());
  const filter = computed(() => optString(useRoute().query.filter));

  const listService = computed(() =>
    props.items.filter((item) => item.services.length),
  );
  const listOrder = computed(() =>
    props.items.filter((item) => item.orders.length),
  );
  const list = computed(() => {
    switch (filter.value) {
      case "service":
        return listService.value;
      case "order":
        return listOrder.value;
      default:
        return props.items;
    }
  });
  const myList = computed(() => {
    return list.value.map((item) => {
      return { id: itemKey(item), item };
    });
  });

  function itemKey(item: Customer) {
    return `${itemName(item)}${itemPhoneNumberValue(item)}`;
  }
  function itemName(item: Customer) {
    return optString(item?.name);
  }
  function itemPhoneNumberValue(item: Customer) {
    return item?.phoneNumber?.value ?? "";
  }

  function onScroll(e: Event) {
    const target = e.target as HTMLDivElement | undefined;
    scrollTop.value = target?.scrollTop ?? 0;
  }
</script>

<template>
  <div class="PanelCustomers" @scroll="onScroll">
    <Actionbar
      class="PanelCustomers-top"
      :title="title"
      :items="items"
      @click-item-add="() => $emit('click-item-add')"
      @click-refresh="() => $emit('click-refresh')"
    />

    <DynamicScroller
      class="PanelCustomers-body"
      :items="myList"
      :min-item-size="90"
    >
      <template v-slot="{ item, index, active }">
        <DynamicScrollerItem :item="item" :data-index="index" :active="active">
          <div class="PanelCustomers-item-div">
            <router-link
              class="PanelCustomers-item"
              :to="{
                query: {
                  name: itemName(item.item),
                  phoneNumber: itemPhoneNumberValue(item.item),
                },
              }"
            >
              <ItemCustomer
                :item="item.item"
                :selected="item.item === itemSelected"
                @click-remove="
                  (param) => $emit('click-item-remove', { item: item.item })
                "
              />
            </router-link>
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>

    <Empty
      v-if="!list.length && !useCustomerStore().isLoading"
      :icon="iconEmpty"
    />
  </div>
</template>

<style lang="scss" scoped>
  .PanelCustomers {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;

    .PanelCustomers-top {
      z-index: 2;
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
    }
    .PanelCustomers-body {
      --gap: 4px;

      z-index: 1;
      padding: calc(1rem - var(--gap) * 0.5) 1rem;
      padding-bottom: 10rem;
      display: flex;
      flex-direction: column;
      align-items: center;

      .PanelCustomers-item-div {
        display: flex;
        padding: calc(var(--gap) * 0.5) 0;
      }
      .PanelCustomers-item {
        margin: 0 auto;
        width: 100%;
        max-width: 35rem;
        max-width: 25rem;

        text-decoration: none;
        font-size: 1rem;
        color: inherit;
        overflow: hidden;
      }
    }
  }
</style>
@/stores/data-stores/customer.store
