<script setup lang="ts">
  import ListEvents from "./EventGroups.vue";
  import Service from "@/data/service/Service";
  import ServiceEvent from "@/data/service/ServiceEvent";
  import { computed } from "vue";
  import { Action } from "./PanelService";

  const emits = defineEmits<{
    clickAddEvent: [void];
    clickRemoveEvent: [ServiceEvent];
  }>();
  const props = defineProps<{ service?: Service; actions: Action }>();

  const events = computed(() => {
    if (!props.service) return [];

    const events = props.service.events
      .map((event) => event)
      .sort((event1, event2) => event1.compare(event2));

    return events;
  });
</script>

<template>
  <div class="PanelEvents">
    <div class="PanelEvents-body">
      <ListEvents
        v-if="events.length"
        :service="service"
        :events="events"
        :actions="actions"
        @click-item-delete="(event) => $emit('clickRemoveEvent', event)"
      />
      <span class="PanelEvents-empty" v-if="!events.length">Empty Events</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .PanelEvents {
    width: 100%;
    z-index: 1;

    flex-grow: 1;

    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-end;

    .PanelEvents-body {
      z-index: 1;
      position: relative;
      padding: 0.8rem;
      padding-bottom: 1rem;

      .PanelEvents-empty {
        padding: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ffffff66;

        font-size: 0.8rem;
        color: #00000080;
      }
    }
  }
</style>
