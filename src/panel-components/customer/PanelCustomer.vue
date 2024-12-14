<script setup lang="ts">
import Actionbar from '@/components/actionbar/Actionbar.vue';
import Loading from '@/components/loading/Loading.vue';
import Item from './PanelCustomer-Item.vue';
import PanelCustomerEmpty from './PanelCustomer-Empty.vue';
import chroma from 'chroma-js';
import { Customer } from '@/data/Customer';
import IconClose from '@/assets/icon/close-000000.svg';
import IconEdit from '@/assets/icon/edit-000000.svg';
import IconAdd from '@/assets/icon/add-000000.svg';
import IconTrash from '@/assets/icon/trash-000000.svg';
import IconWhatsapp from '@/assets/icon/whatsapp-color.svg';
import IconCall from '@/assets/icon/call-color.svg';
import { computed, onMounted, ref, watch } from 'vue';
import { useCustomerStore } from '@/data-stores/customer.store';
import { CustomerDevice } from '@/data/CustomerDevice';
import { useWindowStore } from '@/stores/window.store';
import { ServiceCustomer } from '@/data/ServiceCustomer';
import ItemDevice from '@/page-components/customer/ItemDevice.vue';
import ItemService from '@/dialog-components/service/item-service/ItemService.vue';
import PanelItemCustomer from '../manage/PanelItem-Customer.vue';
import PanelItemSection from '../manage/PanelItem-Section.vue';
import type { CustomerDeviceSpecification } from '@/data/CustomerDeviceSpecification';

const emits = defineEmits<{
  clickItemClose: [void];
  clickItemRemove: [Customer];
  clickItemCustomerUpdate: [ServiceCustomer];
  clickItemDescriptionUpdate: [Customer];
  clickItemDeviceAdd: [Customer];
  clickItemDeviceRemove: [{ item: Customer; device: CustomerDevice }];
  clickItemDeviceUpdateSpecifications: [
    {
      item: Customer;
      device: CustomerDevice;
      specifications: CustomerDeviceSpecification[];
    },
  ];
  clickItemDeviceUpdateDescription: [
    {
      item: Customer;
      device: CustomerDevice;
      description: string;
    },
  ];
}>();
const props = defineProps<{ item?: Customer }>();

const top = ref({ showShadow: false });
const devices = ref<{ deviceId: string; device?: CustomerDevice }[]>([]);
const isLoadingDevices = ref(false);

const isWide = computed(() => useWindowStore().width > 600);
const menus = computed(() => {
  const menus = [];

  if (isPhoneNumber.value) {
    menus.push({
      title: 'Chat with Customer on Whatsapp',
      icon: IconWhatsapp,
      alth: 'Chat on Whatsapp',
      href: `https://api.whatsapp.com/send?phone=6${phoneNumberStr.value}`,
      target: '_blank',
    });
    menus.push({
      title: 'Call Customer',
      icon: IconCall,
      href: `tel:+6${phoneNumberStr.value}`,
    });
  }

  if (isFromStoreCustomer.value) {
    menus.push({
      title: 'Delete Customer',
      icon: IconTrash,
      click: () => {
        if (props.item) emits('clickItemRemove', props.item);
      },
      isHidden: true,
    });
  }

  return menus;
});

const id = computed(() => props.item?.id ?? '');
const phoneNumber = computed(() => props.item?.phoneNumber ?? null);
const phoneNumberStr = computed(() => phoneNumber.value?.toString() ?? '');
const isPhoneNumber = computed(() => !!phoneNumberStr.value);
const description = computed(() => props.item?.description ?? '');
const deviceIds = computed(() => props.item?.deviceIds ?? []);
const services = computed(() => props.item?.services ?? []);
const orders = computed(() => props.item?.orders ?? []);
const isFromStoreCustomer = computed(() => props.item?.isFromStoreCustomer() ?? false);

const primaryColor = computed(() => chroma('294656'));
const actionbarColor = computed(() => backgroundColor.value.brighten(0.4));
const backgroundColor = computed(() => primaryColor.value.mix('ffffff', 0.65));

watch(() => props.item, invalidateDevices);
watch(() => props.item?.deviceIds, invalidateDevices);

onMounted(() => {
  invalidateDevices();
});

async function invalidateDevices() {
  devices.value = [];

  if (!deviceIds.value.length) {
    return;
  }

  const cacheItem = props.item;
  isLoadingDevices.value = true;

  const xDevices = await useCustomerStore().getDevices();
  if (props.item !== cacheItem) {
    return;
  }

  isLoadingDevices.value = false;
  devices.value =
    props.item?.deviceIds.map((deviceId) => {
      const device = xDevices.find((device) => device.id === deviceId);
      return { deviceId, device };
    }) ?? [];
}
</script>

<template>
  <div
    class="PanelCustomer"
    :style="{ 'background-color': backgroundColor.toString() }"
    @scroll="(event) => (top.showShadow = (event.target as HTMLDivElement).scrollTop > 0)"
  >
    <div class="PanelCustomer-body">
      <Actionbar
        class="PanelCustomer-actionbar"
        :style="{ 'background-color': actionbarColor }"
        :leftMenus="{
          key: 'close',
          title: 'Close',
          icon: IconClose,
          click: () => emits('clickItemClose'),
        }"
        :rightMenus="menus"
      >
        <PanelItemCustomer
          v-if="item instanceof ServiceCustomer"
          :customer="item"
          :isEditable="item.isModifiable()"
          @click-edit="(item) => emits('clickItemCustomerUpdate', item)"
        />
      </Actionbar>

      <div class="PanelCustomer-main" :isWide="`${isWide}`">
        <PanelItemSection
          title="Description"
          v-if="id"
          :menus="[
            {
              icon: IconEdit,
              click: () => {
                if (item) emits('clickItemDescriptionUpdate', item);
              },
            },
          ]"
        >
          <span v-if="description">{{ description }}</span>
          <PanelCustomerEmpty v-else />
        </PanelItemSection>

        <PanelItemSection
          title="Owned Devices"
          v-if="isFromStoreCustomer"
          :menus="[
            {
              icon: IconAdd,
              click: () => {
                if (item) emits('clickItemDeviceAdd', item);
              },
            },
          ]"
        >
          <div class="PanelCustomer-section-devices">
            <ItemDevice
              v-for="deviceContext of devices"
              :key="deviceContext.deviceId"
              :item="deviceContext.device"
              @click-remove="
                (device) => {
                  if (item) emits('clickItemDeviceRemove', { item, device });
                }
              "
              @click-update-specifications="
                (customerDevice) => {
                  if (item) {
                    emits('clickItemDeviceUpdateSpecifications', {
                      item,
                      device: customerDevice,
                      specifications: customerDevice.specifications,
                    });
                  }
                }
              "
              @click-update-description="
                (param) => {
                  if (item) {
                    emits('clickItemDeviceUpdateDescription', {
                      item,
                      device: param,
                      description: param.description,
                    });
                  }
                }
              "
            />
          </div>

          <PanelCustomerEmpty v-if="!devices.length" />
          <Loading class="PanelCustomer-devices-loading" :isShowing="isLoadingDevices" />
        </PanelItemSection>

        <PanelItemSection title="Services">
          <router-link
            class="PanelCustomer-SectionService-item"
            v-for="service of services"
            :key="service.id"
            :to="{
              path: '/manage/service',
              query: { service: service.id },
            }"
          >
            <ItemService :headerCustomer="false" :item="service" />
          </router-link>
          <PanelCustomerEmpty v-if="!services.length" />
        </PanelItemSection>

        <PanelItemSection title="Orders">
          <Item
            v-for="order of orders"
            :key="order.id"
            :to="{
              path: '/manage/order',
              query: { order: order.id },
            }"
            title="Content"
          >
            <span>{{ order.content }}</span>
          </Item>
          <PanelCustomerEmpty v-if="!orders.length" />
        </PanelItemSection>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.PanelCustomer {
  width: 100%;
  width: 100dvw;
  max-width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow-x: hidden;

  .PanelCustomer-body {
    display: flex;
    flex-direction: column;
    align-items: center;

    .PanelCustomer-main {
      width: 40rem;
      max-width: 100%;

      padding-bottom: 10rem;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      row-gap: 0.5rem;

      & > * {
        border-radius: 1rem;
        overflow: hidden;
      }

      .PanelCustomer-section-devices {
        display: flex;
        flex-direction: column;
        border-radius: 1rem;
        gap: 3px;
        overflow: hidden;
      }
      .PanelCustomer-devices-loading {
        width: 100%;
        height: 4px;
      }
      .PanelCustomer-SectionService-item {
        width: 100%;
        border-radius: 1rem;
        text-decoration: none;
        display: flex;
        flex-direction: column;
        align-items: stretch;
      }
    }
  }
}
</style>
@/stores/data-stores/customer.store
