import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useWindowStore = defineStore("window", () => {
  const innerWidth = ref(0);
  const innerHeight = ref(0);

  window.addEventListener("resize", invalidateWindow);

  function invalidateWindow() {
    innerWidth.value = window.innerWidth;
    innerHeight.value = window.innerHeight;
  }
  invalidateWindow();

  return {
    innerWidth: computed(() => innerWidth.value),
    innerHeight: computed(() => innerHeight.value),
  };
});
