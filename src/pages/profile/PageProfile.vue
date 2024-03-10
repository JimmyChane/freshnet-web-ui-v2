<script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  import NavigationBar from "@/components/actionbar/NavigationBar.vue";
  import Loading from "@/components/loading/Loading.vue";
  import ButtonIcon from "@/components/button/ButtonIcon.vue";
  import Section from "./PageProfile-Section.vue";
  import SectionTitle from "./PageProfile-Section-Title.vue";
  import SectionMain from "./PageProfile-Section-Main.vue";
  import WindowChangePassword from "./WindowChangePassword.vue";
  import IconArrowDown from "@/assets/icon/arrowDown-000000.svg";
  import { useSnackbarStore } from "@/stores/snackbar/snackbar.store";
  import { useLoginStore } from "@/stores/login.store";
  import type { User } from "@/data/user/User";
  import { usePopupWindowStore } from "@/stores/popup-window/popup-window.store";

  const user = ref<User>();
  const isLoading = ref(false);
  const scrollTop = ref(0);

  const name = computed(() => user.value?.name);
  const username = computed(() => user.value?.username);
  const typeDisplay = computed(() => {
    if (user.value?.isTypeAdmin()) return "Admin";
    if (user.value?.isTypeStaff()) return "Staff";
    if (user.value?.isTypeCustomer()) return "Customer";
    return "Other";
  });

  function openWindowChangePassword() {
    const popupWindow = usePopupWindowStore().open({
      component: WindowChangePassword,
    });
  }

  onMounted(async () => {
    isLoading.value = true;
    await useLoginStore()
      .getUser()
      .then((xUser) => {
        isLoading.value = false;
        user.value = xUser;
      })
      .catch((error) => {
        useSnackbarStore().show("Failed to validate");
        isLoading.value = false;
        user.value = undefined;
      });
  });
</script>

<template>
  <div class="PageProfile">
    <div
      class="PageProfile-scroll"
      @scroll="
        (event) => (scrollTop = (event.target as HTMLDivElement).scrollTop)
      "
    >
      <NavigationBar style="z-index: 2" :title="$options.title" />

      <div class="PageProfile-body" v-if="user">
        <Section class="PageProfile-introduction">
          <div class="PageProfile-introduction-body">
            <span class="PageProfile-user-name">Hello, {{ name }}</span>
            <div class="PageProfile-user-main">
              <SectionTitle :title="`@${username}`" />
              <SectionTitle :title="typeDisplay" />
            </div>
          </div>
        </Section>

        <Section>
          <SectionTitle title="Sessions" />
          <SectionMain>Built in progress</SectionMain>
        </Section>

        <Section>
          <div class="PageProfile-section-changePassword">
            <div class="PageProfile-section-changePassword-body">
              <SectionTitle title="Change Your Password" />
              <SectionMain>Also signing out other session</SectionMain>
            </div>
            <ButtonIcon
              class="PageProfile-section-changePassword-arrow"
              :src="IconArrowDown"
              @click="() => openWindowChangePassword()"
            />
          </div>
        </Section>
      </div>
    </div>

    <Loading class="PageProfile-loading" :isShowing="isLoading" />
  </div>
</template>

<style lang="scss" scoped>
  .PageProfile {
    position: relative;
    flex-grow: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;

    .PageProfile-scroll {
      position: relative;
      overflow: auto;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;

      .PageProfile-body {
        z-index: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3rem 6rem;
        padding: 4rem;

        .PageProfile-loading {
          position: absolute;
          width: 100%;
          z-index: 1;
        }

        .PageProfile-introduction {
          .PageProfile-introduction-body {
            width: 20em;
            max-width: 100%;
            background: hsla(0, 0%, 0%, 0.8);
            color: white;
            display: flex;
            flex-direction: column;
            gap: 1em;
            padding: 2em;
            border-radius: 1em;
            .PageProfile-user-name {
              font-size: 2em;
            }
            .PageProfile-user-main {
              display: flex;
              flex-direction: row;
              column-gap: 4rem;

              & > * {
                display: flex;
                flex-direction: column;
              }
            }
          }
        }

        .PageProfile-section-changePassword {
          width: max-content;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 2rem;

          .PageProfile-section-changePassword-body {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
          }
          .PageProfile-section-changePassword-arrow {
            transform: rotate(-90deg);
          }
        }
      }
    }
  }
</style>
