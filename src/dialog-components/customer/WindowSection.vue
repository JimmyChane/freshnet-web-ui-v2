<script setup lang="ts">
import TextString from '@/page-components/customer/TextString.vue';

withDefaults(defineProps<{ title?: string; isRequired?: boolean }>(), {
  title: '',
  isRequired: false,
});
</script>

<template>
  <div class="WindowSection">
    <TextString
      class="WindowSection-header"
      v-if="title || isRequired"
      :text="title"
      :isRequired="isRequired"
    />

    <div class="WindowSection-main">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.WindowSection {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;

  .WindowSection-header {
    width: 100%;
    font-size: 1.1rem;
    font-weight: 600;
  }
  .WindowSection-main {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
