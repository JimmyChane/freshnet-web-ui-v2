<script setup lang="ts">
  import { optArray } from "@/U";
  import BelongingListEditItem from "./BelongingListEdit-Item.vue";
  import ServiceBelonging, {
    ServiceBelongingData,
  } from "@/data/service/ServiceBelonging";
  import { onMounted, ref, watch } from "vue";

  const TimeGetter = {
    lastNowTime: 0,
    getTimeNow() {
      let timeNow = Date.now();
      while (timeNow <= this.lastNowTime) timeNow++;
      this.lastNowTime = timeNow;
      return timeNow;
    },
  };

  function getNewBelongingTemplate(): ServiceBelongingData {
    const data = new ServiceBelonging().toData();
    data.quantity = 0;
    data.time = TimeGetter.getTimeNow();

    return data;
  }
  function isBelongingEmpty(data: ServiceBelongingData) {
    return data.title?.trim() === "" && (data?.quantity ?? 0) <= 0;
  }

  const props = withDefaults(
    defineProps<{ values: ServiceBelongingData[] }>(),
    {
      values: () => [],
    },
  );

  const belongings = ref<ServiceBelongingData[]>([]);

  watch(() => props.values, onReset);

  function onReset() {
    const values = optArray(props.values).map((value) => {
      const data = new ServiceBelonging().fromData(value).toData();
      data.time = TimeGetter.getTimeNow();

      return data;
    });

    belongings.value = [...values, getNewBelongingTemplate()];
  }

  function onInput() {
    let emptyBelongings = belongings.value.filter((belonging) => {
      return isBelongingEmpty(belonging);
    });

    if (emptyBelongings.length === 0) {
      belongings.value.push(getNewBelongingTemplate());
    } else if (emptyBelongings.length === 1) {
    } else {
      while (emptyBelongings.length > 1) {
        let remove = emptyBelongings.pop();
        if (remove !== undefined) {
          let indexRemove = belongings.value.indexOf(remove);
          if (indexRemove !== belongings.value.length - 1) {
            belongings.value.splice(belongings.value.indexOf(remove), 1);
          }
        }
      }
    }

    const last = belongings.value[belongings.value.length - 1];
    if (!isBelongingEmpty(last)) {
      belongings.value.push(getNewBelongingTemplate());
    }
  }

  function getResults() {
    const results = belongings.value.filter((belonging) => {
      if (belonging.time === 0) belonging.time = TimeGetter.getTimeNow();

      return belonging.title?.trim() && belonging.quantity;
    });

    return results;
  }

  function focus() {}

  onMounted(() => onReset());
</script>

<template>
  <div class="BelongingListEdit-list">
    <BelongingListEditItem
      v-for="belonging in belongings"
      :key="belonging.time"
      :belongings="belongings"
      :belonging="belonging"
      @invalidate="() => onInput()"
    />
  </div>
</template>

<style lang="scss" scoped>
  .BelongingListEdit-list {
    display: flex;
    flex-direction: column;
    row-gap: 0.4rem;
    gap: 0.2rem;
  }
</style>
