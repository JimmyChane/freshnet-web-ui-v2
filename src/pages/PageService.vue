<script setup lang="ts">
import Loading from '@/components/loading/Loading.vue';
import PanelServices from '@/panel-components/service/PanelServices.vue';
import PanelService, { type Action } from '@/panel-components/service/PanelService.vue';
import WindowSearch from '@/dialog-components/service/WindowSearch.vue';
import WindowImportService from '@/dialog-components/service/WindowImportService.vue';
import WindowAddService from '@/dialog-components/service/WindowAddService.vue';
import WindowUpdateDescription from '@/dialog-components/service/WindowUpdateDescription.vue';
import WindowUpdateBelonging from '@/dialog-components/service/WindowUpdateBelonging.vue';
import WindowUpdateCustomer from '@/dialog-components/service/WindowUpdateCustomer.vue';
import PanelRight from '@/components/panel/PanelRight.vue';
import IconRefresh from '@/assets/icon/refresh-000000.svg';
import { computed, onMounted, ref, watch } from 'vue';
import { useLoginStore } from '@/stores/login.store';
import { useServiceStore } from '@/data-stores/service.store';
import { useRoute } from 'vue-router';
import { Service } from '@/data/Service';
import type { Menu } from '@/stores/popup-menu/PopupMenu';
import { useSnackbarStore } from '@/stores/snackbar/snackbar.store';
import { usePopupWindowStore } from '@/stores/popup-window/popup-window.store';
import { useRouteStore } from '@/stores/route.store';
import { useImageViewerStore } from '@/stores/image-viewer.store';
import { ServiceCustomer } from '@/data/ServiceCustomer';
import { ServiceBelonging } from '@/data/ServiceBelonging';
import { ServiceImage } from '@/data/ServiceImage';
import { ServiceEvent } from '@/data/ServiceEvent';

const route = useRoute();

const actions = ref<Action>({
  onClickClose: () => clickService(undefined),
  onClickRemove: (service) => clickRemoveService(service),
  onClickToAddEvent: (event) => {
    useServiceStore()
      .addEventToId({ serviceID: currentService.value.id, data: event })
      .catch((error) => {
        useSnackbarStore().show('Failed to create an event');
        throw error;
      });
  },
  onClickRemoveEvent: (data) => cllickRemoveServiceEvent(data.event),
  onClickRemoveImage: (image) => clickRemoveServiceImage(image),
  onClickUpdateCustomer: (customer) => clickEditServiceCustomer(customer),
  onClickUpdateDescription: (description) => clickEditServiceDescritpion(description),
  onClickUpdateBelongings: (belongings) => clickEditServiceBelongings(belongings),
});
const panelListened = ref({ isWide: false });
const items = ref<Service[]>();

const currentService = ref();
const drawerService = ref();

const actionMenus = computed<Menu[]>(() => {
  return [
    {
      key: 'refresh',
      title: 'Refresh',
      icon: IconRefresh,
      click: () => clickRefresh(),
    },
  ];
});

const lastModified = computed(() => useServiceStore().lastModified);
const currentServiceId = computed(() => route.query.service);

watch(() => lastModified.value, invalidate);
watch(() => currentServiceId.value, invalidate);

async function invalidate() {
  const xItems = await useServiceStore().getItems();
  for (const item of xItems) {
    item.events.sort((event1, event2) => event1.compare(event2));
  }
  xItems.sort((item1, item2) => item1.compare(item2));

  items.value = xItems;

  await useLoginStore().refresh();
  await invalidateServiceId();
}
async function invalidateServiceId() {
  currentService.value = undefined;

  if (typeof currentServiceId.value !== 'string') return;

  const service = await useServiceStore().getItemOfId(currentServiceId.value);

  if (!service) {
    clickService(undefined);
    return;
  }

  if (currentServiceId.value === service.id) {
    updateServiceUI(service);
  }
}

function updateServiceUI(service?: Service) {
  const hasNextService = !!service;

  currentService.value = service;
  if (hasNextService) {
    drawerService.value = service;
  } else {
    setTimeout(() => (drawerService.value = service), 700);
  }
}

function clickRefresh() {
  useServiceStore().refresh();
}
function clickAddService() {
  usePopupWindowStore().open({
    component: WindowAddService,
    data: {
      onConfirm: async (accept, reject, data) => {
        try {
          const result = await useServiceStore().addItem({ data });

          result ? accept() : reject();
          clickService(result);
        } catch (error) {
          useSnackbarStore().show('Failed to create a service');
          reject();
          throw error;
        }
      },
    },
  });
}
function clickImportService() {
  usePopupWindowStore().open({
    component: WindowImportService,
    data: {
      showService: (service: Service) => clickService(service),
    },
  });
}
function clickService(service?: Service) {
  const hasPreviousSerivce = !!currentService.value;
  const hasNextService = !!service;
  const query = { service: service?.id ?? null };

  if (hasPreviousSerivce && hasNextService) {
    useRouteStore().replaceQuery({ query });
  } else {
    useRouteStore().nextQuery({ query });
  }

  updateServiceUI(service);
}
function clickSearch() {
  usePopupWindowStore().open({
    component: WindowSearch,
    data: {
      items: items.value,
      clickItem: (service) => {
        clickService(service);
      },
    },
  });
}

function clickRemoveService(service: Service) {
  usePopupWindowStore().openWindowRemove({
    title: 'Delete Service',
    message: 'After deleting this service, it cannot be reverted.',
    data: service,
    onConfirm: async (accept, reject) => {
      try {
        await useServiceStore().removeItemOfId({ id: service.id });
        accept();
        if (currentServiceId.value === service.id) {
          useRouteStore().replaceQuery({ query: { service: null } });
        }
      } catch (error) {
        useSnackbarStore().show('Delete Failed');
        reject();
        throw error;
      }
    },
  });
}
function cllickRemoveServiceEvent(data: { service?: Service; event: ServiceEvent }) {
  const popupWindow = usePopupWindowStore().openWindowRemove({
    title: 'Delete Event',
    message: 'After deleting this event, it cannot be reverted.',
    data,
    onConfirm: async () => {
      await useServiceStore().removeEventFromId({
        serviceID: data.service?.id ?? '',
        time: data.event.timestamp?.time ?? 0,
      });
      popupWindow.close();
    },
  });
}
function clickRemoveServiceImage(image: ServiceImage) {
  const popupWindow = usePopupWindowStore().openWindowRemove({
    title: 'Delete Image',
    message: 'After deleting this image, it cannot be reverted.',
    data: image,
    onConfirm: async () => {
      try {
        await useServiceStore().removeImageFromId({
          serviceID: currentService.value.id,
          image,
        });
        useImageViewerStore().close();
        popupWindow.close();
      } catch (error) {
        useSnackbarStore().show('Delete Image Failed');
        throw error;
      }
    },
  });
}

function clickEditServiceDescritpion(description: string) {
  type OnConfirm = (accept: () => void, reject: () => void, description: string) => void;

  type Data = { description: string; onConfirm: OnConfirm };

  usePopupWindowStore().open<Data>({
    component: WindowUpdateDescription,
    data: {
      description,
      onConfirm: async (accept, reject, description) => {
        try {
          await useServiceStore().updateDescriptionOfId({
            serviceID: currentService.value.id,
            description,
          });
          accept();
        } catch (error) {
          useSnackbarStore().show('Update Description Failed');
          reject();
          throw error;
        }
      },
    },
  });
}
function clickEditServiceBelongings(belongings: ServiceBelonging[]) {
  type OnConfirm = (accept: () => void, reject: () => void, belongings: ServiceBelonging[]) => void;

  type Data = { belongings: ServiceBelonging[]; onConfirm: OnConfirm };

  usePopupWindowStore().open<Data>({
    component: WindowUpdateBelonging,
    data: {
      belongings,
      onConfirm: async (accept, reject, belongings) => {
        try {
          await useServiceStore().updateBelongingsOfId({
            serviceID: currentService.value.id,
            belongings,
          });
          accept();
        } catch (error) {
          useSnackbarStore().show('Update Belongings Failed');
          reject();
          throw error;
        }
      },
    },
  });
}
function clickEditServiceCustomer(customer: ServiceCustomer) {
  type OnConfirm = (accept: () => void, reject: () => void, customer: ServiceCustomer) => void;

  type Data = { customer: ServiceCustomer; onConfirm: OnConfirm };

  const popupWindow = usePopupWindowStore().open<Data>({
    component: WindowUpdateCustomer,
    data: {
      customer,
      onConfirm: async () => {
        try {
          await useServiceStore().updateCustomerOfId({
            serviceID: currentService.value.id,
            customer,
          });
          popupWindow.close();
        } catch (error) {
          useSnackbarStore().show('Update Customer Failed');
          throw error;
        }
      },
    },
  });
}

onMounted(() => {
  invalidate();
  useServiceStore().refresh();
});
</script>

<template>
  <div class="PageService" :isPanelWide="`${panelListened.isWide}`">
    <PanelServices
      class="PageService-PanelServices"
      :menus="actionMenus"
      :services="items"
      :currentItem="currentService"
      @click-service="(item) => clickService(item)"
      @click-search="() => clickSearch()"
      @click-add="() => clickAddService()"
      @click-import="() => clickImportService()"
    />

    <PanelRight
      class="PageService-PanelRight"
      titleEmpty="Select service to view"
      :isShowing="!!currentService"
      @click-collapse="() => useRouteStore().nextQuery({ query: { service: null } })"
      @on-isWide="(isWide) => (panelListened.isWide = isWide)"
    >
      <PanelService class="PageService-PanelRight" :service="drawerService" :actions="actions" />
    </PanelRight>

    <Loading class="PageService-loading" :isShowing="useServiceStore().isLoading" />
  </div>
</template>

<style lang="scss" scoped>
.PageService {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: stretch;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  .PageService-PanelServices {
    z-index: 1;
  }
  .PageService-PanelRight {
    z-index: 2;
  }
  .PageService-loading {
    z-index: 5;
    bottom: 0;
    position: absolute;
  }
}
.PageService[isPanelWide='false'] {
  .PageService-PanelServices {
    width: 100dvw;
    max-width: 100%;
  }
}
.PageService[isPanelWide='true'] {
  .PageService-PanelServices {
    width: 100dvw;
    max-width: 50%;
  }
}
</style>
