<script setup lang="ts">
  import ButtonIcon from "@/components/button/ButtonIcon.vue";
  import IconClose from "@/assets/icon/close-000000.svg";
  import { computed, ref } from "vue";
  import { useSpecificationStore } from "@/data-stores/specification.store";
  import Specification from "@/data/specification/Specification";

  const emits = defineEmits<{
    inputContent: [string];
    changeContent: [string];
    clickRemove: [void];
  }>();
  const props = defineProps<{ item: Specification }>();

  const specifications = computed(() => {
    return [
      { key: "none", title: "None", icon: undefined },
      ...useSpecificationStore()
        .items.map((item) => item)
        .map((item) => {
          return {
            key: item.key,
            title: item.title,
            icon: item.icon?.toUrl() ?? "",
          };
        }),
    ];
  });
  const specType = computed(() => {
    return specifications.value.find((specType) => {
      return specType.key === props.item.typeKey;
    });
  });
  const icon = computed(() => specType.value?.icon ?? "");
  const title = computed(() => specType.value?.title ?? "");

  const refItemSpecInput = ref<HTMLTextAreaElement>();

  function onInputContent(e: Event) {
    const target = e?.target as HTMLTextAreaElement | undefined;
    if (target) emits("inputContent", target.value);
  }
  function onChangeContent(e: Event) {
    const target = e?.target as HTMLTextAreaElement | undefined;
    if (target) emits("changeContent", target.value);
  }
</script>

<template>
  <div class="ItemSpec" @focus="() => refItemSpecInput?.focus()">
    <textarea
      :class="['ItemSpec-input', 'transition']"
      :style="{ 'grid-area': 'input' }"
      ref="refItemSpecInput"
      type="text"
      v-model="item.content"
      autocapitalize="words"
      @input="onInputContent"
      @change="onChangeContent"
    />
    <img
      class="ItemSpec-icon"
      :style="{ 'grid-area': 'icon' }"
      v-if="icon"
      :src="icon"
    />
    <span
      class="ItemSpec-title"
      :style="{ 'grid-area': 'title' }"
      v-if="title"
      >{{ title }}</span
    >
    <ButtonIcon
      class="ItemSpec-remove"
      :style="{ 'grid-area': 'remove' }"
      :src="IconClose"
      @click="$emit('click-remove', item)"
    />
  </div>
</template>

<style lang="scss" scoped>
  .ItemSpec {
    min-height: 4rem;
    width: 100%;

    border-radius: 0.5rem;
    background: hsla(0, 0%, 0%, 0.04);
    border: 1px solid hsla(0, 0%, 0%, 0.08);

    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: stretch;
    overflow: hidden;
    padding: 0.5rem;

    display: grid;
    grid-template-areas:
      "icon title remove"
      "icon input remove";
    grid-template-columns: 2.8rem 1fr 2.8rem;
    grid-template-rows: 1rem 1fr;

    .ItemSpec-input {
      flex-grow: 1;

      min-height: 2rem;
      height: max-content;

      padding: 0.25rem 0;
      font-size: 1rem;
      border: none;
      border-bottom: 2px solid hsla(0, 0%, 0%, 0.1);
      background: none;
      flex-grow: 1;

      display: flex;
      flex-direction: row;
      resize: vertical;

      &:hover,
      &:focus {
        border-color: hsla(0, 0%, 0%, 0.3);
      }
    }
    .ItemSpec-icon {
      padding: 0.7rem;
      width: 2.8rem;
      height: 2.8rem;
    }
    .ItemSpec-title {
      font-size: 0.7rem;
      color: black;
      flex-grow: 1;
      line-height: 0.8rem;

      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
    }
    .ItemSpec-remove {
      padding: 0.7rem;
      width: 2.8rem;
      height: 2.8rem;
    }
  }
</style>
