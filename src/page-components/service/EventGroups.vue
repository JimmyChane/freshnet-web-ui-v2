<script setup lang="ts">
import ItemEvent from './ServiceEvent.vue';
import FloatingTimestampVue from './FloatingTimestamp.vue';
import { Service } from '@/data/Service';
import { format } from 'date-fns';
import { ServiceEvent } from '@/data/ServiceEvent';
import { computed } from 'vue';
import type { Action } from '@/panel-components/service/PanelService.vue';

const props = withDefaults(
  defineProps<{
    service?: Service;
    events: ServiceEvent[];
    actions: Action;
  }>(),
  { events: () => [] },
);

const moreEvents = computed(() => {
  if (!props.service) return [];

  return [...props.service.events].reverse();
});

const groups = computed(() => {
  return moreEvents.value.reduce((groups: { title: string; events: ServiceEvent[] }[], event) => {
    const ts = event.timestamp;
    const time = ts?.time ?? 0;

    const optGroup = (title: string) => {
      let group = groups.find((group) => group.title === title);
      if (!group) groups.push((group = { title, events: [] }));
      return group;
    };
    const putItem = (title: string) => optGroup(title).events.push(event);

    if (ts?.isToday()) {
      putItem(`Today, ${format(time, 'EEE, dd/LL/yyyy')}`);
    } else if (ts?.isYesterday()) {
      putItem(`Yesterday, ${format(time, 'EEE, dd/LL/yyyy')}`);
    } else {
      putItem(format(time, 'EEE, dd/LL/yyyy'));
    }

    return groups;
  }, []);
});
</script>

<template>
  <div class="ListEvents">
    <div class="ListEvents-group" v-for="group of groups" :key="group.title">
      <FloatingTimestampVue
        :style="{ top: '4rem', 'z-index': '3' }"
        v-if="group.title"
        :title="group.title"
      />

      <ItemEvent
        class="ListEvents-group-item"
        v-for="event of group.events"
        :key="event.timestamp?.time"
        :service="service"
        :event="event"
        :actions="actions"
        @callback-delete="(event) => $emit('click-item-delete', event)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ListEvents {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;

  .ListEvents-group {
    width: 100%;
    gap: 0.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    .ListEvents-group-item {
      z-index: 2;
      width: 100%;
    }
  }
}
</style>
