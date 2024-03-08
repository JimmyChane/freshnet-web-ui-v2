import { defineStore } from "pinia";
import { ref } from "vue";
import { Navigation } from "./Navigation";

export const useNavigationStore = defineStore("navigation", () => {
  const navigation = ref(new Navigation());

  return { navigation };
});
