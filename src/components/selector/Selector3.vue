<script setup lang="ts">
  import ItemMenu from "./Selector3/ItemMenu.vue";
  import { computed, onMounted, watch } from "vue";
  import { type Menu } from "./Selector3/Menu";
  import { optArray, optString } from "@/U";

  const emits = defineEmits<{ clickMenu: [Menu] }>();
  const props = withDefaults(
    defineProps<{ menus?: any[]; defaultKey?: string; selectedKey?: string }>(),
    { defaultKey: "", selectedKey: "" },
  );

  const Menus = computed(() => optArray(props.menus).map((menu) => menu));
  const DefaultKey = computed(() => optString(props.defaultKey));
  const DefaultMenu = computed(() =>
    Menus.value.find((menu) => menu.key === DefaultKey.value),
  );

  watch(() => DefaultMenu.value, invalidateDefaultMenu);

  onMounted(() => {
    invalidateDefaultMenu();
  });

  function invalidateDefaultMenu() {
    setSelectedMenu(DefaultMenu.value);
  }

  function setSelectedMenu(menu: Menu) {
    if (menu) emits("clickMenu", menu);
  }
</script>

<template>
  <div class="Selector3">
    <div class="Selector3-menus">
      <ItemMenu
        v-for="menu of Menus"
        :key="menu.key"
        :item="menu"
        :isSelected="menu.key === selectedKey"
        @click="setSelectedMenu(menu)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .Selector3-separator {
    min-width: 1px;
    height: 100%;
    max-height: calc(100% - 0.8rem);
    background: hsl(0, 0%, 90%);
    margin-left: 0.8rem;
    margin-right: 0.8rem;
  }
  .Selector3 {
    display: flex;
    flex-direction: column;
    .Selector3-menus {
      overflow-x: auto;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-start;
      gap: 0.2rem;
    }
  }
</style>
