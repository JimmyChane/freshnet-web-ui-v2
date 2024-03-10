<script setup lang="ts">
  import Actionbar from "@/components/actionbar/Actionbar.vue";
  import Selector from "@/components/selector/Selector.vue";
  import State from "@/data/service/ServiceState";
  import PanelItemCustomer from "@/pages/manage/PanelItem-Customer.vue";
  import SectionVue from "./PanelService-Info-Section.vue";
  import LabelVue from "./PanelService-Info-Label.vue";
  import BelongingVue from "./ItemBelonging.vue";
  import MenuIconVue from "@/components/MenuIcon.vue";
  import { format, formatDistanceToNow } from "date-fns";

  import Service from "@/data/service/Service";

  import IconWhatsapp from "@/assets/icon/whatsapp-color.svg";
  import IconCall from "@/assets/icon/call-color.svg";
  import IconTrash from "@/assets/icon/trash-000000.svg";
  import IconClose from "@/assets/icon/close-000000.svg";
  import IconBookmark from "@/assets/icon/bookmark-add-000000.svg";
  import IconBookmarkAdd from "@/assets/icon/bookmark-000000.svg";
  import IconEdit from "@/assets/icon/edit-505050.svg";
  import { computed, onMounted, ref, watch } from "vue";
  import { useStore } from "@/stores/store";
  import { useServiceStore } from "@/data-stores/service.store";
  import { Action } from "./PanelService";
  import ServiceBelonging from "@/data/service/ServiceBelonging";
  import { useSnackbarStore } from "@/stores/snackbar/snackbar.store";

  const emits = defineEmits<{ toggleExpand: [boolean] }>();
  const props = withDefaults(
    defineProps<{
      service?: Service;
      actionbarColor?: string;
      actionbarBorder?: string;
      actions: Action;
      isExpand?: boolean;
    }>(),
    {
      actionbarColor: "",
      actionbarBorder: "",
      isExpand: false,
    },
  );

  const nameOfUser = ref("");
  const bookmarkHeaderIconIsHover = ref(false);

  const timestamp = computed(() => props.service?.timestamp);
  const timestampText = computed((c) => {
    const time = timestamp.value?.time ?? 0;

    const timeText = format(time, "EEEE, dd/LL/yyyy hh:mmaaa");

    const distance = formatDistanceToNow(time);
    const distanceText = `(${distance} ago)`;

    let day;
    if (timestamp.value?.isToday()) {
      day = "Today, ";
    } else if (timestamp.value?.isYesterday()) {
      day = "Yesterday, ";
    } else {
      day = "";
    }

    return `${day}${timeText} ${distanceText}`;
  });

  const customer = computed(() => props.service?.customer ?? null);

  const labels = computed(() => props.service?.labels ?? []);
  const belongings = computed(
    () => props.service?.belongings.map((belonging) => belonging) ?? [],
  );
  const state = computed(() => props.service?.state ?? "");

  const phoneNumber = computed(() => customer.value?.phoneNumber ?? null);
  const phoneNumberStr = computed(() => phoneNumber.value?.toString() ?? "");
  const isPhoneNumber = computed(() => !!phoneNumberStr.value);

  const stateMenus = computed(() => {
    return State.map((state) => {
      return {
        key: state.key,
        title: state.title,
        icon: state.icon,
        color: state.primaryColor,
      };
    });
  });

  const menus = computed(() => {
    const menus = [];

    if (props.isExpand && isPhoneNumber.value) {
      menus.push({
        title: "Chat with Customer on Whatsapp",
        icon: IconWhatsapp,
        alth: "Chat on Whatsapp",
        href: `https://api.whatsapp.com/send?phone=6${phoneNumberStr.value}`,
        target: "_blank",
      });
      menus.push({
        title: "Call Customer",
        icon: IconCall,
        href: `tel:+6${phoneNumberStr.value}`,
      });
    }

    menus.push({
      title: "Find Customer",
      to: {
        path: "/manage/customer",
        query: {
          name: customer.value?.name,
          phoneNumber: phoneNumberStr.value,
        },
      },
      isHidden: true,
    });
    menus.push({
      title: "Delete Service",
      icon: IconTrash,
      click: () => {
        if (props.service) props.actions.onClickRemove(props.service);
      },
      isHidden: true,
    });

    return menus;
  });
  const labelMenus = computed(() => {
    if (!props.service) return [];

    const menus = [
      {
        key: "urgent",
        title: "Urgent",
        click: () => {
          if (props.service)
            useServiceStore().updateUrgentOfId({
              serviceID: props.service.id,
              isUrgent: !props.service.isUrgent(),
            });
        },
      },
      {
        key: "warranty",
        title: "Warranty",
        click: () => {
          if (props.service)
            useServiceStore().updateWarrantyOfId({
              serviceID: props.service.id,
              isWarranty: !props.service.isWarranty(),
            });
        },
      },
    ];

    return menus.filter((menu) => {
      const label = labels.value.find((label) => label.title === menu.title);
      return !label;
    });
  });

  const totalCost = computed(() => props.service?.toTotalPrice());
  const totalCostText = computed(() => `Total Cost: ${totalCost.value}`);

  watch(() => props.service, invalidate);

  async function invalidate() {
    nameOfUser.value = await getOwnerNameFromItem();
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

  function toggleExpand(isExpand = !props.isExpand) {
    emits("toggleExpand", isExpand);
  }

  onMounted(() => invalidate());
</script>

<template>
  <div class="PanelService-actionbar">
    <Actionbar
      v-if="service"
      class="PanelService-actionbar-actionbar"
      :style="{
        'background-color': actionbarColor,
        'border-bottom': `1px solid ${
          isExpand ? actionbarBorder : 'transparent'
        }`,
      }"
      :leftMenus="{
        icon: IconClose,
        click: () => actions.onClickClose(),
      }"
      :rightMenus="menus"
    >
      <button
        class="PanelService-actionbar-actionbar-clickable"
        @click="() => toggleExpand()"
      >
        <PanelItemCustomer
          v-if="customer"
          :customer="customer"
          :isEditable="isExpand"
          @click-edit="(customer) => actions.onClickUpdateCustomer(customer)"
        />

        <div
          class="PanelService-actionbar-actionbar-labels"
          :isExpand="`${isExpand}`"
          v-if="labels.length"
        >
          <LabelVue
            v-for="label in labels"
            :key="label.title"
            :label="label"
            :isClickable="false"
            @click="
              () => {
                if (service)
                  useServiceStore().removeLabelFromId({
                    serviceID: service.id,
                    label,
                  });
              }
            "
          />
        </div>
      </button>
    </Actionbar>

    <div class="PanelService-actionbar-anchor" v-if="service">
      <div
        class="PanelService-actionbar-expanded transition"
        :style="{
          'background-color': actionbarColor,
          'border-bottom': `1px solid ${actionbarBorder}`,
        }"
        :isExpand="`${isExpand}`"
      >
        <div class="PanelService-actionbar-expanded-body">
          <div class="PanelService-actionbar-expanded-body-body">
            <div class="PanelService-section-labels">
              <LabelVue
                v-for="label in labels"
                :key="label.title"
                :label="label"
                @click="
                  () => {
                    if (service)
                      useServiceStore().removeLabelFromId({
                        serviceID: service.id,
                        label,
                      });
                  }
                "
              />
              <MenuIconVue
                :style="{ 'font-size': '0.8rem', 'grid-area': 'addLabel' }"
                :menus="labelMenus"
                @mouseover="bookmarkHeaderIconIsHover = true"
                @mouseleave="bookmarkHeaderIconIsHover = false"
                :src="
                  bookmarkHeaderIconIsHover ? IconBookmark : IconBookmarkAdd
                "
              />
            </div>

            <SectionVue
              :title="`Belongings (${belongings.length})`"
              :menus="{
                title: 'Update Belongings',
                icon: IconEdit,
                click: () => actions.onClickUpdateBelongings(belongings),
              }"
            >
              <div
                class="PanelService-section-belonging"
                v-if="belongings.length"
              >
                <BelongingVue
                  v-for="belonging in belongings"
                  :key="belonging.time"
                  :belonging="belonging"
                />
              </div>
              <div class="PanelService-section-belonging-empty" v-else>
                <span>Emtpy</span>
              </div>
            </SectionVue>

            <SectionVue title="Collected By">
              <span>{{ nameOfUser }}</span>
            </SectionVue>

            <div class="PanelService-action-footer">
              <Selector
                class="PanelService-actionbar-state-selector"
                :list="stateMenus"
                :keySelected="state"
                @callback-select="
                  (state) => {
                    if (!service) return;
                    useServiceStore().updateStateOfId({
                      serviceID: service.id,
                      state,
                    });
                  }
                "
              />

              <span class="PanelService-totalCost">{{ totalCostText }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .PanelService-actionbar {
    --actionbar-height: 3.8rem;
    width: 100%;
    position: sticky;
    top: 0;

    .PanelService-actionbar-actionbar {
      background: inherit;
      border-bottom: inherit;

      .PanelService-actionbar-actionbar-clickable {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: stretch;

        background: none;
        border: none;
        cursor: pointer;
        font-size: 1em;

        .PanelService-actionbar-actionbar-labels[isExpand="true"] {
          opacity: 0;
        }
        .PanelService-actionbar-actionbar-labels {
          display: flex;
          flex-direction: row;
          align-items: center;
          flex-wrap: nowrap;
          justify-content: flex-end;

          flex-grow: 1;
          overflow: hidden;

          transition: all 200ms cubic-bezier(1, 0, 0, 1);

          gap: 1px;
        }
      }
    }

    .PanelService-actionbar-anchor {
      width: 100%;
      position: relative;
      display: flex;

      .PanelService-actionbar-expanded[isExpand="false"] {
        grid-template-rows: 0fr;
      }
      .PanelService-actionbar-expanded[isExpand="true"] {
        grid-template-rows: 1fr;
      }
      .PanelService-actionbar-expanded {
        width: 100%;
        height: max-content;
        max-height: calc(100dvh - 4rem - 4rem - 0.2rem - 3rem);
        position: absolute;
        display: grid;
        box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.2);
        transition-timing-function: cubic-bezier(1, 0, 0, 1);
        overflow-y: auto;

        .PanelService-actionbar-expanded-body {
          overflow: hidden;
          overflow-y: auto;

          .PanelService-actionbar-expanded-body-body {
            width: 100%;
            height: max-content;
            padding: 1rem;
            gap: 1rem;

            display: flex;
            flex-direction: column;
            align-items: stretch;

            .PanelService-section-labels {
              display: flex;
              flex-direction: row;
              align-items: center;
              gap: 0.2em;
            }

            .PanelService-section-belonging {
              width: 100%;
              display: flex;
              flex-direction: column;
              gap: 0.2rem;
            }

            .PanelService-action-footer {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;

              .PanelService-actionbar-state-selector {
                width: 100%;
                max-width: 12rem;
                flex-grow: 1;
              }

              .PanelService-totalCost {
                min-width: max-content;
                text-align: end;
                font-weight: 600;
              }
            }
          }
        }
      }
    }
  }
</style>
