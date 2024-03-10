<script setup lang="ts">
  import ItemButton from "@/pages/manage/PanelItems-ItemButton.vue";
  import LabelCount from "@/components/LabelCount.vue";
  import ImageView from "@/components/ImageView.vue";

  import ServicePrice from "@/data/service/ServicePrice";
  import State from "@/data/service/ServiceState";

  import ItemServiceCustomer from "./ItemService-Customer.vue";
  import ItemServiceTimestamp from "./ItemService-Timestamp.vue";
  import ItemServiceDetailColumn from "./ItemService-DetailColumn.vue";

  import IconImage from "@/assets/icon/image-FFFFFF.svg";
  import Service from "@/data/service/Service";
  import { computed } from "vue";
  import { Mode } from "./ItemServiceMode";
  import { optArray } from "@/U";

  const emits = defineEmits<{ click: [void] }>();
  const props = withDefaults(
    defineProps<{
      mode?: number;
      item?: Service;
      isSelected?: boolean;
      detailProperties?: { key: string; width: number }[];
      headerCustomer?: boolean;
    }>(),
    {
      mode: Mode.List,
      isSelected: false,
      detailProperties: () => [],
      headerCustomer: true,
    },
  );

  const isGrid = computed(() => props.mode === Mode.Grid);
  const isList = computed(() => props.mode === Mode.List);
  const isDetail = computed(() => props.mode === Mode.Detail);

  const customer = computed(() => props.item?.customer);
  const name = computed(() => customer.value?.name);
  const phoneNumber = computed(() => customer.value?.phoneNumber);
  const phoneNumberStr = computed(() => phoneNumber.value?.toString() ?? "");
  const description = computed(() => props.item?.description);
  const images = computed(() => props.item?.imageFiles ?? []);
  const isUrgent = computed(() => props.item?.isUrgent());
  const isWarranty = computed(() => props.item?.isWarranty());
  const totalCostAmount = computed(() => totalCost.value?.amount ?? 0);
  const totalQuoteAmount = computed(() => totalQuote.value?.amount ?? 0);
  const timestamp = computed(() => props.item?.timestamp);
  const state = computed(() => props.item?.state);
  const primaryColor = computed(() =>
    state.value ? State.findByKey(state.value)?.primaryColor : undefined,
  );

  const events = computed(() => {
    return optArray(props.item?.events)
      .map((event) => event)
      .sort((event1, event2) => event1.compare(event2));
  });
  const totalCost = computed(() => {
    return events.value.reduce((cost, event) => {
      if (event.isPurchase() && event.price) {
        return cost.plus(event.price);
      }
      return cost;
    }, new ServicePrice().fromData({ amount: 0 }));
  });
  const totalQuote = computed(() => {
    return events.value.reduce((cost, event) => {
      if (event.isQuotation() && event.price) {
        return cost.plus(event.price);
      }
      return cost;
    }, new ServicePrice().fromData({ amount: 0 }));
  });
  const labels = computed(() => {
    const labels = [];

    if (isUrgent.value) {
      labels.push({
        key: "urgent",
        title: "Urgent",
        primaryColor: "#d93f35",
      });
    }
    if (isWarranty.value) {
      labels.push({
        key: "warranty",
        title: "Warranty",
        primaryColor: "#db950c",
      });
    }
    if (totalCostAmount.value !== 0) {
      labels.push({
        key: `price${totalCost.value.toString()}`,
        title: totalCost.value.toString(),
        primaryColor: "#258915",
      });
    }
    if (totalQuoteAmount.value !== 0) {
      labels.push({
        key: `quotation${totalQuote.value.toString()}`,
        title: totalQuote.value.toString(),
        primaryColor: "#961d96",
      });
    }
    if (events.value.length) {
      labels.push({
        key: "event",
        title: "Event",
        count: events.value.length,
        primaryColor: "#294656",
      });
    }
    if (images.value.length) {
      labels.push({
        key: "images",
        icon: IconImage,
        count: images.value.length,
        primaryColor: "#8C623A",
      });
    }

    return labels;
  });

  const classes = computed(() => {
    if (isGrid.value) return ["ItemService-isGrid"];
    if (isList.value) return ["ItemService-isList"];
    if (isDetail.value) return ["ItemService-isDetail"];
    return [];
  });

  function getPropertyByKey(key: string): { width: number } | undefined {
    return props.detailProperties.find((property) => {
      return property.key === key;
    });
  }
</script>

<template>
  <ItemButton
    :class="['ItemService', ...classes]"
    :style="{ '--primary-color': primaryColor }"
    :isSelected="isSelected"
    @click="$emit('click', item)"
  >
    <div v-if="isGrid" :class="['transition', 'ItemService-body']">
      <div class="ItemService-top">
        <ItemServiceCustomer
          v-if="headerCustomer"
          :name="name"
          :phoneNumberStr="phoneNumberStr"
        />

        <div class="ItemService-state-dot"></div>
      </div>
      <div class="ItemService-middle">
        <ImageView
          class="ItemService-image"
          v-for="image of images"
          :key="image.name"
          :src="image"
        />
      </div>
      <div class="ItemService-bottom">
        <ItemServiceTimestamp class="ItemService-timestamp" :service="item" />
      </div>
    </div>

    <div v-if="isList" :class="['transition', 'ItemService-body']">
      <div class="ItemService-top">
        <ItemServiceTimestamp
          class="ItemService-timestamp"
          :service="item"
          :line="1"
        />
        <ItemServiceCustomer
          class="ItemService-customer"
          v-if="headerCustomer"
          :name="name"
          :phoneNumberStr="phoneNumberStr"
        />
      </div>
      <div class="ItemService-bottom">
        <span class="ItemService-description">{{ description }}</span>
        <div class="ItemService-labels">
          <LabelCount
            class="ItemService-label"
            v-for="label of labels"
            :key="label.key"
            :style="{ '--primary-color': label.primaryColor }"
            :title="label.title"
            :icon="label.icon"
            :count="label.count"
          />
        </div>
      </div>
    </div>

    <div v-if="isDetail" :class="['transition', 'ItemService-body']">
      <ItemServiceDetailColumn :width="getPropertyByKey('customerName')?.width">
        {{ name }}
      </ItemServiceDetailColumn>
      <ItemServiceDetailColumn
        :width="getPropertyByKey('customerPhoneNumber')?.width"
      >
        {{ phoneNumberStr }}
      </ItemServiceDetailColumn>
      <ItemServiceDetailColumn :width="getPropertyByKey('description')?.width">
        {{ description }}
      </ItemServiceDetailColumn>
      <ItemServiceDetailColumn :width="getPropertyByKey('images')?.width">
        Images x{{ images.length }}
      </ItemServiceDetailColumn>
      <ItemServiceDetailColumn :width="getPropertyByKey('notice')?.width">
        <LabelCount
          class="ItemService-label"
          v-for="label of labels"
          :key="label.key"
          :style="{ '--primary-color': label.primaryColor }"
          :title="label.title"
          :icon="label.icon"
          :count="label.count"
        />
      </ItemServiceDetailColumn>
      <ItemServiceDetailColumn :width="getPropertyByKey('timestamp')?.width">
        <ItemServiceTimestamp class="ItemService-timestamp" :service="item" />
      </ItemServiceDetailColumn>
    </div>
  </ItemButton>
</template>

<style lang="scss" scoped>
  .ItemService-top {
    padding: 0.6rem;
    margin-right: 0.6em;
    border-bottom: 0.05em solid hsla(0, 0%, 0%, 0.1);
    display: flex;
    flex-direction: row;
    align-items: center;

    .ItemService-state-dot {
      --size: 0.5em;
      min-width: var(--size);
      min-height: var(--size);
      width: var(--size);
      height: var(--size);
      background: var(--primary-color);
      border-radius: var(--size);
    }
  }

  .ItemService {
    width: initial;
    background: white;
  }

  .ItemService-isGrid {
    .ItemService-body {
      width: 100%;
      height: 100%;
      font-weight: 400;
      font-size: 1em;
      color: black;
      text-align: start;
      line-height: 1.1;
      gap: 0.5rem;
      padding: 0.6rem 0.2rem;

      display: flex;
      flex-direction: column;
      align-items: stretch;
      border-radius: 0 0.5em 0.5em 0;
      border: 0.1em solid transparent;

      .ItemService-top {
        padding: 0;
        padding-bottom: 0.6rem;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .ItemService-middle {
        gap: 0.2em;

        flex-grow: 1;
        overflow: hidden;

        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: flex-start;

        .ItemService-image {
          --size: 2.5rem;
          width: var(--size);
          height: var(--size);
          border-radius: 0.4rem;
        }
      }
      .ItemService-bottom {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: flex-start;
        gap: 1rem;
        .ItemService-timestamp {
          text-align: start;
        }
      }
    }
  }
  .ItemService-isList {
    .ItemService-body {
      height: 100%;
      width: 100%;

      font-weight: 400;
      font-size: 1em;
      color: black;
      text-align: start;

      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      border-radius: 0.5em;
      border: 0.1em solid transparent;

      padding: 0.8rem;

      .ItemService-top {
        width: 100%;
        padding: 0;
        padding-bottom: 0.8rem;
        padding-left: 0.3rem;
        gap: 0.5rem;

        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .ItemService-timestamp {
          text-align: start;
          padding: 0;
          font-weight: 400;
          font-size: 0.7rem;
        }
        .ItemService-customer {
          padding: 0;
        }
      }
      .ItemService-bottom {
        height: 100%;
        width: 100%;
        font-size: 0.8rem;
        gap: 0.5rem;
        padding: 0;
        padding-left: 0;
        padding-top: 0.8rem;

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-end;
        flex-wrap: nowrap;

        .ItemService-description {
          padding: 0;

          display: flex;
          align-items: flex-start;
          white-space: pre-line;
          text-overflow: ellipsis;
          word-wrap: break-word;
          overflow: hidden;
          max-height: 2.2em;
          line-height: 1.1em;
          flex-grow: 1;
        }
        .ItemService-labels {
          gap: 0.1rem;
          padding: 0;
          flex-grow: 1;
          overflow: hidden;

          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: nowrap;

          .ItemService-label {
            border-radius: 0.5rem;
            padding: 0.4rem;
          }
        }
      }
    }
  }
  .ItemService-isDetail {
    border-radius: 0;
    .ItemService-body {
      height: 100%;
      gap: 0.5rem;
      padding: 0.3rem;

      font-weight: 400;
      font-size: 1rem;
      color: black;
      text-align: start;
      line-height: 1.1;
      border-radius: 0 0.5em 0.5em 0;
      border-radius: 0.5em;
      border: 0.1em solid transparent;

      display: flex;
      flex-direction: row;
      align-items: flex-start;

      .ItemService-timestamp {
        text-align: start;
        color: inherit;
      }
    }
  }
</style>
