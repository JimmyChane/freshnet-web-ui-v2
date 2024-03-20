<script setup lang="ts">
  import { serverCloudinary } from "@/data/server/Server";
  import {
    Layout,
    MIN_WIDTH,
    useNavigationStore,
  } from "@/stores/navigation/navigation.store";
  import { useWindowStore } from "@/stores/window.store";
  import { computed } from "vue";

  const props = withDefaults(defineProps<{ isWide?: boolean }>(), {
    isWide: false,
  });

  const navigationStore = useNavigationStore();
  const windowStore = useWindowStore();

  const isDrawer = computed(() => navigationStore.isDrawer());
  const isExpand = computed(() => navigationStore.isExpanded());
  const toggleButtonVisible = computed(() => {
    return navigationStore.isThin() || windowStore.innerWidth > MIN_WIDTH;
  });

  function toggleCollapse() {
    if (isDrawer.value) {
      isExpand.value
        ? navigationStore.closeDrawer()
        : navigationStore.openDrawer();
      return;
    }

    const nextLayout = props.isWide ? Layout.THIN : Layout.WIDE;

    navigationStore.getCurrentLayoutRequest() === null
      ? navigationStore.setDefaultLayout(nextLayout)
      : navigationStore.setLayout(nextLayout);
  }
</script>

<template>
  <div class="LeftNavHeader" :isWide="`${isWide}`">
    <router-link class="LeftNavHeader-logo transition" :to="{ path: '/' }">
      <img
        class="LeftNavHeader-icon transition"
        :src="
          serverCloudinary({
            url: 'logo/svg/freshnet-enterprise-logo.svg',
          })
        "
      />
      <span class="LeftNavHeader-title">Freshnet Enterprise</span>
    </router-link>

    <button
      class="LeftNavHeader-collapse"
      v-if="toggleButtonVisible"
      @click="() => toggleCollapse()"
    >
      <img class="transition" src="@/assets/icon/arrowDown-000000.svg" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
  .LeftNavHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.4rem;
    padding-right: 0;

    position: sticky;
    top: 0;

    background: inherit;

    .LeftNavHeader-logo {
      gap: 0.5rem;
      padding: 1rem;

      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      cursor: pointer;
      text-decoration: none;
      color: var(--primary-color);
      background: none;

      &:hover {
        text-decoration: underline;
      }

      .LeftNavHeader-title {
        font-weight: 600;
        line-height: 1;
        color: black;
      }
    }
    .LeftNavHeader-collapse {
      background: none;
      border: none;
      border-radius: 50%;
      padding: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      img {
        padding: 0.5rem;
        width: 2rem;
        height: 2rem;
        transform: rotate(90deg);
      }
    }
  }

  .LeftNavHeader[isWide="true"] {
    flex-direction: row;
    .LeftNavHeader-logo {
      .LeftNavHeader-icon {
        width: 1.8rem;
        height: 1.8rem;
      }
    }
    .LeftNavHeader-collapse {
      img {
        transform: rotate(90deg);
      }
      &:hover {
        img {
          transform: scale(0.9) rotate(90deg);
        }
      }
    }
  }
  .LeftNavHeader[isWide="false"] {
    flex-direction: column-reverse;
    gap: 0.5rem;
    .LeftNavHeader-logo {
      .LeftNavHeader-icon {
        width: 1.3rem;
        height: 1.3rem;
      }
      .LeftNavHeader-title {
        display: none;
      }
    }
    .LeftNavHeader-collapse {
      img {
        transform: rotate(-90deg);
      }
      &:hover {
        img {
          transform: scale(0.9) rotate(-90deg);
        }
      }
    }
  }
</style>
