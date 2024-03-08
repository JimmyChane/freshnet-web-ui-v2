import { defineStore } from "pinia";
import { ref } from "vue";
import { AppLayout } from "./AppLayout";

export const useAppLayoutStore = defineStore("app-layout", () => {
  const appLayout = ref(new AppLayout());

  return { appLayout };
});
