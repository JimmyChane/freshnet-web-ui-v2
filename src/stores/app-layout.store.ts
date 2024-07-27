import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { usePageStore } from './page.store';

export enum Layout {
  NORMAL,
  FULL,
}

export interface LayoutRequest {
  page: string;
  view: string;
  mode: number;
}

export const LAYOUTS = [Layout.NORMAL, Layout.FULL];

export const useAppLayoutStore = defineStore('app-layout', () => {
  const requests = ref<LayoutRequest[]>([]);

  function getCurrentPageKey(): string {
    return usePageStore().currentPageKey;
  }

  function getCurrentViewKey(): string {
    return usePageStore().currentViewKey;
  }

  function getVisibilityRequest(page: string, view: string): LayoutRequest | undefined {
    return requests.value.find((request) => {
      return request.page === page && request.view === view;
    });
  }

  function getCurrentVisibilityRequest(): { page: string; view: string; mode: number } | undefined {
    const page = getCurrentPageKey();
    const view = getCurrentViewKey();
    const request = getVisibilityRequest(page, view);

    return request ?? undefined;
  }

  function setLayout(mode: Layout): void {
    if (!LAYOUTS.includes(mode)) return;

    const page = getCurrentPageKey();
    const view = getCurrentViewKey();
    const request = getVisibilityRequest(page, view);

    if (request) request.mode = mode;
    else requests.value.push({ page, view, mode });
  }

  function getCurrentLayout(): number {
    const request = getCurrentVisibilityRequest();
    return request?.mode ?? Layout.FULL;
  }

  function isNormal(): boolean {
    return getCurrentLayout() === Layout.NORMAL;
  }

  function isFull(): boolean {
    return getCurrentLayout() === Layout.FULL;
  }

  return {
    requests: computed(() => requests.value),
    setLayout,
    getCurrentLayout,
    isNormal,
    isFull,
  };
});
