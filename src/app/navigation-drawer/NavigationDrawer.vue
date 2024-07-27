<script setup lang="ts">
import DrawerVue from '@/components/drawer/Drawer.vue';
import LeftNavHeader from './components/NavigationDrawer-Header.vue';
import NavPage from './components/NavigationDrawer-NavPage.vue';
import LeftNavLogin from './components/NavigationDrawer-Login.vue';
import { Edge, Mode } from '@/components/drawer/Drawer.vue';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useNavigationStore } from '@/stores/navigation.store';
import { usePageStore } from '@/stores/page.store';
import { useRouteStore } from '@/stores/route.store';
import type { NavigationGroup, NavigationParent, NavigationView } from './NavigationDrawer';
import { optArray } from '@/utils/U';

const emits = defineEmits<{ clickLogout: [void] }>();

const navigationStore = useNavigationStore();
const pageStore = usePageStore();
const routeStore = useRouteStore();

const isDragging = ref(false);
const dragTrigger = ref(20);
const dragOpen = ref(80);
const dragWidth = ref(0);

const isWide = computed(() => navigationStore.isWide());
const isDrawer = computed(() => navigationStore.isDrawer());
const isExpand = computed(() => navigationStore.isExpanded());
const selectedPageKey = computed(() => pageStore.currentPageKey);
const selectedViewKey = computed(() => pageStore.currentViewKey);
const expandedPageKey = ref('');

const drawerMode = computed(() => {
  if (!isDrawer.value) return Mode.FIXED;
  return isExpand.value ? Mode.DRAWER_EXPAND : Mode.DRAWER_COLLAPSE;
});
const drawerEdge = computed(() => Edge.LEFT);
const navigations = computed(() => {
  const navigations = pageStore.pages;

  return navigations.map((navigation) => {
    const navParent: NavigationParent = {
      key: navigation.key ?? '',
      title: navigation.title ?? '',
      icon: navigation.icon ?? undefined,
      userPermissions: navigation.userPermissions ?? [],
      groups: optArray(navigation.groups).map((group) => {
        const navGroup: NavigationGroup = {
          key: group.key ?? '',
          title: group.title ?? '',
          icon: group.icon ?? '',
          values: group.values ?? [],
          children: group.children,
          userPermissions: group.userPermissions ?? [],
          isLink: group.isLink ?? false,
          isQuery: group.isQuery ?? false,
          groups: optArray(group.groups).map((group) => {
            const navView: NavigationView = {
              key: group.key ?? '',
              title: group.title ?? '',
              icon: group.icon ?? undefined,

              isExpanded: () => false,
              isSelected: () => {
                if (navGroup.isQuery) {
                  return getQueryValue(navGroup.key) === navGroup.key;
                } else {
                  return selectedViewKey.value === navGroup.key;
                }
              },
              isWide: () => isWide.value,

              getParent: () => navGroup,
              getLink: () => `/${navParent.key}/${navView.key}`,

              click: () => {
                if (navGroup.isQuery) clickQuery(navView);
              },
            };
            return navView;
          }),

          isExpanded: () => false,
          isWide: () => isWide.value,
          getParent: () => navParent,
        };

        return navGroup;
      }),

      isExpanded: () => expandedPageKey.value === navParent.key,
      isSelected: () => selectedPageKey.value === navParent.key,
      isWide: () => isWide.value,
      clickExpand: () => {
        expandedPageKey.value = expandedPageKey.value === navParent.key ? '' : navParent.key;
      },
      click: () => emitCollapse(),
    };

    return navParent;
  });
});

const refDrawer = ref<typeof DrawerVue>();
const refBody = ref<HTMLDivElement>();

watch(
  () => isExpand.value,
  (value) => {
    if (value) focus();
  },
);

function addTouchListeners() {
  document.addEventListener('touchstart', onTouchStart);
  document.addEventListener('touchmove', onTouchMove);
  document.addEventListener('touchend', onTouchEnd);
}
function removeTouchListeners() {
  document.removeEventListener('touchstart', onTouchStart);
  document.removeEventListener('touchmove', onTouchMove);
  document.removeEventListener('touchend', onTouchEnd);
}

function onTouchStart(e: TouchEvent) {
  if (!refDrawer.value) {
    removeTouchListeners();
    return;
  }
  if (!refBody.value) {
    removeTouchListeners();
    return;
  }

  dragWidth.value = refBody.value.offsetWidth;

  const touch = [...e.changedTouches][0];
  let x = touch.pageX;
  const y = touch.pageY;

  if (x > dragTrigger.value) return;
  if (x < dragTrigger.value) x = dragTrigger.value;
  refDrawer.value.onDragStart(x, y);
  isDragging.value = true;
}
function onTouchMove(e: TouchEvent) {
  if (!isDragging.value) return;
  if (!refDrawer.value) return;

  const touch = [...e.changedTouches][0];
  const x = touch.pageX > dragWidth.value ? dragWidth.value : touch.pageX;
  const y = touch.pageY;
  refDrawer.value.onDragMove(x, y);
}
function onTouchEnd(e: TouchEvent) {
  if (!isDragging.value) return;
  if (!refDrawer.value) return;

  const touch = [...e.changedTouches][0];
  const x = touch.pageX > dragWidth.value ? dragWidth.value : touch.pageX;
  const y = touch.pageY;
  refDrawer.value.onDragEnd(x, y);
  if (x > dragOpen.value) {
    navigationStore.openDrawer();
    focus();
  }
  isDragging.value = false;
}

function emitCollapse() {
  navigationStore.closeDrawer();
  expandedPageKey.value = '';
}

function hasQueryKey(key: string) {
  const { query } = useRoute();
  return Object.keys(query).includes(key);
}
function getQueryValue(key: string) {
  const { query } = useRoute();
  return query[key];
}
function clickQuery(view: NavigationView) {
  const key = view.getParent().key;
  const nextValue = view.key;

  const currentValue = getQueryValue(key);
  if (currentValue === nextValue) return;

  if ((hasQueryKey('') && getQueryValue('') === undefined) || (key === '' && nextValue === '')) {
    routeStore.replaceQuery({});
    return;
  }

  const query: Record<string, string> = {};
  query[key] = nextValue;

  routeStore.replaceQuery({ query });
}

function focus() {}

onMounted(() => {
  addTouchListeners();
});
onUnmounted(() => {
  removeTouchListeners();
});

defineExpose({ focus });
</script>

<template>
  <DrawerVue
    ref="refDrawer"
    class="NavigationDrawer"
    :isWide="`${isWide}`"
    :mode="drawerMode"
    :edge="drawerEdge"
    @click-collapse="() => emitCollapse()"
  >
    <div class="NavigationDrawer-body scrollbar transition" ref="refBody">
      <LeftNavHeader style="z-index: 3" :isWide="isWide" />

      <div class="NavigationDrawer-navigations" style="z-index: 1" v-if="navigations.length">
        <NavPage
          v-for="group1 of navigations"
          :key="group1.key"
          :group1="group1"
          @click-group3="() => emitCollapse()"
        />
      </div>

      <LeftNavLogin
        style="z-index: 2"
        v-if="pageStore.currentPageKey !== 'login'"
        @click-logout="emits('clickLogout')"
        :isWide="isWide"
      />
    </div>
  </DrawerVue>
</template>

<style lang="scss" scoped>
.NavigationDrawer {
  .NavigationDrawer-body {
    width: 18rem;
    height: 100%;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    overflow-y: auto;
    overflow-x: hidden;
    background: white;
    position: relative;

    .NavigationDrawer-line {
      background: hsl(0, 0%, 70%);
      min-height: 1px;
      margin: 1.2rem 0.8rem;
    }

    .NavigationDrawer-navigations {
      flex-grow: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: 0 0.2em;
      padding-bottom: 4em;
      gap: 0.2em;
    }
    .NavigationDrawer-login {
      position: sticky;
      bottom: 0;
      width: 100%;
      box-shadow: 0px 0px 20px #49748940;
    }
  }

  .NavigationDrawer-body {
    --scrollbar-size: 0.2rem;
    --scrollbar-thumb-color: hsla(0, 0%, 0%, 0.1);
    --scrollbar-thumb-color-hover: hsla(0, 0%, 0%, 0.3);
    --scrollbar-track-color: hsla(0, 0%, 0%, 0.1);
    --scrollbar-track-color-hover: hsla(0, 0%, 0%, 0.2);
  }
}
.NavigationDrawer[isWide='true'] {
  .NavigationDrawer-body {
    .NavigationDrawer-navigations {
      align-items: flex-start;
    }
  }
}
.NavigationDrawer[isWide='false'] {
  .NavigationDrawer-body {
    width: fit-content;
    .NavigationDrawer-navigations {
      align-items: center;
    }
  }
}
</style>
