<script setup lang="ts">
withDefaults(defineProps<{ text?: string; isRequired?: boolean }>(), {
  text: '',
  isRequired: false,
});
</script>

<template>
  <div class="TextString">
    <span class="TextString-text">{{ text }}</span>
    <span class="TextString-isRequired" v-if="isRequired">Required</span>
  </div>
</template>

<style lang="scss" scoped>
.TextString {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: flex-start;
  justify-content: center;

  .TextString-text {
    font-size: inherit;
    font-weight: inherit;
  }
  .TextString-isRequired {
    color: hsl(0, 50%, 50%);
    font-weight: 400;
    font-size: 0.7em;
  }
}
</style>
