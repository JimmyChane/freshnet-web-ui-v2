<script setup lang="ts">
  import IconHome from "@/components/icon/IconHome.vue";
  import IconProducts from "@/components/icon/IconMagnifyingGlass.vue";
  import IconPaper from "@/components/icon/IconPaper.vue";
  import IconManage from "@/components/icon/IconManage.vue";
  import IconProfile from "@/components/icon/IconProfile.vue";
  import IconCustomers from "@/components/icon/IconCustomers.vue";
  import IconService from "@/components/icon/IconService.vue";
  import IconOrder from "@/components/icon/IconOrder.vue";
  import IconUsers from "@/components/icon/IconUsers.vue";
  import IconDatabase from "@/components/icon/IconDatabase.vue";
  import IconSetting from "@/components/icon/IconSetting.vue";
  import { computed } from "vue";
  import type { NavigationParent, NavigationView } from "../NavigationDrawer";

  const props = withDefaults(
    defineProps<{
      item: NavigationParent | NavigationView;
      isWide?: boolean;
    }>(),
    { isWide: true },
  );

  const key = computed(() => props.item?.key ?? "");
  const icon = computed(() => props.item?.icon);
  const iconLight = computed(() => icon.value?.light ?? "");
  const iconDark = computed(() => icon.value?.dark ?? "");
  const iconUrl = computed(() => iconDark.value);
  const title = computed(() => {
    return props.isWide ? props.item?.title : props.item?.title.substring(0, 1);
  });
  const isSelected = computed(() => props.item.isSelected());
</script>

<template>
  <div class="LeftNavItem" :isSelected="`${isSelected}`" :isWide="`${isWide}`">
    <IconHome
      class="LeftNavItem-icon"
      v-if="key === 'home'"
      :isSelected="isSelected"
    />
    <IconProducts
      class="LeftNavItem-icon"
      v-else-if="key === 'product'"
      :isSelected="isSelected"
    />
    <IconPaper
      class="LeftNavItem-icon"
      v-else-if="key === 'print'"
      :isSelected="isSelected"
    />
    <IconManage
      class="LeftNavItem-icon"
      v-else-if="key === 'manage'"
      :isSelected="isSelected"
    />
    <IconProfile
      class="LeftNavItem-icon"
      v-else-if="key === 'profile'"
      :isSelected="isSelected"
    />
    <IconCustomers
      class="LeftNavItem-icon"
      v-else-if="key === 'customer'"
      :isSelected="isSelected"
    />
    <IconService
      class="LeftNavItem-icon"
      v-else-if="key === 'service'"
      :isSelected="isSelected"
    />
    <IconOrder
      class="LeftNavItem-icon"
      v-else-if="key === 'order'"
      :isSelected="isSelected"
    />
    <IconUsers
      class="LeftNavItem-icon"
      v-else-if="key === 'users'"
      :isSelected="isSelected"
    />
    <IconDatabase
      class="LeftNavItem-icon"
      v-else-if="key === 'database'"
      :isSelected="isSelected"
    />
    <IconSetting
      class="LeftNavItem-icon"
      v-else-if="key === 'setting'"
      :isSelected="isSelected"
    />
    <img class="LeftNavItem-icon" v-else-if="iconUrl" :src="iconUrl" />
    <span
      class="LeftNavItem-title"
      v-if="iconUrl ? isWide && title.length : true"
      >{{ title }}</span
    >
  </div>
</template>

<style lang="scss" scoped>
  .LeftNavItem {
    border: none;
    text-align: center;
    font-size: 1em;
    background: none;
    display: flex;
    flex-direction: row;
    gap: 1em;
    color: var(--primary-color);

    .LeftNavItem-icon {
      --size: 1.2em;
      width: var(--size);
      height: var(--size);
      min-width: var(--size);
      min-height: var(--size);
      max-width: var(--size);
      max-height: var(--size);
      object-fit: scale-down;

      --secondary-color: rgba(0, 0, 0, 0.7);
    }
    .LeftNavItem-title {
      --size: 1.2em;
      flex-grow: 1;
      min-height: var(--size);
      text-align: start;
      font-size: 1em;
      font-weight: 600;
      line-height: 1.2;

      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }

  .LeftNavItem[isWide="true"] {
    width: 100%;
    justify-content: space-between;
  }
  .LeftNavItem[isWide="false"] {
    align-items: center;
    justify-content: center;
    .LeftNavItem-title {
      width: var(--size);
      height: var(--size);
      min-width: var(--size);
      min-height: var(--size);
      max-width: var(--size);
      max-height: var(--size);
      align-items: center;
      justify-content: center;
    }
  }
</style>
