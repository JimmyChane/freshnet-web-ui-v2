<script setup lang="ts">
  import NavigationBar from "@/components/actionbar/NavigationBar.vue";
  import Loading from "@/components/Loading.vue";
  import Empty from "@/components/Empty.vue";
  import ItemUser from "./ItemUser.vue";

  import WindowAdd from "./WindowAdd.vue";
  import WindowRemove from "./WindowRemove.vue";
  import WindowChange from "./WindowChange.vue";

  import IconAdd from "@/assets/icon/add-000000.svg";
  import IconRefresh from "@/assets/icon/refresh-000000.svg";
  import { computed, onMounted } from "vue";
  import { useUserStore } from "@/data-stores/user.store";
  import { useLoginStore } from "@/stores/login.store";
  import { optNumber } from "@/U";
  import { useSnackbarStore } from "@/stores/snackbar/snackbar.store";
  import { usePopupWindowStore } from "@/stores/popup-window/popup-window.store";
  import { Menu } from "@/stores/popup-menu/PopupMenu";
  import User from "@/data/user/User";

  const isLoading = computed(() => useUserStore().isLoading);
  const isCurrentUserAdmin = computed(() => user.value?.isTypeAdmin() ?? false);
  const user = computed(() => useLoginStore().user);
  const users = computed(() => {
    return (!user.value.isTypeNone() ? useUserStore().items : []).sort(
      (user1, user2) => {
        if (user1.username === user.value.username) return -1;
        if (user2.username === user.value.username) return 1;
        return 0;
      },
    );
  });

  function isCurrentUser(user: User) {
    if (!user) return false;
    return user.username === user.username;
  }

  function onIntentRefresh() {
    useUserStore()
      .refresh()
      .catch((error) => {
        useSnackbarStore().show("Failed to validate user");
      });
  }

  async function openWindowAdd() {
    const popupWindow = await usePopupWindowStore().open({
      component: WindowAdd,
      data: {
        onConfirm: async (data: any) => {
          try {
            const user = await useUserStore().addUser({
              username: data.username,
              name: data.name,
              passwordNew: data.passwordNew,
              passwordRepeat: data.passwordRepeat,
            });

            if (user) {
              popupWindow.close();
              return;
            }
            useSnackbarStore().show("Failed to add user");
            throw new Error();
          } catch (error) {
            useSnackbarStore().show("Error to add user");
          }
        },
      },
    });
  }
  async function openWindowRemove(user: User) {
    const popupWindow = usePopupWindowStore().openWindowRemove({
      onConfirm: async () => {
        try {
          const result = await useUserStore().removeUserByUsername({
            username: user.username,
          });

          if (result) {
            popupWindow.close();
            return;
          }
          useSnackbarStore().show("Failed to remove user");
          throw new Error();
        } catch (error) {
          useSnackbarStore().show("Error to remove user");
        }
      },
    });
  }
  async function openWindowChange(user: User) {
    const popupWindow = await usePopupWindowStore().open({
      component: WindowChange,
      data: {
        user,
        userType: user.userType,
        onConfirm: async (data: any) => {
          try {
            const userTypeNumber = optNumber(Number.parseInt(data.userType), 0);

            const userChange = await useUserStore().updateTypeOfUserByUsername({
              username: data.user.username,
              userType: `${userTypeNumber}`,
            });
            if (userChange) {
              popupWindow.close();
              return;
            }
            useSnackbarStore().show("Failed to change user priviledge");
            throw new Error();
          } catch (error) {
            useSnackbarStore().show("Error to change user priviledge");
          }
        },
      },
    });
  }

  const rightMenus = computed(() => {
    const menus: Menu[] = [];

    if (isCurrentUserAdmin.value) {
      menus.push({
        key: "addUser",
        title: "Add User",
        icon: IconAdd,
        click: () => openWindowAdd(),
      });
    }

    menus.push({
      key: "refresh",
      title: "Refresh",
      icon: IconRefresh,
      click: () => onIntentRefresh(),
    });

    return menus;
  });

  onMounted(() => onIntentRefresh());
</script>

<template>
  <div class="PageUsers">
    <NavigationBar :title="$options.title" :rightMenus="rightMenus" />

    <div class="PageUsers-body" v-if="users.length">
      <ItemUser
        v-for="user in users"
        :key="user.username"
        :item="user"
        :isEditable="isCurrentUserAdmin && !isCurrentUser(user)"
        :isCurrentUser="isCurrentUser(user)"
        @click-changeUserType="(user) => openWindowChange(user)"
        @click-remove="(user) => openWindowRemove(user)"
      />
    </div>

    <Empty
      v-if="!users.length && !isLoading"
      :icon="$options.icon.dark.toUrl()"
    />

    <Loading class="PageUsers-loading" :isShowing="isLoading" />
  </div>
</template>

<style lang="scss" scoped>
  .PageUsers {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    .PageUsers-body {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 4rem;
      gap: 0.2rem;

      & > * {
        width: 100%;
        max-width: 24rem;
      }
    }

    .PageUsers-loading {
      position: absolute;
      width: 100%;
      z-index: 100;
    }

    .PageUsers-user-root {
      width: 100%;
      max-width: 24rem;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      &-separator {
        min-height: 1px;
        background: hsla(0, 0%, 0%, 0.1);
        margin: 1rem 0;
      }
    }
  }
</style>
@/stores/data-stores/user.store
