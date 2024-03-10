import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

import PageLogin from "@/pages/login/PageLogin.vue";

const itemProductRoutes: RouteRecordRaw[] = [
  {
    path: "/item/id/:id",
    component: () => import("@/pages/product/PageProduct.vue"),
    beforeEnter(to, from, next) {
      next({ path: "/product/view", query: { productId: to.params.id } });
    },
  },
  {
    path: "/product/id/:id",
    component: () => import("@/pages/product/PageProduct.vue"),
    beforeEnter(to, from, next) {
      next({ path: "/product/view", query: { productId: to.params.id } });
    },
  },
];
const comboProductRoutes: RouteRecordRaw[] = [
  {
    path: "/product/combo",
    redirect: "/product/browse",
    children: [{ path: "*", redirect: "/product/browse" }],
  },
];
const productRoutes: RouteRecordRaw[] = [
  {
    path: "/product",
    name: "product",
    component: () => import("@/pages/product/PageProduct.vue"),
    children: [
      {
        path: "browse",
        redirect: "/product",
        children: [{ path: ":category", redirect: "/product" }],
      },
    ],
  },
  {
    path: "/product/view",
    component: () => import("@/pages/product/PageProductView.vue"),
  },
  {
    path: "/product/export",
    component: () => import("@/pages/product/PageProductExport.vue"),
  },
];
const manageRoutes: RouteRecordRaw[] = [
  {
    path: "/manage",
    component: () => import("@/pages/manage/PageManage.vue"),
    beforeEnter(to, from, next) {
      let { query } = to;
      let { view } = query;

      if (!view) {
        view = "service";
        delete query.view;
      }

      try {
        next({ path: `/manage/${view}`, query });
      } catch (error) {}
    },
  },
  {
    path: "/manage/product",
    component: () => import("@/pages/manage/PageManage.vue"),
    beforeEnter(to, from, next) {
      let { query } = to;
      if (query) {
        let { item } = query;

        if (typeof item === "string") {
          query.productId = item;
          delete query.item;
        }
      }

      try {
        next({ path: "/product/browse", query });
      } catch (error) {}
    },
  },
  {
    path: "/manage",
    name: "manage",
    component: () => import("@/pages/manage/PageManage.vue"),
    children: [
      {
        path: "profile",
        component: () => import("@/pages/profile/PageProfile.vue"),
      },
      {
        path: "customer",
        component: () => import("@/pages/customer/PageCustomer.vue"),
      },
      {
        path: "service",
        component: () => import("@/pages/service/PageService.vue"),
      },
      {
        path: "order",
        component: () => import("@/pages/order/PageOrder.vue"),
      },
      {
        path: "users",
        component: () => import("@/pages/users/PageUsers.vue"),
      },
      {
        path: "database",
        component: () => import("@/pages/database/PageDatabase.vue"),
      },
      {
        path: "setting",
        component: () => import("@/pages/setting/PageSetting.vue"),
      },
    ],
  },
];
const homeRoutes: RouteRecordRaw[] = [
  {
    path: "/home",
    name: "home",
    component: () => import("@/pages/home/PageHome.vue"),
  },
];
const loginRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: PageLogin,
  },
];
const printRoutes: RouteRecordRaw[] = [
  {
    path: "/print",
    name: "print",
    component: () => import("@/pages/print/PagePrint.vue"),
  },
];
const errorRoutes: RouteRecordRaw[] = [
  {
    path: "/error/404",
    name: "error/404",
    component: () => import("@/pages/error/Page404.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...itemProductRoutes,
    ...comboProductRoutes,
    ...productRoutes,
    ...manageRoutes,
    ...homeRoutes,
    ...loginRoutes,
    ...printRoutes,
    ...errorRoutes,
    { path: "/", redirect: { path: "/home" } },
    { path: "/:pathMatch(.*)*", redirect: { path: "/error/404" } },
  ],
});

export default router;
