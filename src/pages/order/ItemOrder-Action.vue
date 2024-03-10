<script setup lang="ts">
  import { computed, ref } from "vue";

  const emits = defineEmits<{ buttonClick: [void] }>();
  const props = withDefaults(
    defineProps<{
      color?: string;
      text?: string;
      textColor?: string;
      icon?: string;
      iconActive?: string;
    }>(),
    { color: "var(--primary-color)", text: "Click Me", textColor: "" },
  );

  const focused = ref(false);
  const hovered = ref(false);
  const style = ref({ color: "", textColor: "" });

  const cIcon = computed(() => {
    if (props.iconActive) {
      if (focused.value || hovered.value) {
        return props.iconActive;
      }
    }

    return props.icon;
  });
  const primaryColor = computed(() => {
    return props.color;
  });
  const cTextColor = computed(() => {
    return props.textColor !== "" ? props.textColor : primaryColor.value;
  });
</script>

<template>
  <button
    class="ItemOrder-Action transition"
    :style="{ '--primary-color': primaryColor, color: cTextColor }"
    @blur="focused = false"
    @click="$emit('button-click')"
    @focus="focused = true"
    @mouseleave="hovered = false"
    @mouseover="hovered = true"
  >
    <img v-if="icon" class="ItemOrder-Action-icon" :src="cIcon" />
    <span v-if="text" class="ItemOrder-Action-text">{{ text }}</span>
  </button>
</template>

<style lang="scss" scoped>
  .ItemOrder-Action {
    --primary-color: var(--primary-color);

    padding: 0.25rem 1rem;
    border-radius: 0.5rem;
    border: 1px var(--primary-color) solid;
    background: transparent;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    gap: 0.75rem;

    .ItemOrder-Action-icon {
      width: 1.125rem;
      height: 1.125rem;
    }
    .ItemOrder-Action-text {
      color: inherit;
      font-size: 0.8rem;
    }

    &:hover,
    &:focus {
      background: var(--primary-color);

      .ItemOrder-Action-text {
        color: white;
      }
    }
  }
</style>
