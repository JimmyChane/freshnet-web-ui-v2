<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const props = withDefaults(defineProps<{ isShowing?: boolean }>(), {
  isShowing: false,
});

const show = ref(false);
const animate = ref(false);

watch(() => props.isShowing, invalidate);

function invalidate() {
  show.value = true;
  animate.value = false;

  if (props.isShowing) {
    const xIsShowing = props.isShowing;

    setTimeout(() => {
      if (props.isShowing === xIsShowing) animate.value = true;
    }, 300);
  } else {
    const xIsShowing = props.isShowing;

    setTimeout(() => {
      if (props.isShowing === xIsShowing) show.value = false;
    }, 300);
  }
}

onMounted(() => invalidate());
</script>

<template>
  <div v-if="show" :class="['Loading', animate ? 'Loading-isShowing' : 'Loading-isHiding']">
    <div class="Loading-body"><div class="Loading-bar"></div></div>
  </div>
</template>

<style lang="scss" scoped>
.Loading {
  width: 100%;
  height: 10px;
  background: hsla(0, 0%, 0%, 0.2);
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: flex-start;
  pointer-events: none;
  opacity: 0;
  transition: 1s;
  overflow: hidden;

  .Loading-body {
    position: relative;
    min-width: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;
    .Loading-bar {
      position: absolute;
      min-width: 0%;
      min-height: 100%;
      background: var(--primary-color);
      animation: Loadingv1Animation 1.4s linear infinite;
    }
  }

  @keyframes Loadingv1Animation {
    from {
      transform: translateX(-50%);
    }
    to {
      min-width: 100%;
      transform: translateX(100%);
    }
  }
}

.Loading-isShowing {
  opacity: 1;
}
.Loading-isHiding {
  opacity: 0;
}
</style>
