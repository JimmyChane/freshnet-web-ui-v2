<script setup lang="ts">
import { Label } from '@/data/ServiceLabel';
import { computed } from 'vue';

const emits = defineEmits<{ click: [void] }>();

const props = withDefaults(defineProps<{ label: Label; isClickable?: boolean }>(), {
  isClickable: true,
});

const hexColor = computed(() => props.label.hexColor);
const title = computed(() => props.label.title);
</script>

<template>
  <button
    class="Label"
    :style="{ '--primary-color': `#${hexColor}` }"
    :isClickable="`${isClickable}`"
    @click="emits('click')"
  >
    <span class="transition">{{ title }}</span>
    <img class="transition" src="@/assets/icon/close-FFFFFF.svg" />
  </button>
</template>

<style lang="scss" scoped>
.Label[isClickable='false'] {
  pointer-events: none;
  :nth-child(2) {
    display: none;
  }
}
.Label[isClickable='true'] {
  cursor: pointer;
}
.Label {
  min-width: max-content;
  gap: 0.3em;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  background: var(--primary-color);
  color: white;
  font-size: 0.8em;
  padding: 0.4em;
  padding-left: 0.5em;
  border-radius: 0.4em;
  border: none;
  line-height: 0.9em;

  :nth-child(2) {
    width: 0.8em;
    height: 0.8em;
    opacity: 0;
  }
  &:hover {
    :nth-child(1) {
      opacity: 0.5;
    }
    :nth-child(2) {
      opacity: 1;
    }
  }
}
</style>
