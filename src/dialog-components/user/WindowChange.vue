<script setup lang="ts">
import PanelAction from '@/components/panel/PanelAction.vue';
import Selector from '@/components/selector/Selector.vue';
import { User, UserType } from '@/data/User';
import type { PopupWindow } from '@/stores/popup-window/PopupWindow';
import { computed } from 'vue';
import type { WindowChangeOption } from './WindowChange';

const props = defineProps<{
  popupWindow: PopupWindow<WindowChangeOption<{ user: User }>>;
}>();

const isShowing = computed(() => props.popupWindow.isShowing);
const user = computed(() => props.popupWindow.data.data?.user);
</script>

<template>
  <PanelAction
    title="Add User"
    :isShowing="isShowing"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => popupWindow.data.onConfirm({ user, userType: popupWindow.userType })"
  >
    <div class="PageUsers-window">
      <div class="PageUsers-window-main">
        <span class="PageUsers-window-text">
          {{ user ? user.name : 'Unknown' }}
          is
          {{ user ? user.toTextUserType() : '' }}
        </span>
      </div>

      <div class="PageUsers-window-main">
        <span class="PageUsers-window-title">New User Type</span>
        <span class="PageUsers-window-required">Required</span>
        <Selector
          :list="[
            { key: UserType.Admin.toString(), title: 'Admin' },
            { key: UserType.Staff.toString(), title: 'Staff' },
          ]"
          :keySelected="popupWindow.data.data?.user.userType.toString()"
          @callback-select="
            (key) => {
              const user = popupWindow.data.data?.user;
              if (user) return (user.userType = key as unknown as UserType);
            }
          "
        />
      </div>
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
.PageUsers-window {
  width: 20rem;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .PageUsers-window-main {
    display: flex;
    flex-direction: column;
    gap: 10px;
    .PageUsers-window-title {
      font-size: 1.1rem;
      font-weight: 600;
    }
    .PageUsers-window-inputText {
      flex-grow: 1;
      font-size: 1rem;
      border: none;
      border-bottom: 1px solid hsl(0, 0%, 70%);
      background: none;
      padding: 4px 0;
    }
    .PageUsers-window-text {
      flex-grow: 1;
      font-size: 1rem;
      padding: 4px 0;
    }
    .PageUsers-window-required {
      color: hsl(0, 50%, 50%);
      font-size: 0.8rem;
    }
  }
}
</style>
