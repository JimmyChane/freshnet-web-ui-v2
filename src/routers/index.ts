import { createRouter, createWebHistory } from "vue-router";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/pages/home/PageHome.vue"),
    },
    { path: "/:pathMatch(.*)*", redirect: { name: "home" } },
  ],
});
