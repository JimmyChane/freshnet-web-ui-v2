<script setup lang="ts">
  import NavViewGroup from "./NavigationDrawer-NavViewGroup.vue";
  import NavigationLeftClickable from "./NavigationDrawer-Clickable.vue";
  import { optArray } from "@/U";
  import { type StyleValue, computed } from "vue";
  import type { NavigationParent } from "../NavigationDrawer";

  const props = defineProps<{ group1: NavigationParent }>();

  const group2s = computed(() => optArray(props.group1.groups));
  const hasChildren = computed(() => group2s.value.length > 0);

  const isExpanded = computed(() => props.group1.isExpanded());
  const isSelected = computed(() => props.group1.isSelected());
  const isWide = computed(() => props.group1.isWide());

  const style = computed(() => {
    const style: StyleValue = {};

    if (isWide.value) {
      style["width"] = "100%";
      style["border-radius"] = "0.5rem";
      style["margin"] = "0";
      if (hasChildren.value) {
        style["border-radius"] = "0.5rem";
        style["width"] = "calc(100% - 1em)";
        style["margin"] = "0 0.5em";
      } else {
        style["gap"] = "0";
      }
    } else {
      if (!hasChildren.value) style["background"] = "none";
      if (!isSelected.value) {
        style["align-items"] = "center";
        style["justify-content"] = "center";
      }

      style["border-radius"] =
        hasChildren.value || !isSelected.value ? "0.5rem" : "0";
      style["width"] = isSelected.value ? "100%" : "min-content";
    }

    if (isSelected.value && hasChildren.value) {
      style["background"] = "var(--third-color)";
    }

    return style;
  });
  const styleHeader = computed(() => {
    const style: StyleValue = {};

    if (isWide.value) {
      if (isSelected.value) {
        style["border-radius"] = "0";
      }
    } else {
      style["border-radius"] = "0";
      if (hasChildren.value && isSelected.value) {
        style["width"] = "100%";
      }
    }
    if (hasChildren.value) {
      style["--primary-color"] = "#1673e1";
    }

    return style;
  });
  const styleChildren = computed(() => {
    const style: StyleValue = {};

    if (isWide.value && !hasChildren.value) {
      style["background"] = "none";
    }

    if (!isSelected.value) {
      style["background"] = "none";
      style["padding"] = "0.8em";
      style["display"] = "none";
    }

    if (!hasChildren.value || !isSelected.value) {
      style["display"] = "none";
    }

    return style;
  });
</script>

<template>
  <div :class="['NavPage', 'transition']" :style="style">
    <NavigationLeftClickable
      class="NavPage-header"
      :style="styleHeader"
      :item="group1"
      :href="`/${group1?.key}`"
      :isSelectedDark="!hasChildren"
      :hasChildren="hasChildren"
      @click="() => group1?.click()"
      @click-open="() => group1?.clickExpand()"
    />

    <div class="NavPage-children" v-if="hasChildren" :style="styleChildren">
      <div
        class="NavPage-sectionParent"
        v-for="(group2, index) in group2s"
        :key="group2.key"
      >
        <NavViewGroup :group2="group2" />
        <div
          class="NavPage-sectionParent-line"
          v-if="index < group2s.length - 1"
        ></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .NavPage {
    --primary-color: #1673e1;
    --secondary-color: rgba(22, 112, 223, 0.2);
    --third-color: hsla(213, 82%, 48%, 0.1);

    display: flex;
    flex-direction: column;
    overflow: hidden;

    .NavPage-children {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
      margin: 0.4em;
      width: calc(100% - 0.8em);

      .NavPage-sectionParent {
        display: flex;
        flex-direction: column;
        align-items: center;

        .NavPage-sectionParent-line {
          width: calc(100% - 1.2rem);
          min-height: 1px;
          background: hsla(0, 0%, 0%, 0.7);
          opacity: 0.2;
          margin: 0.8rem 0;
        }
      }
    }
  }
</style>
