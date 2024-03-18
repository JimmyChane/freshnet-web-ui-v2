<script setup lang="ts">
  import FloatingTimestamp from "./FloatingTimestamp.vue";
  import { format } from "date-fns";
  import { SortMode, GroupMode } from "./ListServicesOption";
  import { Service } from "@/data/service/Service";
  import { computed, ref, watch } from "vue";
  import { useWindowStore } from "@/stores/window.store";
  import { Mode } from "../item-service/ItemServiceMode";
  import ItemService from "../item-service/ItemService.vue";

  const emits = defineEmits<{ clickItem: [Service] }>();
  const props = withDefaults(
    defineProps<{
      layoutMode?: number;
      sortMode?: number;
      groupMode?: number;

      items?: Service[];
      item?: Service;
    }>(),
    {
      layoutMode: Mode.List,
      sortMode: SortMode.DateCreated,
      groupMode: GroupMode.DateCreated,
      items: () => [],
    },
  );

  const detailProperties = ref([
    { key: "customerName", width: 128 },
    { key: "customerPhoneNumber", width: 112 },
    { key: "description", width: 224 },
    { key: "images", width: 80 },
    { key: "notice", width: 220 },
    { key: "timestamp", width: 176 },
  ]);
  const itemSelected = ref<Service>();

  const isOver460px = computed(() => useWindowStore().innerWidth > 460);

  const isGridView = computed(() => props.layoutMode === Mode.Grid);
  const isListView = computed(() => props.layoutMode === Mode.List);
  const isDetailView = computed(() => props.layoutMode === Mode.Detail);

  const viewMode = computed(() => {
    switch (props.layoutMode) {
      case Mode.Grid:
        return "grid";
      case Mode.List:
        return "list";
      case Mode.Detail:
        return "detail";
      default:
        "";
    }
  });

  const isSortDateCreated = computed(
    () => props.sortMode === SortMode.DateCreated,
  );
  const isSortName = computed(() => props.sortMode === SortMode.Name);
  const isSortPhoneNumber = computed(
    () => props.sortMode === SortMode.PhoneNumber,
  );
  const isSortPrice = computed(() => props.sortMode === SortMode.Price);

  const sortedItems = computed(() => {
    if (isSortDateCreated.value)
      return props.items.sort((item1, item2) => {
        return item1.compareTimestamp(item2);
      });
    if (isSortName.value)
      return props.items.sort((item1, item2) => {
        if (!item1.customer || !item2.customer) return 0;
        return item1.customer.compareName(item2.customer);
      });
    if (isSortPhoneNumber.value)
      return props.items.sort((item1, item2) => {
        if (!item1.customer || !item2.customer) return 0;
        return item1.customer.comparePhoneNumber(item2.customer);
      });

    return props.items;
  });

  const groups = computed<{ title: string; items: Service[] }[]>(() => {
    const groups =
      props.groupMode === GroupMode.DateCreated
        ? groupsOfDate(props.items)
        : [{ title: "", items: props.items }];

    for (const group of groups) sortItems(group.items);

    return groups;
  });

  watch(
    () => props.item,
    () => {
      if (!props.item) {
        setTimeout(() => {
          itemSelected.value = props.item;
        }, 500);
      } else {
        itemSelected.value = props.item;
      }
    },
  );

  function groupsOfDate(
    items: Service[],
  ): { title: string; items: Service[] }[] {
    return items.reduce(
      (groups: { title: string; items: Service[] }[], item) => {
        const ts = item.timestamp;
        const time = ts?.time ?? 0;

        const optGroup = (title: string) => {
          let group = groups.find((group) => group.title === title);
          if (!group) groups.push((group = { title, items: [] }));
          return group;
        };
        const putItem = (title: string) => optGroup(title).items.push(item);

        if (ts?.isToday()) {
          putItem(`Today, ${format(time, "EEE, dd/LL/yyyy")}`);
        } else if (ts?.isYesterday()) {
          putItem(`Yesterday, ${format(time, "EEE, dd/LL/yyyy")}`);
        } else {
          putItem(format(time, "EEE, dd/LL/yyyy"));
        }

        return groups;
      },
      [],
    );
  }
  function sortItems(items: Service[]) {
    if (isSortDateCreated.value)
      return items.sort((item1, item2) => {
        return item1.compareTimestamp(item2);
      });
    if (isSortName.value)
      return items.sort((item1, item2) => {
        if (!item1.customer || !item2.customer) return 0;
        return item1.customer.compareName(item2.customer);
      });
    if (isSortPhoneNumber.value)
      return items.sort((item1, item2) => {
        if (!item1.customer || !item2.customer) return 0;
        return item1.customer.comparePhoneNumber(item2.customer);
      });

    return items;
  }

  function isItemSelected(item: Service) {
    return item === itemSelected.value;
  }
  function clickItem(item: Service) {
    emits("clickItem", item);
  }

  function getPropertyByKey(key: string) {
    return detailProperties.value.find((property) => {
      return property.key === key;
    });
  }
</script>

<template>
  <div class="ListServices">
    <div
      class="ListServices-group"
      :viewMode="viewMode"
      v-for="(group, index) in groups"
      :key="group.title"
    >
      <FloatingTimestamp
        class="ListServices-group-title"
        v-if="group.title"
        :title="group.title"
      />

      <div class="ListServices-items">
        <div
          class="ListServices-items-header"
          v-if="isDetailView && index === 0"
        >
          <span
            class="Property-customerName"
            :style="{
              '--width': `${getPropertyByKey('customerName')?.width}px`,
            }"
            >Customer Name</span
          >
          <span
            class="Property-customerPhoneNumber"
            :style="{
              '--width': `${getPropertyByKey('customerPhoneNumber')?.width}px`,
            }"
            >Customer Phone Number</span
          >
          <span
            class="Property-description"
            :style="{
              '--width': `${getPropertyByKey('description')?.width}px`,
            }"
            >Description</span
          >
          <span
            class="Property-images"
            :style="{
              '--width': `${getPropertyByKey('images')?.width}px`,
            }"
            >Images</span
          >
          <span
            class="Property-notice"
            :style="{
              '--width': `${getPropertyByKey('notice')?.width}px`,
            }"
            >Notice</span
          >
          <span
            class="Property-timestamp"
            :style="{
              '--width': `${getPropertyByKey('timestamp')?.width}px`,
            }"
            >Date Created</span
          >
        </div>

        <ItemService
          class="ListServices-item"
          v-for="item in group.items"
          :mode="layoutMode"
          :key="`service${item.id}`"
          :item="item"
          :isSelected="isItemSelected(item)"
          :detailProperties="detailProperties"
          @click="() => clickItem(item)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .ListServices {
    z-index: 1;
    scroll-padding-top: 33%;
    gap: 1rem;

    width: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: center;
    padding: 1rem;
    padding-top: 0.8rem;

    .ListServices-group {
      width: 100%;
      gap: 0.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;

      .ListServices-group-title {
        z-index: 1;
        top: 7.5rem;
      }

      .ListServices-items {
        width: 100%;
        .PanelService-items-title {
          background: hsla(0, 0%, 0%, 0.04);
          border-radius: 0.4rem;
          padding: 0.3rem 0.5rem;
        }
      }
    }

    .ListServices-group[viewMode="grid"] {
      .ListServices-items {
        max-width: var(--max-width);
        gap: 0.1rem;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));

        .ListServices-items-header {
          grid-column: 1 / -1;
        }
        .ListServices-item {
          width: 100%;
          aspect-ratio: 1/1;
        }
      }
    }
    .ListServices-group[viewMode="list"] {
      .ListServices-items {
        gap: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;

        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));

        .ListServices-item {
          width: 100%;
        }
      }
    }
    .ListServices-group[viewMode="detail"] {
      align-items: flex-start;
      .ListServices-group-title {
        left: 1rem;
      }
      .ListServices-items {
        width: max-content;

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;

        border-radius: 0.5rem;
        overflow: hidden;

        .ListServices-items-header {
          gap: 0.5rem;
          padding: 1rem 0.6rem;

          display: flex;
          flex-direction: row;

          & > * {
            --width: 2rem;
            height: 1.1rem;
            white-space: pre-line;
            text-overflow: ellipsis;
            word-wrap: break-word;
            overflow: hidden;
          }

          .Property-customerName {
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);
          }

          .Property-customerPhoneNumber {
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);
          }

          .Property-description {
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);
          }

          .Property-images {
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);
          }

          .Property-notice {
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);
          }

          .Property-timestamp {
            width: var(--width);
            min-width: var(--width);
            max-width: var(--width);
          }
        }
      }
    }
  }
</style>
