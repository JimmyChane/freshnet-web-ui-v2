<script setup lang="ts">
  import { format, formatDistanceToNow } from "date-fns";
  import MenuOption from "@/components/button/MenuOption.vue";
  import ImageView from "./ServiceEvent-Image.vue";
  import WindowUpdateEventDescription from "./WindowUpdateEventDescription.vue";
  import { Service } from "@/data/service/Service";
  import { ServiceEvent } from "@/data/service/ServiceEvent";
  import {
    INITIAL,
    ServiceEventMethod,
  } from "@/data/service/ServiceEventMethod";
  import IconTrash from "@/assets/icon/trash-000000.svg";
  import { computed, onMounted, ref, watch } from "vue";
  import { useServiceStore } from "@/data-stores/service.store";
  import { ServiceImage } from "@/data/service/ServiceImage";
  import type { Action } from "./PanelService";
  import { useSnackbarStore } from "@/stores/snackbar/snackbar.store";
  import { usePopupWindowStore } from "@/stores/popup-window/popup-window.store";
  import { useImageViewerStore } from "@/stores/image-viewer.store";

  interface Menu {
    title: string;
    icon?: string;
    click: () => void;
  }

  const emits = defineEmits<{ callbackDelete: [typeof props.event] }>();
  const props = defineProps<{
    service?: Service;
    event: ServiceEvent;
    actions: Action;
  }>();

  const nameOfUser = ref("loading...");
  const isShowingMenu = ref(false);
  const isHovered = ref(false);

  const time = computed(() => {
    return props.event?.timestamp?.time ?? 0;
  });
  const timestampText = computed(() => {
    const xTime = time.value;
    if (xTime === 0) return "";

    const distance = formatDistanceToNow(xTime);
    const distanceText = `(${distance} ago)`;

    const timeText = format(xTime, "hh:mmaaa");

    return `${timeText} ${distanceText}`;
  });

  const description = computed(() => props.event.description);
  const images = computed(() => props.event.images);

  const methodPrimaryColor = computed(() => {
    return methodContext("primaryColor") ?? "";
  });
  const methodTitle = computed(() => {
    return methodContext("title") ?? "";
  });
  const methodResult = computed(() => {
    return props.event.toResult() ?? "";
  });

  const infoTexts = computed(() => {
    const texts = [timestampText.value, methodTitle.value, nameOfUser.value];
    return texts.filter((text) => text.length > 0);
  });

  const shouldShowMenu = computed(() => {
    return isShowingMenu.value || isHovered.value;
  });

  const isInitial = computed(() => {
    return props.event.method === INITIAL.key;
  });

  const menus = computed(() => {
    const menus: Menu[] = [
      {
        title: "Edit Description",
        click: isInitial.value
          ? clickEditServiceDescription
          : clickEditDescription,
      },
    ];

    if (isInitial.value) {
      menus.push({
        title: "Add Image",
        click: () => {
          const element = document.createElement("input");
          element.type = "file";
          element.accept = ".jpeg, .jpg, .png, .webp";
          element.multiple = true;
          element.addEventListener("change", (event) => {
            const imageFiles = (event.target as HTMLInputElement).files;

            if (props.service) {
              useServiceStore()
                .addImageToId({ serviceID: props.service.id, imageFiles })
                .then((serivce) => {})
                .catch((error) => {
                  useSnackbarStore().show("Failed to Add Image");
                });
            }
          });

          const mouseEventOption = {
            view: window,
            bubbles: true,
            cancelable: false,
          };
          element.dispatchEvent(new MouseEvent("click", mouseEventOption));
        },
      });
    }
    if (!isInitial.value) {
      menus.push({
        title: "Add Image",
        click: () => {
          const element = document.createElement("input");
          element.type = "file";
          element.accept = ".jpeg, .jpg, .png, .webp";
          element.multiple = true;
          element.addEventListener("change", (e) => {
            if (props.service) {
              useServiceStore()
                .addEventImage({
                  serviceID: props.service.id,
                  eventTime: time.value,
                  imageFiles: (e.target as HTMLInputElement).files,
                })
                .then((serivce) => {})
                .catch((error) => {
                  useSnackbarStore().show("Failed to Add Image");
                });
            }
          });
          element.dispatchEvent(
            new MouseEvent("click", {
              view: window,
              bubbles: true,
              cancelable: false,
            }),
          );
        },
      });
      menus.push({
        title: "Delete Event",
        icon: IconTrash,
        click: () => emits("callbackDelete", props.event),
      });
    }

    return menus;
  });

  watch(() => props.event, invalidate);

  async function invalidate() {
    const event = props.event;

    if (!event) return (nameOfUser.value = "");

    const name = await props.event.fetchName().catch((error) => {
      useSnackbarStore().show("Error getting user for event");
      return "";
    });

    if (props.event !== event) return;
    if (name) nameOfUser.value = name;
  }

  function methodContext(property: string) {
    if (props.event.isInfo())
      return (ServiceEventMethod.INFO as Record<string, any>)[property];
    if (props.event.isQuotation())
      return (ServiceEventMethod.QUOTATION as Record<string, any>)[property];
    if (props.event.isPurchase())
      return (ServiceEventMethod.PURCHASE as Record<string, any>)[property];
    return null;
  }

  function clickEditServiceDescription() {
    if (props.service) {
      props.actions.onClickUpdateDescription(props.service.description);
    }
  }
  function clickEditDescription() {
    usePopupWindowStore().open({
      component: WindowUpdateEventDescription,
      data: {
        service: props.service,
        serviceEvent: props.event,
      },
    });
  }
  function clickRemoveServiceImage(image: ServiceImage) {
    let onConfirm: (accept: () => void, reject: () => void) => Promise<void>;
    if (isInitial.value) {
      onConfirm = async (accept, reject) => {
        if (!props.service) {
          reject();
          return;
        }
        try {
          const service = await useServiceStore().removeImageFromId({
            serviceID: props.service.id,
            image,
          });
          useImageViewerStore().close();
          accept();
        } catch (error) {
          useSnackbarStore().show("Delete Image Failed");
          reject();
          throw error;
        }
      };
    } else {
      onConfirm = async (accept, reject) => {
        if (!props.service) {
          reject();
          return;
        }
        try {
          const requestOption = {
            serviceID: props.service.id,
            eventTime: time.value,
            image,
          };
          const service =
            await useServiceStore().removeEventImage(requestOption);
          useImageViewerStore().close();
          accept();
        } catch (error) {
          useSnackbarStore().show("Delete Image Failed");
          reject();
          throw error;
        }
      };
    }

    const popupWindow = usePopupWindowStore().openWindowRemove({
      title: "Delete Image",
      message: "After deleting this image, it cannot be reverted.",
      data: image,
      onConfirm: () => {
        const accept = () => {
          popupWindow.close();
        };
        const reject = () => {};
        onConfirm(accept, reject);
      },
    });
  }

  onMounted(() => invalidate());
</script>

<template>
  <div
    class="ItemEvent"
    :style="{ '--primary-color': methodPrimaryColor, '--opacity': '1' }"
    @mouseenter="() => (isHovered = true)"
    @mouseleave="() => (isHovered = false)"
  >
    <div class="ItemEvent-main">
      <div class="ItemEvent-left">
        <div class="ItemEvent-infos">
          <span v-for="(info, index) in infoTexts" :key="info">
            {{ info }}
            <div
              class="ItemService-dot"
              v-if="index < infoTexts.length - 1"
            ></div>
          </span>
        </div>

        <span class="ItemEvent-problem" v-if="isInitial">Problem</span>

        <span class="ItemEvent-description">{{ description }}</span>

        <span :class="['ItemEvent-result', 'transition']" v-if="methodResult">{{
          methodResult
        }}</span>
      </div>

      <div class="ItemEvent-right">
        <MenuOption
          class="ItemEvent-menu"
          :menus="menus"
          @show="() => (isShowingMenu = true)"
          @hide="() => (isShowingMenu = false)"
        />
      </div>
    </div>

    <div class="ItemEvent-images scrollbar" v-if="images.length">
      <ImageView
        v-for="image of images"
        :key="image.name"
        :src="image"
        :event="event"
        @click="
          () => {
            const option = { image, thumbnails: images };
            useImageViewerStore().show(option);
          }
        "
        @click-remove="() => clickRemoveServiceImage(image)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .ItemEvent {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    background: hsla(0, 0%, 100%, 0.6);

    border-left: 3px solid var(--primary-color);
    border-radius: 0.6rem;

    --body-padding: 1rem;

    .ItemEvent-main {
      --min-height: 3.5rem;

      min-height: var(--min-height);
      display: flex;
      flex-direction: row;
      border-radius: var(--border-radius) 0 0 var(--border-radius);
      overflow: hidden;

      .ItemEvent-left {
        min-height: var(--min-height);
        padding: var(--body-padding);
        gap: 0.2rem;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        justify-content: center;

        .ItemEvent-infos {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          font-size: 0.7rem;
          color: hsla(0, 0%, 0%, 0.8);
          & > * {
            min-width: max-content;
            width: max-content;
            display: flex;
            flex-direction: row;
            align-items: center;
          }
          .ItemService-dot {
            width: 3px;
            height: 3px;
            margin: 0 0.5rem;
            background: hsla(0, 0%, 0%, 0.5);
            border-radius: 50%;
          }
        }
        .ItemEvent-problem {
          font-size: 0.9rem;
          font-weight: 600;
        }
        .ItemEvent-description {
          width: 100%;
          line-height: 1.1;
          font-size: 1rem;
          white-space: pre-line;
        }
        .ItemEvent-result {
          width: max-content;

          display: flex;
          align-items: center;
          justify-content: center;

          background: var(--primary-color);
          color: white;
          text-align: center;
          font-size: 0.7rem;
          padding: 0.4em;
          border-radius: 0.3em;

          transition-timing-function: cubic-bezier(1, 0, 0, 1);
        }
      }

      .ItemEvent-right {
        height: var(--min-height);
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0.4rem 0.8rem;
        gap: 0.8rem;
        border-radius: 0 var(--border-radius) var(--border-radius) 0;

        .ItemEvent-menu {
          border-radius: 50%;
          .ItemEvent-menu-icon {
            z-index: 0;
            width: 1.2em;
            height: 1.2em;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
    .ItemEvent-images {
      --padding: var(--body-padding);
      --image-height: 80px;

      padding: var(--padding);
      padding-top: 0;
      height: calc(var(--image-height) + var(--padding));
      display: flex;
      flex-direction: row;
      gap: 1px;

      overflow-x: auto;
    }
  }
</style>
