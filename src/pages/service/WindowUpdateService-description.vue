<script setup lang="ts">
  import TextArea from "@/components/input/InputTextArea.vue";
  import { ref, watch } from "vue";

  const emits = defineEmits<{ inputDescription: [string] }>();
  const props = withDefaults(defineProps<{ description?: string }>(), {
    description: "",
  });

  const input = ref<typeof TextArea>();
  const model = ref(props.description);

  watch(() => model.value, onInputDescription);

  function onInputDescription() {
    emits("inputDescription", model.value);
  }
  function focus() {
    input.value?.focus();
  }
</script>

<template>
  <div class="WindowUpdateService-description">
    <span class="WindowUpdateService-title">Description</span>
    <TextArea
      class="WindowUpdateService-input"
      ref="input"
      :isRequired="true"
      v-model="model"
    />
  </div>
</template>

<style lang="scss" scoped>
  .WindowUpdateService-description {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .WindowUpdateService-title {
      font-size: 1.1rem;
      font-weight: 600;
    }
    .WindowUpdateService-input {
      height: 8rem;
      font-size: 1rem;
      background: hsla(0, 0%, 0%, 0.03);
      border-radius: 0.2rem;
      padding: 0.6rem;
    }
  }
</style>
