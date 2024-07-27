import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { usePageStore } from './page.store';
import { useWindowStore } from './window.store';

export enum Layout {
  WIDE,
  THIN,
}

export enum Visibility {
  NONE,
  EXPANDED,
  COLLAPSED,
}

export interface LayoutRequest {
  page: string;
  view: string;
  layout: number;
}
export interface VisibilityRequest {
  page: string;
  view: string;
  visibility: number;
}

export const MIN_WIDTH = 1000;

export const LAYOUTS = [Layout.WIDE, Layout.THIN];

export const VISIBILITIES = [Visibility.NONE, Visibility.EXPANDED, Visibility.COLLAPSED];

export const useNavigationStore = defineStore('navigation', () => {
  const defaultVisibility = ref(Visibility.COLLAPSED);
  const defaultLayout = ref(Layout.WIDE);
  const visibilityRequests = ref<VisibilityRequest[]>([]);
  const layoutRequests = ref<LayoutRequest[]>([]);

  function getCurrentPageKey(): string {
    return usePageStore().currentPageKey;
  }
  function getCurrentViewKey(): string {
    return usePageStore().currentViewKey;
  }

  function getVisibilityRequest(
    page: string = '',
    view: string = '',
  ): VisibilityRequest | undefined {
    return visibilityRequests.value.find((request) => {
      return request.page === page && request.view === view;
    });
  }
  function getLayoutRequest(page: string = '', view: string = ''): LayoutRequest | undefined {
    return layoutRequests.value.find((request) => {
      return request.page === page && request.view === view;
    });
  }

  function setDefaultVisibility(visibility: Visibility): void {
    if (!VISIBILITIES.includes(visibility)) return;
    defaultVisibility.value = visibility;
  }
  function setDefaultLayout(layout: Layout): void {
    if (!LAYOUTS.includes(layout)) return;
    defaultLayout.value = layout;
  }

  function setVisibility(visibility: Visibility): void {
    if (!VISIBILITIES.includes(visibility)) return;

    const page = getCurrentPageKey();
    const view = getCurrentViewKey();
    const request = getVisibilityRequest(page, view);
    if (request) request.visibility = visibility;
    else visibilityRequests.value.push({ page, view, visibility });
  }
  function setLayout(layout: Layout): void {
    if (!LAYOUTS.includes(layout)) return;

    const page = getCurrentPageKey();
    const view = getCurrentViewKey();
    const request = getLayoutRequest(page, view);
    if (request) request.layout = layout;
    else layoutRequests.value.push({ page, view, layout });
  }

  function getCurrentVisibilityRequest(): VisibilityRequest | undefined {
    const page = getCurrentPageKey();
    const view = getCurrentViewKey();
    const request = getVisibilityRequest(page, view);

    return request ?? undefined;
  }
  function getCurrentLayoutRequest(): LayoutRequest | undefined {
    const page = getCurrentPageKey();
    const view = getCurrentViewKey();
    const request = getLayoutRequest(page, view);

    return request ?? undefined;
  }

  function getCurrentVisibility(): Visibility {
    const request = getCurrentVisibilityRequest();
    if (request) return request.visibility;
    return defaultVisibility.value;
  }
  function getCurrentLayout(): Layout {
    const request = getCurrentLayoutRequest();
    if (request) return request.layout;
    return defaultLayout.value;
  }

  function isWide(): boolean {
    return !isThin();
  }
  function isThin(): boolean {
    if (isDrawer()) return false;

    const windowStore = useWindowStore();

    if (getCurrentLayout() === Layout.WIDE) {
      return windowStore.width <= MIN_WIDTH;
    }
    return getCurrentLayout() === Layout.THIN;
  }

  function isDrawer(): boolean {
    return useWindowStore().width <= 600;
  }

  function isNone(): boolean {
    return getCurrentVisibility() === Visibility.NONE;
  }
  function isExpanded(): boolean {
    return getCurrentVisibility() === Visibility.EXPANDED;
  }
  function isCollapsed(): boolean {
    return getCurrentVisibility() === Visibility.COLLAPSED;
  }

  function openDrawer(): void {
    setVisibility(Visibility.EXPANDED);
  }
  function closeDrawer(): void {
    setVisibility(Visibility.COLLAPSED);
  }
  function disableDrawer(): void {
    setVisibility(Visibility.NONE);
  }

  return {
    defaultVisibility: computed(() => defaultVisibility.value),
    defaultLayout: computed(() => defaultLayout.value),
    visibilityRequests: computed(() => visibilityRequests.value),
    layoutRequests: computed(() => layoutRequests.value),
    setDefaultVisibility,
    setDefaultLayout,
    setVisibility,
    setLayout,
    getCurrentVisibilityRequest,
    getCurrentLayoutRequest,
    getCurrentVisibility,
    getCurrentLayout,
    isWide,
    isThin,
    isDrawer,
    isNone,
    isExpanded,
    isCollapsed,
    openDrawer,
    closeDrawer,
    disableDrawer,
  };
});
