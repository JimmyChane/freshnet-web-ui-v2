<script setup lang="ts">
  import { computed, onMounted, ref } from "vue";
  import { RouterLink, type RouteLocationRaw } from "vue-router";
  import IconLinkWhite from "@/assets/icon/link-FFFFFF.svg";
  import IconLinkColor from "@/assets/icon/link-1673E1.svg";
  import IconExternalColor from "@/assets/icon/external-1673E1.svg";
  import IconExternalWhite from "@/assets/icon/external-FFFFFF.svg";

  const props = defineProps({
    to: { type: [String, Object as () => RouteLocationRaw], default: "" },
    href: { type: String, default: "" },
    target: { type: String, default: "" },
    icon: { type: String },
  });

  const isHover = ref(false);
  const refExternal = ref<HTMLLinkElement>();
  const refLink = ref<typeof RouterLink>();

  const iconLinkWhite = computed(() => {
    return props.icon ?? IconLinkWhite;
  });
  const iconLinkColor = computed(() => {
    return props.icon ?? IconLinkColor;
  });
  const iconExternalWhite = computed(() => {
    return props.icon ?? IconExternalWhite;
  });
  const iconExternalColor = computed(() => {
    return props.icon ?? IconExternalColor;
  });

  const mouseEnter = () => {
    isHover.value = true;
  };
  const mouseLeave = () => {
    isHover.value = false;
  };
  const listenElement = (element: HTMLElement) => {
    element.addEventListener("mouseenter", mouseEnter);
    element.addEventListener("mouseleave", mouseLeave);
    element.addEventListener("touchstart", mouseEnter);
    element.addEventListener("touchend", mouseLeave);
  };

  onMounted(() => {
    const external = refExternal.value as HTMLLinkElement;
    const link = refLink.value as typeof RouterLink;

    if (link) listenElement(link.$el);
    if (external) listenElement(external);
  });
</script>

<template>
  <a
    class="SectionWhatElse-Item"
    ref="refExternal"
    v-if="!!href"
    :href="href"
    :target="target"
  >
    <slot />
    <img :src="isHover ? iconExternalWhite : iconExternalColor" />
  </a>

  <RouterLink
    class="SectionWhatElse-Item"
    ref="refLink"
    v-else-if="!!to"
    :to="to"
  >
    <slot />
    <img :src="isHover ? iconLinkWhite : iconLinkColor" />
  </RouterLink>

  <span class="SectionWhatElse-Item" v-else>
    <slot />
  </span>
</template>

<style lang="scss" scoped>
  .SectionWhatElse-Item {
    width: 100%;
    height: 100%;
    min-height: 3.5em;
    color: var(--primary-color);

    font-size: 0.9em;
    font-weight: 600;

    position: relative;

    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    transition: all 400ms ease;
  }
  a.SectionWhatElse-Item {
    border: 2px solid var(--primary-color);
    border-radius: 1em;
    text-decoration: none;

    &:hover {
      background: var(--primary-color);
      color: white;
    }
    img {
      position: absolute;
      pointer-events: none;
      right: 0.8em;

      width: 0.8em;
      height: 0.8em;
    }
  }
</style>
