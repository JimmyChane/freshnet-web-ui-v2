<script setup lang="ts">
  import PanelAction from "@/components/panel/PanelAction.vue";
  import Input from "@/components/Input.vue";
  import { computed, ref } from "vue";
  import { useLoginStore } from "@/stores/login.store";
  import { useSnackbarStore } from "@/stores/snackbar/snackbar.store";
  import { PopupWindow } from "@/stores/popup-window/PopupWindow";

  const props = defineProps<{ popupWindow: PopupWindow }>();

  const passwordVerify = ref("");
  const passwordNew = ref("");
  const passwordRepeat = ref("");

  const isShowing = computed(() => props.popupWindow.isShowing);

  function commitValues() {
    if (passwordNew.value !== passwordRepeat.value) {
      useSnackbarStore().show("Repeat Password Not Match With New Password");
      return;
    }

    useLoginStore()
      .changePassword({
        passwordVerify: passwordVerify.value,
        passwordNew: passwordNew.value,
      })
      .then((user) => props.popupWindow.close())
      .catch((error) => useSnackbarStore().show("Changing Password Error"));
  }
</script>

<template>
  <PanelAction
    title="Change Your Password"
    :isShowing="isShowing"
    @click-dismiss="() => popupWindow.close()"
    @click-cancel="() => popupWindow.close()"
    @click-ok="() => commitValues()"
  >
    <div class="WindowChangePassword">
      <Input
        class="WindowChangePassword-first"
        type="password"
        label="Current Password"
        :isRequired="true"
        v-model="passwordVerify"
      />

      <Input
        type="password"
        label="New Password"
        :isRequired="true"
        v-model="passwordNew"
      />

      <Input
        type="password"
        label="Repeat Password"
        :isRequired="true"
        v-model="passwordRepeat"
      />
    </div>
  </PanelAction>
</template>

<style lang="scss" scoped>
  .WindowChangePassword {
    z-index: 3;

    display: flex;
    flex-direction: column;
    gap: 1rem;

    & > * {
      background: hsla(0, 0%, 0%, 0.03);
    }
    .WindowChangePassword-first {
      margin-bottom: 2rem;
    }
  }
</style>
