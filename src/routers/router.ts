import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

export const ITEM_PRODUCT_ROUTES: RouteRecordRaw[] = [
  {
    path: '/item/id/:id',
    component: () => import('@/pages/PageProduct.vue'),
    beforeEnter(to, from, next) {
      next({ path: '/product/view', query: { productId: to.params.id } });
    },
  },
  {
    path: '/product/id/:id',
    component: () => import('@/pages/PageProduct.vue'),
    beforeEnter(to, from, next) {
      next({ path: '/product/view', query: { productId: to.params.id } });
    },
  },
];
export const COMBO_PRODUCT_ROUTES: RouteRecordRaw[] = [
  {
    path: '/product/combo',
    redirect: '/product/browse',
    children: [{ path: '*', redirect: '/product/browse' }],
  },
];
export const PRODUCT_ROUTES: RouteRecordRaw[] = [
  {
    path: '/product',
    name: 'product',
    component: () => import('@/pages/PageProduct.vue'),
    children: [
      {
        path: 'browse',
        redirect: '/product',
        children: [{ path: ':category', redirect: '/product' }],
      },
    ],
  },
  {
    path: '/product/view',
    component: () => import('@/pages/PageProductView.vue'),
  },
  {
    path: '/product/export',
    component: () => import('@/pages/PageProductExport.vue'),
  },
];
export const MANAGE_ROUTES: RouteRecordRaw[] = [
  {
    path: '/manage',
    component: () => import('@/pages/PageManage.vue'),
    beforeEnter(to, from, next) {
      let { query } = to;
      let { view } = query;

      if (!view) {
        view = 'service';
        delete query.view;
      }

      try {
        next({ path: `/manage/${view}`, query });
      } catch (error) {}
    },
  },
  {
    path: '/manage/product',
    component: () => import('@/pages/PageManage.vue'),
    beforeEnter(to, from, next) {
      let { query } = to;
      if (query) {
        let { item } = query;

        if (typeof item === 'string') {
          query.productId = item;
          delete query.item;
        }
      }

      try {
        next({ path: '/product/browse', query });
      } catch (error) {}
    },
  },
  {
    path: '/manage',
    name: 'manage',
    component: () => import('@/pages/PageManage.vue'),
    children: [
      {
        path: 'profile',
        component: () => import('@/pages/PageProfile.vue'),
      },
      {
        path: 'customer',
        component: () => import('@/pages/PageCustomer.vue'),
      },
      {
        path: 'service',
        component: () => import('@/pages/PageService.vue'),
      },
      {
        path: 'order',
        component: () => import('@/pages/PageOrder.vue'),
      },
      {
        path: 'users',
        component: () => import('@/pages/PageUsers.vue'),
      },
      {
        path: 'database',
        component: () => import('@/pages/PageDatabase.vue'),
      },
      {
        path: 'setting',
        component: () => import('@/pages/PageSetting.vue'),
      },
    ],
  },
];
export const HOME_ROUTES: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/PageHome.vue'),
  },
];
export const LOGIN_ROUTES: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/PageLogin.vue'),
  },
];
export const PRINT_ROUTES: RouteRecordRaw[] = [
  {
    path: '/print',
    name: 'print',
    component: () => import('@/pages/PagePrint.vue'),
  },
];
export const ERROR_ROUTES: RouteRecordRaw[] = [
  {
    path: '/error/404',
    name: 'error/404',
    component: () => import('@/pages/Page404.vue'),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes: [...HOME_ROUTES, { path: '/:pathMatch(.*)*', redirect: { name: 'home' } }],
});
