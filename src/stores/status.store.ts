import { defineStore } from "pinia";
import { useLoginStore } from "./login.store";
import { computed, ref, watch } from "vue";

export const useStatusStore = defineStore("status", () => {
  const shouldShowStatus = ref(false);

  watch(() => useLoginStore().user, onUser);
  async function onUser() {
    const user = await useLoginStore().getUser();

    if (user.isTypeAdmin() || user.isTypeStaff()) {
      shouldShowStatus.value = true;
    } else {
      shouldShowStatus.value = false;
    }
  }
  onUser();

  return {
    shouldShowStatus: computed(() => shouldShowStatus.value),
  };
});
