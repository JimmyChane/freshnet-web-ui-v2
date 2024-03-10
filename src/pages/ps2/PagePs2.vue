<script setup lang="ts">
  import Actionbar from "@/components/actionbar/Actionbar.vue";
  import LoadingDots from "@/components/LoadingDots.vue";
  import ButtonIcon from "@/components/button/ButtonIcon.vue";
  import Empty from "@/components/Empty.vue";
  import PopupWindow from "@/components/window/PopupWindow.vue";
  import Footer from "@/app/footer/Footer.vue";

  import WindowItemPs2Disc from "./WindowItemPs2Disc.vue";
  import ItemPs2Disc from "./ItemPs2Disc.vue";

  import IconHamburgerMenu from "@/assets/icon/hamburgerMenu-000000.svg";
  import IconClose from "@/assets/icon/close-2A4858.svg";
  import IconSearch from "@/assets/icon/search-2A4858.svg";
  import Logo from "@/assets/logo/freshnet-enterprise-logo.svg";
  import { computed, onMounted, ref } from "vue";
  import { usePs2Store } from "@/data-stores/ps2.store";
  import { useRoute } from "vue-router";
  import { useStore } from "@/stores/store";
  import { useSnackbarStore } from "@/stores/snackbar/snackbar.store";
  import { useRouteStore } from "@/stores/route.store";
  import { useNavigationStore } from "@/stores/navigation/navigation.store";

  const route = useRoute();

  const navigationStore = useNavigationStore();

  const pagePs2Root = ref<HTMLDivElement>();

  const searchKeyword = ref("");

  const isLoading = computed(() => usePs2Store().isLoading);
  const ps2Discs = computed(() => usePs2Store().items);
  const ps2DiscSearches = computed(() => {
    let searchKeywords = searchKeyword.value.toLowerCase().split(" ");
    if (searchKeywords.length == 0) return [];
    return ps2Discs.value.filter((disc) => disc.toCount(searchKeywords) > 0);
  });
  const currentDiscCode = computed(() => {
    return route.query.discCode;
  });
  const currentDisc = computed(() => {
    let xCurrentDiscCode =
      typeof currentDiscCode.value === "string"
        ? currentDiscCode.value.trim().toLowerCase()
        : "";
    return ps2Discs.value.find((disc) => {
      return disc.code.toLowerCase() === xCurrentDiscCode;
    });
  });

  function scrollToTop() {
    if (!pagePs2Root.value) return;
    if (!pagePs2Root) return;
    pagePs2Root.value.scrollTo(0, 0);
  }

  onMounted(() => {
    usePs2Store()
      .getItems()
      .catch((error) => {
        useSnackbarStore().show("Failed to load");
        console.error(error);
      });
  });
</script>

<template>
  <div class="PagePs2" ref="pagePs2Root">
    <div class="PagePs2-body">
      <Actionbar
        class="PagePs2-header transition"
        :leftMenus="
          navigationStore.navigation.isDrawer()
            ? [
                {
                  title: 'Hamburger Menu',
                  icon: IconHamburgerMenu,
                  click: () =>
                    navigationStore.navigation.openNavigationDrawer(),
                },
                {
                  title: 'Home',
                  icon: Logo,
                  click: () => $router.push({ name: 'home' }),
                },
              ]
            : []
        "
      >
        <div class="PagePs2-header-body">
          <div class="PagePs2-header-search transition">
            <input
              class="PagePs2-header-search-input"
              v-model="searchKeyword"
              placeholder="Search PS2 disc"
              @input="(event) => scrollToTop()"
            />

            <ButtonIcon
              v-if="searchKeyword"
              :src="IconClose"
              alt="Clear"
              @click="searchKeyword = ''"
            />
            <ButtonIcon :src="IconSearch" alt="Search" />
          </div>
        </div>
      </Actionbar>

      <div class="PagePs2-main" v-if="ps2Discs.length">
        <div class="PagePs2-section transition" v-if="searchKeyword">
          <div class="PagePs2-section-title-body">
            <h2 class="PagePs2-section-title">Search Results</h2>
            <h2 class="PagePs2-section-count">
              {{ `(${ps2DiscSearches.length})` }}
            </h2>
          </div>
          <p v-if="!ps2DiscSearches.length" class="PagePs2-section-description">
            No Search Results
          </p>
          <div class="PagePs2-item-list">
            <div
              v-for="ps2DiscSearch in ps2DiscSearches"
              :key="ps2DiscSearch.code"
              class="PagePs2-item-body"
            >
              <div class="PagePs2-line-seperator-horizontal"></div>
              <router-link
                class="PagePs2-itemLink"
                :to="{ query: { discCode: ps2DiscSearch.code } }"
                ><ItemPs2Disc :ps2Disc="ps2DiscSearch"
              /></router-link>
            </div>
          </div>
        </div>

        <div class="PagePs2-section transition">
          <p v-if="!ps2Discs.length" class="PagePs2-section-description">
            No Item
          </p>
          <div class="PagePs2-item-list">
            <div
              v-for="ps2Disc in ps2Discs"
              :key="ps2Disc.code"
              class="PagePs2-item-body"
            >
              <div class="PagePs2-line-seperator-horizontal" />
              <router-link
                class="PagePs2-itemLink transition"
                :to="{ query: { discCode: ps2Disc.code } }"
                ><ItemPs2Disc :ps2Disc="ps2Disc"
              /></router-link>
            </div>
          </div>
        </div>
      </div>

      <Empty
        v-if="!ps2Discs.length && !isLoading"
        :icon="$options.icon.dark.toUrl()"
      />

      <Footer />
    </div>

    <PopupWindow
      class="PagePs2-window"
      :isShowing="!!currentDisc"
      @click-dismiss="
        () => {
          if (route.fullPath !== '/ps2') {
            useRouteStore().replaceQuery({ query: { discCode: null } });
          }
        }
      "
    >
      <WindowItemPs2Disc v-if="currentDisc" :item="currentDisc" />
    </PopupWindow>

    <LoadingDots style="z-index: 3" :isShowing="isLoading" />
  </div>
</template>

<style lang="scss" scoped>
  .PagePs2 {
    --shadow-light: hsla(0, 0%, 0%, 0.2);
    --shadow-dark: hsla(0, 0%, 0%, 0.4);

    --width-max: 1000px;

    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row-reverse;
    position: relative;

    .PagePs2-body {
      flex-grow: 1;
      z-index: 1;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-y: auto;

      .PagePs2-header {
        z-index: 2;
        width: 100%;
        border-bottom: 1px solid hsl(0, 0%, 80%);
        overflow: initial;
        .PagePs2-header-body {
          width: 100%;
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          align-items: center;
          gap: 0.8rem;

          .PagePs2-header-search {
            width: 100%;
            color: #5c5c5c;
            display: flex;
            flex-direction: row;
            align-items: center;
            border-radius: 8px;
            padding: 0.2rem 0.5rem;
            padding-top: 0.4rem;

            background: hsla(0, 0%, 100%, 0.3);
            border: 1px solid hsla(0, 0%, 0%, 0.15);

            .PagePs2-header-search-input {
              outline: none;
              border: none;
              padding: 0.5rem;
              background: none;
              display: flex;
              flex-direction: row;
              flex-grow: 1;
              align-items: center;
            }
          }
        }
      }

      .PagePs2-main {
        z-index: 1;
        width: 100%;
        max-width: var(--width-max);
        text-align: start;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-bottom: 4em;
        .PagePs2-section {
          width: 100%;
          padding: 1.6rem;
          font-size: 1rem;
          display: flex;
          flex-direction: column;
          padding-bottom: 2rem;

          .PagePs2-section-title-body {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            padding: 4px;
            column-gap: 10px;

            .PagePs2-section-title {
              font-size: 1.2rem;
              font-weight: 600;
              margin: 0.75rem 0;
            }

            .PagePs2-section-count {
              font-size: 0.8rem;
              color: hsla(0, 0%, 0%, 0.8);
              margin: 1rem 0;
              font-style: normal;
              font-weight: 400;
            }
          }

          .PagePs2-section-description {
            display: flex;
            padding: 4px;
            color: rgb(75, 75, 75);
            font-size: 0.8rem;
          }

          .PagePs2-item-list {
            padding: 4px;
            display: flex;
            flex-direction: column;

            .PagePs2-item-body {
              display: flex;
              flex-direction: column;

              .PagePs2-line-seperator-horizontal {
                width: 100%;
                height: 0.5px;
                background: hsla(0, 0%, 0%, 0.1);
                margin: px;
              }
              .PagePs2-itemLink {
                color: black;
                text-decoration: none;
                text-align: start;
                border: none;
                background: none;
                cursor: pointer;

                &:hover,
                &:focus {
                  background: hsla(0, 0%, 0%, 0.1);
                }
              }
            }
          }
        }
      }
    }

    .PagePs2-window {
      z-index: 2;
      width: 100%;
      height: 100%;
    }
  }
</style>
