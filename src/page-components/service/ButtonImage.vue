<script setup lang="ts">
import ImageView from '@/components/image-viewer/ImageView.vue';
import MenuOption from '@/components/button/MenuOption.vue';

const emits = defineEmits<{ click: [string]; clickRemove: [string] }>();
withDefaults(defineProps<{ src: string }>(), { src: '' });
</script>

<template>
  <div class="ButtonImage">
    <button class="ButtonImage-image-button" @click="emits('click', src)">
      <ImageView class="ButtonImage-image" :src="src" />
    </button>
    <div class="ButtonImage-foreground transition"></div>
    <div class="ButtonImage-option">
      <MenuOption
        :menus="[
          {
            key: 'delete',
            title: 'Delete',
            interact: () => emits('clickRemove', src),
          },
        ]"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ButtonImage {
  width: inherit;
  height: inherit;
  position: relative;
  display: flex;
  flex-direction: row;
  border-radius: inherit;
  &:hover {
    .ButtonImage-foreground {
      opacity: 1;
    }
  }
  .ButtonImage-image-button {
    width: inherit;
    height: inherit;
    z-index: 1;
    display: flex;
    flex-direction: row;
    border: none;
    border-radius: inherit;
    background: none;
    cursor: pointer;
    &:focus {
      .ButtonImage-image {
        transform: scale(0.96);
      }
    }
    .ButtonImage-image {
      width: inherit;
      height: inherit;
      object-fit: cover;
      display: flex;
      flex-direction: row;
      border-radius: inherit;
      border: 1px solid hsl(0, 0%, 80%);
    }
  }
  .ButtonImage-foreground {
    z-index: 2;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    min-width: 100%;
    min-height: 100%;
    max-width: 100%;
    max-height: 100%;
    border-radius: inherit;
    pointer-events: none;
    background: hsla(0, 0%, 100%, 0.7);
    opacity: 0;
  }
  .ButtonImage-option {
    z-index: 3;
    position: absolute;
    top: 0.2rem;
    right: 0.2rem;
  }
}
</style>
