<script setup lang="ts">
  import Empty from "@/components/Empty.vue";
  import LoadingDots from "@/components/loading/LoadingDots.vue";
  import Footer from "@/app/footer/AppFooter.vue";
  import TabLayout from "./PanelProducts-TabLayout.vue";
  import CategoryTabVue from "./PanelProducts-CategoryTab.vue";
  import BrandTab from "./PanelProducts-BrandTab.vue";
  import ActionbarProduct from "./ActionBarProduct.vue";
  import ItemProduct from "./ItemProduct.vue";
  import ProductGroup from "./PanelProducts-Group.vue";
  import chroma from "chroma-js";
  import IconAdd from "@/assets/icon/add-000000.svg";
  import { Product } from "@/data/product/Product";
  import { computed, onMounted, ref, watch } from "vue";
  import { useProductStore } from "@/data-stores/product.store";
  import { useLoginStore } from "@/stores/login.store";
  import { useCategoryStore } from "@/data-stores/category.store";
  import { Image } from "@/data/Image";
  import ProductIcon from "@/assets/icon/products-2A4858.svg";
  import { useRouteStore } from "@/stores/route.store";
  import { useWindowStore } from "@/stores/window.store";
  import { useRoute } from "vue-router";
  import type { TabMenu } from "./CategoryTab";

  const route = useRoute();

  interface Menu {
    key?: string;
    title: string;
    icon?: Image | string;
    background?: string;
    click?: (menu: Menu) => void;
    isSelected?: () => boolean;
  }
  class MenuGroup {
    key: string;
    title: string;
    menus: Menu[];

    menu?: Menu;

    constructor(key: string, title: string, menus: Menu[]) {
      this.key = key;
      this.title = title;
      this.menus = menus;

      for (const menu of this.menus) {
        menu.click = () => {
          this.menu = menu;
          const query: Record<string, string> = {};
          query[this.key] = menu.key ?? "";

          if (route.query[this.key] !== menu.key) {
            useRouteStore().replaceQuery({ query });
          }
        };

        if (route.query[this.key] === menu.key) {
          this.menu = menu;
        }
      }

      if (this.menu === null) {
        this.menu = this.menus[0];
      }
    }
  }

  const emits = defineEmits<{ clickProductAdd: [void] }>();
  withDefaults(defineProps<{ products?: Product[] }>(), {
    products: () => [],
  });

  const labelMenuPrimaryColor = ref(chroma("000000"));
  const currentProductId = ref("");
  const categoryTabs = ref<TabMenu[]>([]);
  const brandTabs = ref<TabMenu[]>([]);
  const filterMenus = ref<MenuGroup[]>([]);
  const productGroups = ref<
    {
      id: string;
      key: string;
      title: string;
      icon: string;
      items: Product[];
    }[]
  >([]);

  const iconEmpty = computed(() => ProductIcon);

  const isLayoutThin = computed(() => useWindowStore().width < 550);
  const layoutMode = computed(() => ItemProduct.Mode.Grid);

  const queryProductId = computed(() => route.query.productId);
  const queryCategoryId = computed(() => route.query.category);
  const queryBrandId = computed(() => route.query.brand);
  const queryStock = computed(() => route.query.stock);

  const isLoading = computed(() => useProductStore().isLoading);
  const isEmpty = computed(
    () => !isLoading.value && !productGroups.value.length,
  );
  const isEditable = computed(() => {
    const { user } = useLoginStore();
    return user.isTypeAdmin() || user.isTypeStaff();
  });

  const initRightMenus = computed(() => {
    if (!isEditable.value) return undefined;

    const menus = [];
    if (isEditable.value) {
      const menuStock = filterMenus.value.find((menu) => {
        return menu.key === "stock";
      });

      if (menuStock) {
        menus.push({
          title:
            menuStock.menu?.title === "All"
              ? "Showing All"
              : "Showing Available",
          isHidden: true,
          click: () => {
            if (menuStock.menu) {
              const index = menuStock.menus.indexOf(menuStock.menu) + 1;
              const nextIndex = index < menuStock.menus.length ? index : 0;
              const menu = menuStock.menus[nextIndex];
              if (typeof menu.click === "function") menu.click(menu);
            }
          },
        });
      }
    }

    menus.push({
      title: "Add",
      icon: IconAdd,
      click: () => emits("clickProductAdd"),
    });

    return menus;
  });

  watch(() => queryProductId.value, invalidateProductId);
  watch(() => queryCategoryId.value, invalidate);
  watch(() => queryBrandId.value, invalidate);
  watch(() => queryStock.value, invalidate);
  watch(() => isEditable.value, invalidate);
  watch(() => useProductStore().lastModified, invalidate);
  watch(() => useCategoryStore().lastModified, invalidate);

  async function invalidate() {
    scrollToTop();
    invalidateProductId();

    let categoryGroups = await useProductStore().getGroupsByCategory();
    let brandGroups = await useProductStore().getGroupsByBrand();

    if (!isEditable.value) {
      categoryGroups = categoryGroups
        .filter((categoryGroup) => {
          categoryGroup.items = categoryGroup.items.filter((product) => {
            if (!product.toImageThumbnail()) return false;
            if (!product.isStockAvailable()) return false;
            return true;
          });
          return categoryGroup.items.length > 0;
        })
        .sort((categoryGroup1, categoryGroup2) => {
          if (categoryGroup1.parent && categoryGroup2.parent)
            return categoryGroup1.parent.compare(categoryGroup2.parent);
          return 0;
        });
    }
    brandGroups = brandGroups
      .filter((brandGroup) => {
        return brandGroup.parent && brandGroup.items.length > 0;
      })
      .sort((brandGroup1, brandGroup2) => {
        if (brandGroup1.parent && brandGroup2.parent)
          return brandGroup1.parent.compare(brandGroup2.parent);
        return 0;
      });
    categoryGroups.sort((categoryGroup1, categoryGroup2) => {
      if (categoryGroup1.parent && categoryGroup2.parent)
        return categoryGroup1.parent.compare(categoryGroup2.parent);
      return 0;
    });

    // menus
    const categoryMenus = new MenuGroup("category", "Category", [
      { title: "All" },
      ...categoryGroups.map((categoryGroup) => {
        return {
          key: categoryGroup.parent?.id ?? "",
          title: categoryGroup.parent?.title ?? "",
          background: categoryGroup.parent?.background?.toUrl() ?? "",
        };
      }),
    ]);
    const brandMenus = new MenuGroup("brand", "Brand", [
      { title: "All" },
      ...brandGroups.map((brandGroup) => {
        return {
          key: brandGroup.parent?.id,
          title: brandGroup.parent?.title ?? "",
        };
      }),
    ]);

    // tabs
    categoryTabs.value = categoryMenus.menus.map((menu) => {
      return {
        title: menu.title,
        background: menu.background,
        isSelected: (tab) => categoryMenus.menu === menu,
        click: (tab) => {
          if (typeof menu.click === "function") menu.click(menu);
        },
      };
    });
    brandTabs.value = brandMenus.menus.map((menu) => {
      return {
        title: menu.title,
        icon: menu.icon instanceof Image ? menu.icon?.toUrl() ?? "" : menu.icon,
        isSelected: (tab) => brandMenus.menu === menu,
        click: (tab) => {
          if (typeof menu.click === "function") menu.click(menu);
        },
      };
    });

    // filters
    filterMenus.value = [];
    if (isEditable.value) {
      filterMenus.value.push(
        new MenuGroup("stock", "Stock", [
          { key: "all", title: "All" },
          { title: "Available" },
        ]),
      );
    }

    // products
    productGroups.value = categoryGroups
      .map((categoryGroup) => {
        const items = categoryGroup.items
          .filter((item) => {
            if (!isEditable.value) return item.isStockAvailable();
            if (queryStock.value === "all") return true;
            return item.isStockAvailable();
          })
          .filter((product) => {
            if (!queryCategoryId.value) return true;
            return product.categoryId === queryCategoryId.value;
          })
          .filter((product) => {
            if (!queryBrandId.value) return true;
            return product.brandId === queryBrandId.value;
          })
          .sort((product1, product2) => {
            return product1.compare(product2);
          });
        return {
          id: categoryGroup.parent?.id ?? "",
          key: categoryGroup.parent?.key ?? "",
          title: categoryGroup.parent?.title ?? "",
          icon: categoryGroup.parent?.icon?.toUrl() ?? "",
          items,
        };
      })
      .filter((group) => group.items.length > 0);
  }
  function invalidateProductId() {
    if (!queryProductId.value) {
      setTimeout(() => {
        currentProductId.value = queryProductId.value?.toString() ?? "";
      }, 500);
    } else {
      currentProductId.value = queryProductId.value.toString();
    }
  }
  function scrollToTop() {
    refSelf.value?.scrollTo({ top: 0, behavior: "smooth" });
  }

  const refSelf = ref<HTMLDivElement>();

  onMounted(() => {
    invalidate();
  });
</script>

<template>
  <div class="PanelProducts" ref="refSelf">
    <ActionbarProduct
      :style="{ 'z-index': '2', 'margin-bottom': '0.5rem' }"
      :products="products"
      :rightMenus="initRightMenus"
      @click-search="$emit('click-search')"
    />

    <div class="PanelProducts-body">
      <span class="PanelProducts-body-title" v-if="categoryTabs.length > 0">
        Category
      </span>
      <TabLayout v-if="categoryTabs.length > 0">
        <CategoryTabVue
          v-for="menu of categoryTabs"
          :key="menu.title"
          :menu="menu"
        />
      </TabLayout>

      <span class="PanelProducts-body-title" v-if="brandTabs.length > 0">
        Brand
      </span>
      <TabLayout v-if="brandTabs.length > 0">
        <BrandTab v-for="menu of brandTabs" :key="menu.title" :menu="menu" />
      </TabLayout>

      <div class="PanelProducts-categories">
        <ProductGroup
          v-for="group of productGroups"
          :key="group.id"
          :group="group"
          :isWide="!(productGroups.length > 1 && isLayoutThin)"
          :layoutMode="layoutMode"
          :currentProductId="currentProductId"
          :queryBrandId="queryBrandId?.toString()"
          :queryStock="queryStock?.toString()"
          :queryGroupKey="queryCategoryId?.toString()"
        />
      </div>

      <LoadingDots style="z-index: 3" :isShowing="isLoading" />
      <Empty v-if="isEmpty" :icon="iconEmpty" />
    </div>

    <Footer />
  </div>
</template>

<style lang="scss" scoped>
  .PanelProducts {
    z-index: 1;
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    overflow-y: auto;

    .PanelProducts-actionbar {
      width: 100%;
      z-index: 2;
      position: sticky;
      top: 0;

      border-bottom: 1px solid hsl(0, 0%, 80%);
      background: var(--App-background-color);
    }
    .PanelProducts-body {
      z-index: 1;
      width: 100%;
      padding-bottom: 10vh;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;

      .PanelProducts-body-title {
        width: 100%;
        padding: 0 1rem;
        margin-top: 0.5rem;
        margin-bottom: 0.2rem;
        font-weight: 600;
        font-size: 0.8rem;

        &:first-child {
          margin-top: 0;
        }
      }

      .PanelProducts-categories {
        z-index: 2;
        width: 100%;
        gap: 0.5rem;
        margin-top: 0.5rem;
        display: flex;
        flex-direction: column;
      }
    }
  }
</style>
