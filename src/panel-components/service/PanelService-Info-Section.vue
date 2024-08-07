<script setup lang="ts">
import ButtonIcon from '@/components/button/ButtonIcon.vue';
import { computed } from 'vue';

interface Menu {
  title: string;
  icon: string;
  click: () => void;
}

const props = withDefaults(
  defineProps<{
    title?: string;
    menus?: Menu | Menu[];
    isExpand?: boolean;
  }>(),
  { title: '', menus: () => [], isExpand: true },
);

const theMenus = computed<Menu[]>(() => {
  if (Array.isArray(props.menus)) return props.menus;
  if (props.menus) return [props.menus];
  return [];
});
const hasTitle = computed(() => props.title.length > 0);
const hasMenus = computed(() => theMenus.value.length > 0);
</script>

<template>
  <div class="PanelService-Info-Section transition" :isExpand="`${isExpand}`">
    <div class="PanelService-Info-Section-body" :isHorizontal="`${!hasTitle && hasMenus}`">
      <div class="PanelService-Info-Section-header" v-if="hasTitle || hasMenus">
        <div class="PanelService-Info-Section-title" v-if="hasTitle">
          {{ title }}
        </div>

        <div class="PanelService-Info-Section-menus" v-if="hasMenus">
          <ButtonIcon
            v-for="menu of theMenus"
            :key="menu.title"
            :src="menu.icon"
            @click="() => menu.click()"
          />
        </div>
      </div>

      <div class="PanelService-Info-Section-main"><slot></slot></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.PanelService-Info-Section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  .PanelService-Info-Section-body {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;

    .PanelService-Info-Section-header {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;

      .PanelService-Info-Section-title {
        text-align: start;
        font-weight: 600;
        flex-grow: 1;
        font-size: 0.9rem;
        color: black;
      }
      .PanelService-Info-Section-menus {
        width: max-content;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        margin-top: 0.2rem;
        margin-right: 0.2rem;
        & > * {
          font-size: 0.8rem;
        }
      }
    }
    .PanelService-Info-Section-main {
      width: 100%;

      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
      gap: 0.2rem;
    }
  }
  .PanelService-Info-Section-body[isHorizontal='false'] {
    flex-direction: column;
    .PanelService-Info-Section-header {
      width: 100%;
    }
  }
  .PanelService-Info-Section-Section-body[isHorizontal='true'] {
    flex-direction: row-reverse;
    .PanelService-Info-Section-header {
      .PanelService-Info-Section-menus {
        flex-direction: column;
        align-items: center;
      }
    }
    .PanelService-Info-Section-main {
      flex-grow: 1;
    }
  }
}

.PanelService-Info-Section[isExpand='false'] {
  height: 0;
  opacity: 0;
  pointer-events: none;
}
</style>
