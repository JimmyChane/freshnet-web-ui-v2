import { Snackbar, type SnackbarOption } from "@/stores/snackbar/Snackbar";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useSnackbarStore = defineStore("snackbar", () => {
  const items = ref<Snackbar[]>([]);

  function show(option: string | SnackbarOption) {
    if (typeof option === "string") option = { text: option };
    items.value.push(new Snackbar(option).show());
  }

  return {
    items: computed(() => items.value),
    show,
  };
});
