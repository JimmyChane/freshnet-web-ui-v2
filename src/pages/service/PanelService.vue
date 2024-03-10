<script setup lang="ts">
  import Actionbar from "./PanelService-Actionbar.vue";
  import AddEvent from "./PanelService-AddEvent.vue";
  import Events from "./PanelEvents.vue";
  import { ServiceState } from "@/data/service/ServiceState";
  import chroma, { type Color } from "chroma-js";
  import { Service } from "@/data/service/Service";
  import { computed, onMounted, ref, watch } from "vue";
  import type { Action } from "./PanelService";
  import { useSnackbarStore } from "@/stores/snackbar/snackbar.store";
  import { useWindowStore } from "@/stores/window.store";

  const props = defineProps<{
    service?: Service;
    actions: Action;
  }>();

  const nameOfUser = ref("");
  const scrollTop = ref(0);
  const isActionbarExpand = ref(false);

  const windowWidth = computed(() => useWindowStore().innerWidth);

  const isWide = computed(() => windowWidth.value > 600);

  const isUrgent = computed(() => props.service?.isUrgent());
  const isWarranty = computed(() => props.service?.isWarranty());

  const events = computed(() => props.service?.events);

  const customer = computed(() => props.service?.customer);
  const name = computed(() => customer.value?.name);
  const phoneNumber = computed(() => customer.value?.phoneNumber);
  const phoneNumberStr = computed(() => phoneNumber.value?.toString() ?? "");
  const isPhoneNumber = computed(() => !!phoneNumberStr.value);

  const description = computed(() => props.service?.description);
  const belongings = computed(
    () => props.service?.belongings.map((belonging) => belonging),
  );
  const imageFiles = computed(() => props.service?.imageFiles);

  const primaryColor = computed<Color>(() => stateColor.value);
  const stateColor = computed<Color>((c) => {
    if (!props.service) return chroma("white");

    const state = ServiceState.findByKey(props.service.state);
    return chroma(state?.primaryColor ?? "white");
  });
  const backgroundColor = computed(() => {
    if (!primaryColor.value) return chroma("white");
    return chroma(primaryColor.value).mix("e6e6e6", 0.9);
  });
  const actionbarColor = computed(() => {
    if (!backgroundColor.value) return "inherit";
    return backgroundColor.value.brighten(0.4);
  });
  const actionbarBorder = computed(() => {
    if (!actionbarColor.value) return "none";
    return chroma(actionbarColor.value).darken(0.8);
  });

  watch(() => props.service, invalidate);
  watch(
    () => events.value,
    () => {
      setTimeout(() => scrollDown(), 200);
    },
  );

  const scroll = ref();
  const addEvent = ref();

  async function invalidate() {
    isActionbarExpand.value = false;
    nameOfUser.value = await getOwnerNameFromItem();

    scrollDown();
  }
  function scrollDown() {
    if (!scroll.value || !addEvent.value) return;

    const element = addEvent.value.$el;
    const rect = element.getBoundingClientRect();

    scroll.value.scrollTop = rect.bottom;
  }
  async function getOwnerNameFromItem() {
    const service = props.service;

    if (!service) return "";

    const name = await service.fetchName().catch((error) => {
      useSnackbarStore().show("Error getting user for service");
      return "";
    });

    if (service !== props.service) return "";
    if (name.length) return name;

    return "unknown";
  }

  onMounted(() => invalidate());
</script>

<template>
  <div class="PanelService">
    <div
      class="PanelService-block"
      :style="{ 'z-index': '2', 'grid-area': 'block' }"
      :isActionbarExpand="`${isActionbarExpand}`"
      @click="() => (isActionbarExpand = !isActionbarExpand)"
    ></div>

    <div
      ref="scroll"
      class="PanelService-scroll"
      :style="{ '--primary-color': backgroundColor.toString() }"
      @scroll="(e) => (scrollTop = (e.target as HTMLDivElement).scrollTop)"
    >
      <Actionbar
        :style="{ 'z-index': '2', 'grid-area': 'actionbar' }"
        :service="service"
        :actionbarColor="actionbarColor.toString()"
        :actionbarBorder="actionbarBorder.toString()"
        :actions="actions"
        :isExpand="isActionbarExpand"
        @toggle-expand="(isExpand) => (isActionbarExpand = isExpand)"
      />

      <div class="PanelService-body" :style="{ 'z-index': '1' }">
        <Events
          :style="{ 'z-index': '1' }"
          :service="service"
          :actions="actions"
          @click-remove-event="
            (event) => actions.onClickRemoveEvent({ service, event })
          "
        />
        <AddEvent
          ref="addEvent"
          :style="{ 'z-index': '2' }"
          @click-submit="(event) => actions.onClickToAddEvent(event)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .PanelService {
    position: relative;
    overflow: hidden;

    width: 100dvw;
    height: 100%;
    max-width: 100%;
    min-width: 100%;

    display: flex;
  }

  .PanelService-block[isActionbarExpand="false"] {
    background: transparent;
    pointer-events: none;
  }
  .PanelService-block[isActionbarExpand="true"] {
    background: hsla(0, 0%, 0%, 0.4);
  }
  .PanelService-block {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: all 200ms cubic-bezier(1, 0, 0, 1);
  }

  .PanelService-scroll {
    width: 100%;
    min-height: 100%;
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    line-height: 1.2;
    overflow-y: auto;

    background: var(--primary-color);

    .PanelService-body {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-end;
      flex-grow: 1;
    }
  }
</style>
