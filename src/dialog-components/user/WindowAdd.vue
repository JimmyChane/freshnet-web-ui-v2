<script setup lang="ts">
import PanelAction from '@/components/panel/PanelAction.vue';
import Input from '@/components/input/Input.vue';
import type { PopupWindow } from '@/stores/popup-window/PopupWindow';
import { computed, ref } from 'vue';

const props = defineProps<{ popupWindow: PopupWindow }>();

const isShowing = computed(() => props.popupWindow.isShowing);

const username = ref('');
const name = ref('');
const passwordNew = ref('');
const passwordRepeat = ref('');

function commit() {
  props.popupWindow.onConfirm({
    username: username.value,
    name: name.value,
    passwordNew: passwordNew.value,
    passwordRepeat: passwordRepeat.value,
  });
}
</script>

<template>
  <PanelAction
    title="Add User"
    :isShowing="isShowing"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => commit()"
  >
    <div class="PageUsers-window">
      <Input label="Username" :isRequired="true" v-model="username" />
      <Input label="Name" autocapitalize="words" :isRequired="true" v-model="name" />
      <Input label="Password" type="password" :isRequired="true" v-model="passwordNew" />
      <Input label="Repeat Password" type="password" :isRequired="true" v-model="passwordRepeat" />
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
