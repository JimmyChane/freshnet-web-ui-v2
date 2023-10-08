import { defineStore } from "pinia";
import { ref } from "vue";

export const useStore = defineStore("store", () => {
  const window = ref<{ innerWidth: number; innerHeight: number }>({
    innerWidth: 0,
    innerHeight: 0,
  });

  return { window };
});
