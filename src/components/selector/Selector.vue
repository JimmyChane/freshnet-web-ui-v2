<script setup lang="ts">
  const selectionNone: Menu = { key: "", title: "None" };

  import Menu from "@/components/menu/Menu.vue";
  import IconArrowDownLight from "@/assets/icon/arrow_down-white.svg";
  import IconArrowDownDark from "@/assets/icon/arrow_down-black.svg";
  import { computed, onMounted, ref, watch } from "vue";
  import { isColorDark } from "@/U";

  interface Menu {
    key: string;
    title: string;
    icon?: string;
    primaryColor?: string;
    isSelected?: () => boolean;
    click?: () => void;
  }

  const emits = defineEmits<{ callbackSelect: [string] }>();
  const props = withDefaults(
    defineProps<{
      list: {
        key: string;
        title: string;
        icon?: { white?: string; color?: string };
        color?: string;
      }[];
      keySelected?: string;
    }>(),
    { list: () => [], keySelected: "" },
  );

  const isShow = ref(false);
  const menus = ref<Menu[]>([]);
  const shouldShowIcon = ref(false);

  const menuCorner = ref(Menu.Corner.BOTTOM);
  const menuWidth = ref(Menu.Width.SAME);
  const menuAlignment = ref(Menu.Alignment.VERTICAL);

  const currentMenu = computed(() => {
    const selectedMenu = menus.value.find((menu) => {
      if (typeof menu.isSelected === "function") return menu.isSelected();
    });

    return selectedMenu ?? selectionNone;
  });
  const currentIcon = computed(() => {
    const item = props.list.find((item) => item.key === currentMenu.value.key);
    return item?.icon?.white ?? "";
  });
  const currentColor = computed(() => {
    if (
      !currentMenu.value ||
      typeof currentMenu.value.primaryColor !== "string"
    ) {
      return "hsl(0, 0%, 96%)";
    }
    return currentMenu.value.primaryColor;
  });
  const currentFontColor = computed(() => {
    return isColorDark(currentColor.value, 80) ? "white" : "black";
  });

  watch(() => props.list, invalidate);

  function invalidate() {
    shouldShowIcon.value = false;
    menus.value = props.list.map((item) => {
      shouldShowIcon.value = !shouldShowIcon.value ? !!item.icon : true;
      return {
        key: item.key,
        title: item.title,
        icon: item.icon?.color ?? "",
        primaryColor: item.color,
        isSelected: () => item.key === props.keySelected,
        click: () => emits("callbackSelect", item.key),
      };
    });

    if (!shouldShowIcon.value) {
      for (const menu of menus.value) menu.icon = undefined;
    }

    emits("callbackSelect", currentMenu.value.key);
  }

  const SelectorButton = ref();

  onMounted(() => {
    const spinnerButton = SelectorButton.value.$el;
    spinnerButton.addEventListener("focusout", () => {
      setTimeout(() => (isShow.value = false), 100);
    });

    invalidate();
  });
</script>

<template>
  <Menu
    :class="[
      'transition',
      'Selector',
      isShow ? 'Selector-isSelected' : 'Selector-isDeselected',
    ]"
    :style="{ '--primary-color': currentColor, '--color': currentFontColor }"
    :width="menuWidth"
    :alignment="menuAlignment"
    :menus="menus"
    :primaryColor="currentColor"
    ref="SelectorButton"
    @show="() => (isShow = true)"
    @hide="() => (isShow = false)"
  >
    <img
      class="Selector-icon transition"
      v-if="shouldShowIcon && currentIcon"
      :style="{ opacity: currentIcon ? '1' : '0' }"
      :src="currentIcon"
    />
    <span class="Selector-title transition">
      {{ currentMenu.title }}
    </span>
    <div class="Selector-separator transition" />
    <img
      class="Selector-arrow transition"
      :src="currentColor ? IconArrowDownLight : IconArrowDownDark"
      :style="{ transform: isShow ? 'rotate(-180deg)' : 'rotate(0deg)' }"
    />
  </Menu>
</template>

<style lang="scss" scoped>
  .Selector {
    --border-radius: 6px;

    width: 100%;
    padding: 0.6em 1em;
    gap: 0.6em;

    color: var(--color);
    border: 1px solid hsl(0, 0%, 80%);
    border-radius: var(--border-radius);
    background: var(--primary-color);

    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
    align-items: center;

    border-radius: 6px;
    font-weight: 400;
    font-size: 1rem;
    text-align: start;
    overflow: hidden;

    --icon-size: 1.25rem;

    .Selector-icon {
      width: var(--icon-size);
      height: var(--icon-size);
      padding: 0.1rem;
    }
    .Selector-title {
      flex-grow: 100;
    }
    .Selector-separator {
      min-width: 2px;
      min-height: 100%;
      background: hsla(0, 0%, 0%, 0.1);
      display: flex;
      flex-direction: row;
    }
    .Selector-arrow {
      width: var(--icon-size);
      height: var(--icon-size);
      padding: 0.3rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  }

  .Selector-isDeselected {
    &:hover {
      background: var(--primary-color);
    }
  }
</style>
