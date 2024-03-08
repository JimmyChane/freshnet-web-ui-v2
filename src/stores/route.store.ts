import { replace } from "@/U";
import { defineStore } from "pinia";
import { useRoute, useRouter } from "vue-router";

export const useRouteStore = defineStore("route", () => {
  const route = useRoute();
  const router = useRouter();

  function nextQuery(param: { query: Record<string, any> }) {
    const query = replace(route.query, param.query);

    if (!query) return;

    router.push({ query });
  }
  function replaceQuery(param: { query?: Record<string, any> }) {
    const query = replace(route.query, param.query);

    if (!query) return;

    router.replace({ query });
  }

  return { nextQuery, replaceQuery };
});
