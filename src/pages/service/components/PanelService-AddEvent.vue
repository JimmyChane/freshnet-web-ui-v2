<script setup lang="ts">
  import chroma from "chroma-js";
  import MenuVue from "@/components/menu/Menu.vue";
  import AddImage from "./PanelService-AddEvent-AddImage.vue";
  import {
    QUOTATION,
    ServiceEventMethod,
  } from "@/data/service/ServiceEventMethod";
  import { computed, onMounted, ref, watch } from "vue";
  import { useLoginStore } from "@/stores/login.store";
  import { useServiceStore } from "@/data-stores/service.store";
  import { Width, type Menu, Alignment } from "@/stores/popup-menu/PopupMenu";
  import { type ServiceEventData } from "@/data/service/ServiceEvent";
  import { useSnackbarStore } from "@/stores/snackbar/snackbar.store";

  const emits = defineEmits<{ clickSubmit: [ServiceEventData] }>();

  const methodMenuWidth = ref(Width.SAME);
  const methodMenuAlignment = ref(Alignment.VERTICAL);

  const eventImagePreviews = ref([]);

  const nameOfUser = ref("unknown");
  const eventMethod = ref(QUOTATION.key);
  const eventDescription = ref("");
  const eventStatus = ref("");
  const eventAmount = ref(0);
  const eventImages = ref<
    {
      name: string;
      // path: string;
      // method: string;
      // storageType: string;

      timeout: number;
      expiry: number;
      file: File;
    }[]
  >([]);

  const primaryColor = computed(() =>
    methodMenu.value?.color ? chroma(methodMenu.value.color) : undefined,
  );
  const primaryColor1 = computed(() => primaryColor.value?.mix("ffffff", 0.45));
  const primaryColor2 = computed(() => primaryColor.value?.mix("ffffff", 0.6));

  const isMethodInfo = computed(
    () => eventMethod.value === ServiceEventMethod.INFO.key,
  );
  const isMethodQuotation = computed(
    () => eventMethod.value === ServiceEventMethod.QUOTATION.key,
  );
  const isMethodPurchase = computed(
    () => eventMethod.value === ServiceEventMethod.PURCHASE.key,
  );

  const methodMenu = computed(() =>
    methodMenus.value.find((menu) => menu.key === eventMethod.value),
  );
  const methodMenus = computed(() => {
    return [
      {
        key: ServiceEventMethod.QUOTATION.key,
        title: "Quotation",
        color: chroma("961d96").toString(),
        click: (menu) => {
          eventMethod.value = menu.key ?? "";
          invalidateMethod();
        },
      },
      {
        key: ServiceEventMethod.PURCHASE.key,
        title: "Purchase",
        color: chroma("258915").toString(),
        click: (menu) => {
          eventMethod.value = menu.key ?? "";
          invalidateMethod();
        },
      },
    ] as Menu[];
  });

  const user = computed(() => useLoginStore().user);
  const isUserDefault = computed(() => {
    if (user.value.isTypeNone()) return false;
    const isUserAdmin = user.value.isTypeAdmin() && user.value.isDefault();
    const isUserStaff = user.value.isTypeStaff() && user.value.isDefault();
    return isUserAdmin || isUserStaff;
  });
  const nameUserType = computed(() => {
    if (user.value.isTypeAdmin()) return "Admin";
    if (user.value.isTypeStaff()) return "Staff";
    return "unknown";
  });

  watch(() => user.value, invalidateUser);
  watch(
    () => nameOfUser.value,
    () => {
      if (nameOfUser.value.includes(" ")) {
        nameOfUser.value = nameOfUser.value.trim().replace(" ", "");
      }
    },
  );
  watch(
    () => eventMethod.value,
    () => {
      setTimeout(() => invalidateMethod(), 10);
    },
  );

  const InputStatus = ref();
  const InputAmount = ref();
  const InputDescription = ref<HTMLTextAreaElement>();

  function invalidateMethod() {
    if (isMethodInfo.value) InputStatus.value.focus();
    if (isMethodQuotation.value || isMethodPurchase.value)
      InputAmount.value.focus();
  }
  function invalidateUser() {
    const xUser = user.value;
    if (!xUser.isTypeNone()) {
      nameOfUser.value = isUserDefault.value ? "" : xUser.name;
    }
  }

  function clear() {
    nameOfUser.value = "";

    eventDescription.value = "";
    eventStatus.value = "";
    eventAmount.value = 0;
    eventImages.value = [];

    invalidateEventImages();
    invalidateUser();
  }
  function submit() {
    if (isUserDefault.value && !nameOfUser.value.trim()) {
      useSnackbarStore().show("You must specify your name");
      return;
    }
    if (!eventDescription.value.trim()) {
      useSnackbarStore().show('You must specify "Description"');
      return;
    }

    const event: ServiceEventData = {
      time: Date.now(),
      method: eventMethod.value,
      description: eventDescription.value,
      images: eventImages.value,
    };

    if (isMethodInfo.value) {
      event.status = eventStatus.value;
    } else if (isMethodQuotation.value || isMethodPurchase.value) {
      event.price = { amount: eventAmount.value, currency: "RM" };
    }

    if (isUserDefault.value && nameOfUser.value.trim()) {
      event.nameOfUser = nameOfUser.value;
    }

    if (event) {
      emits("clickSubmit", event);
      clear();
    }
  }

  function focus() {
    setTimeout(() => {
      InputDescription.value?.focus();
    }, 100);
  }

  async function onInputImageFile(event: Event) {
    const { files } = event.target;
    const imageFiles: File[] = [];
    for (const file of files as FileList) imageFiles.push(file);
    const tempImageContents = await useServiceStore().addImageTemp(imageFiles);
    const images = imageFiles.map((imageFile, index) => {
      const tempImageContent = tempImageContents[index];

      return {
        name: tempImageContent.name,
        timeout: tempImageContent.timeout,
        expiry: tempImageContent.expiry,
        file: imageFile,
      };
    });

    eventImages.value.push(...images);

    invalidateEventImages();
  }
  async function invalidateEventImages() {
    const promises = eventImages.value.map((eventImage) => {
      const { file } = eventImage;

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target?.result);
        };
        reader.readAsDataURL(file);
      });
    });

    const results = await Promise.allSettled(promises);
    eventImagePreviews.value = results.map((result) => result.value);
  }

  onMounted(() => clear());
</script>

<template>
  <div
    class="AddEvent"
    :style="{
      '--primary-color': primaryColor?.toString(),
      '--primary-color-1': primaryColor1?.toString(),
      '--primary-color-2': primaryColor2?.toString(),
    }"
  >
    <textarea
      class="AddEvent-description scrollbar"
      ref="InputDescription"
      :style="{ 'grid-area': 'description' }"
      type="text"
      placeholder="Description"
      v-model="eventDescription"
    />

    <div class="AddEvent-images scrollbar" :style="{ 'grid-area': 'images' }">
      <img
        v-for="eventImagePreview of eventImagePreviews"
        :key="eventImagePreview"
        :src="eventImagePreview"
        alt=""
      />
    </div>

    <div class="AddEvent-footer" :style="{ 'grid-area': 'footer' }">
      <AddImage @change="(event) => onInputImageFile(event)" />

      <div class="AddEvent-line"></div>

      <input
        v-if="isUserDefault"
        class="AddEvent-user"
        :style="{ 'grid-area': 'user' }"
        type="text"
        placeholder="Your name here"
        v-model="nameOfUser"
      />
      <span v-else class="AddEvent-user" :style="{ 'grid-area': 'user' }">{{
        nameOfUser
      }}</span>
    </div>

    <div class="AddEvent-confirm" :style="{ 'grid-area': 'confirm' }">
      <button
        class="transition"
        :style="{ 'grid-area': 'enter' }"
        @click="() => submit()"
      >
        Enter
      </button>
      <button :style="{ 'grid-area': 'clear' }" @click="() => clear()">
        Discard
      </button>
    </div>

    <div class="AddEvent-status" :style="{ 'grid-area': 'status' }">
      <div class="AddEvent-status-amount">
        <span>RM</span>
        <input
          type="number"
          :value="eventAmount === 0 ? undefined : eventAmount"
          ref="InputAmount"
          placeholder="0.00"
          @input="
            (event) => {
              let amount = Number.parseFloat(
                (event.target as HTMLInputElement).value,
              );
              if (Number.isNaN(amount)) amount = 0;
              eventAmount = amount;
            }
          "
          @change="
            (event) => {
              let amount = Number.parseFloat(
                (event.target as HTMLInputElement).value,
              );
              if (Number.isNaN(amount)) amount = 0;
              eventAmount = amount;
            }
          "
        />
      </div>

      <MenuVue
        class="AddEvent-status-header"
        :menus="methodMenus"
        :alignment="methodMenuAlignment"
        :width="methodMenuWidth"
      >
        <span>{{ methodMenu?.title }}</span>
        <img src="@/assets/icon/arrowDown-FFFFFF.svg" alt="Click to select" />
      </MenuVue>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .AddEvent {
    width: 100%;

    display: grid;
    grid-template-areas:
      "description status"
      "images status"
      "footer confirm";
    grid-template-columns: 1fr 10rem;

    border-top: 1px solid hsla(0, 0%, 0%, 0.05);
    background: var(--primary-color-2);
    overflow: hidden;
    position: sticky;
    bottom: 0;

    .AddEvent-header {
      font-size: 0.7rem;
      margin: 1rem;
      margin-bottom: 0;
    }
    .AddEvent-description {
      resize: none;
      background: none;
      border: none;
      height: 100%;
      min-height: 2.5rem;

      --scrollbar-size: 0.5em;
      --scrollbar-thumb-radius: 0.5em;
      --scrollbar-thumb-color: hsla(0, 0%, 0%, 0.1);
      --scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.6);
      --scrollbar-track-color: hsla(0, 0%, 0%, 0.1);
      --scrollbar-track-color-hover: hsla(0, 0%, 0%, 0.1);

      --padding: 0.5rem;
      padding: var(--padding);
      scroll-padding: var(--padding);

      &::placeholder {
        color: rgba(0, 0, 0, 0.4);
      }
    }
    .AddEvent-images {
      width: 100%;
      display: flex;
      flex-direction: row;
      padding: 1rem;
      gap: 2px;

      overflow-x: auto;

      & > * {
        height: 3rem;
        border-radius: 0.3rem;
        background: white;
      }
    }
    .AddEvent-footer {
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      gap: 0.2rem;
      margin: 0 0.5rem;

      display: flex;
      flex-direction: row;
      align-items: center;

      .AddEvent-line {
        min-width: 1px;
        margin: 0.5rem 0;
        height: calc(100% - 1rem);
        background: rgba(0, 0, 0, 0.1);
      }

      .AddEvent-user {
        font-size: 0.8rem;
        padding: 0.5rem;
        border: none;
        background: none;
        flex-grow: 1;
      }
    }
    .AddEvent-confirm {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      justify-content: space-between;

      padding: 0.5rem;

      & > * {
        font-size: 0.8rem;
        border: none;
        background: none;
        cursor: pointer;
      }

      :nth-child(1) {
        border-radius: 0.5rem;
        padding: 0.5rem 0.8rem;
        background: var(--primary-color);
        color: white;

        &:hover,
        &:focus {
          transform: scale(1.1);
        }
      }
      :nth-child(2) {
        color: var(--primary-color);

        img {
          width: 1rem;
          height: 1rem;
        }
      }
    }
    .AddEvent-status {
      border-radius: 0.5rem;
      overflow: hidden;
      margin: 0.5rem;
      margin-left: 0;
      margin-bottom: 0;

      display: flex;
      flex-direction: column-reverse;
      background: var(--primary-color-1);

      .AddEvent-status-header {
        width: 100%;
        border-radius: 0;

        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: space-between;
        background: var(--primary-color);
        color: white;
        padding: 0.5rem;
        font-size: 0.8rem;

        :nth-child(2) {
          width: 1em;
          height: 1em;
        }
      }
      .AddEvent-status-amount {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        overflow: hidden;
        :nth-child(1) {
          height: 100%;
          min-width: max-content;
          padding: 0.5rem;
          font-weight: 600;

          display: flex;
          flex-grow: 0;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        :nth-child(2) {
          width: 100%;
          height: 100%;
          padding: 1rem;
          flex-grow: 1;
          font-size: inherit;
          color: black;
          border: none;
          background: none;
          resize: none;

          &::placeholder {
            color: rgba(0, 0, 0, 0.3);
          }
        }
      }
    }
  }
</style>
