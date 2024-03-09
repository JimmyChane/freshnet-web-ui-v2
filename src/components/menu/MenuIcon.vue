<script setup lang="ts">
  import { Corner, Width } from "@/stores/popup-menu/PopupMenu";
  import Icon from "../Icon.vue";
  import Menu from "./Menu.vue";

  const emits = defineEmits<{
    mouseover: [MouseEvent];
    mouseleave: [MouseEvent];
    show: [void];
    hide: [void];
  }>();
  withDefaults(
    defineProps<{
      width?: Width;
      corner?: Corner;
      menus?: any[];

      src?: string;
      alt?: string;
    }>(),
    {
      width: Width.AUTO,
      corner: Corner.AUTO,

      src: "",
      alt: "",
    },
  );
</script>

<template>
  <Menu
    class="MenuIcon"
    :width="width"
    :corner="corner"
    :menus="menus"
    @mouseover="(x) => emits('mouseover', x)"
    @mouseleave="(x) => emits('mouseleave', x)"
    @show="() => emits('show')"
    @hide="() => emits('hide')"
  >
    <Icon :src="src" :alt="alt" />
  </Menu>
</template>

<style lang="scss" scoped>
  .MenuIcon {
    font-size: 1rem;
    font-weight: 600;

    --size: 2.7em;
    min-width: var(--size);
    min-height: var(--size);
    width: var(--size);
    height: var(--size);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    cursor: pointer;
    background: none;
    border: none;
    border-radius: 50%;

    overflow: hidden;

    &:hover,
    &:focus-within {
      background: hsla(0, 0%, 0%, 0.1);
    }
  }
</style>
