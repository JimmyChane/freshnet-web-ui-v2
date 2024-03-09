<script setup lang="ts">
  import { computed, ref, watch } from "vue";

  const emits = defineEmits<{
    focus: [string];
    blur: [string];
    input: [string];
    change: [string];
  }>();
  const props = withDefaults(
    defineProps<{
      name?: string;
      label?: string;
      type?: string;
      autocorrect?: string;
      autocapitalize?: string;

      isRequired?: boolean;
      error?: string;
    }>(),
    {
      name: "",
      label: "",
      type: "",
      autocorrect: "",
      autocapitalize: "",

      isRequired: false,
      error: "",
    },
  );
  const model = defineModel<string>();

  const input_value = ref("");
  const isFocused = ref(false);

  const isValueEmpty = computed(() => {
    if (props.type === "number") {
      return false;
    }
    return (
      typeof input_value.value !== "string" || input_value.value.trim() === ""
    );
  });

  const refSelf = ref<HTMLDivElement>();
  const input = ref<HTMLInputElement>();

  watch(
    () => model.value,
    () => (input_value.value = model.value ?? ""),
  );

  function focus() {
    input.value?.focus();
  }

  function onInput(e: Event) {
    const target = e.target as HTMLInputElement | undefined;
    input_value.value = target?.value ?? "";
    emits("input", input_value.value);
  }

  defineExpose({ focus });
</script>

<template>
  <div
    :class="[
      'InputTextArea',
      isFocused ? 'InputTextArea-isFocused' : 'InputTextArea-isBlurred',
      'transition',
    ]"
  >
    <span
      :class="[
        'InputTextArea-sign',
        'InputTextArea-sign-required',
        `InputTextArea-sign-required-${
          isRequired && isValueEmpty ? 'isShown' : 'isHidden'
        }`,
        'transition',
      ]"
      >*Required</span
    >
    <span
      :class="[
        'InputTextArea-sign',
        'InputTextArea-sign-error',
        `InputTextArea-sign-error-${error ? 'isShown' : 'isHidden'}`,
        'transition',
      ]"
      >{{ error }}</span
    >

    <label
      :class="[
        'InputTextArea-label',
        `InputTextArea-label-${isValueEmpty ? 'isHidden' : 'isShown'}`,
        'transition',
      ]"
      ref="label"
      v-if="label"
      :for="name"
      >{{ label }}</label
    >
    <textarea
      class="InputTextArea-input transition"
      ref="input"
      :name="name"
      :type="type"
      @focus="
        (event) => {
          isFocused = true;
          $emit('focus', input_value);
        }
      "
      @blur="
        (event) => {
          isFocused = false;
          $emit('blur', input_value);
        }
      "
      @input="onInput"
      @change="
        (event) => {
          $emit('change', input_value);
        }
      "
      v-bind:value="input_value"
    />

    <div class="InputTextArea-dummy"></div>
  </div>
</template>

<style lang="scss" scoped>
  .InputTextArea {
    width: 100%;
    margin-top: 0.8rem;
    position: relative;
    padding: 0.6em;
    background: hsla(0, 0%, 0%, 0.03);
    border-radius: 0.2em;
    resize: none;

    .InputTextArea-sign {
      font-size: 0.7em;
      font-weight: 600;
    }

    .InputTextArea-sign-required {
      position: absolute;
      left: 0;
      top: -1.3em;

      color: rgb(235, 113, 68);
      padding-right: inherit;
    }
    .InputTextArea-sign-required-isHidden {
      opacity: 0;
      pointer-events: none;
    }
    .InputTextArea-sign-required-isShown {
      opacity: 1;
    }
    .InputTextArea-sign-error {
      position: absolute;
      top: -1.3em;
      right: 0;
      color: red;
    }
    .InputTextArea-sign-error-isHidden {
      opacity: 0;
      pointer-events: none;
    }
    .InputTextArea-sign-error-isShown {
      opacity: 1;
    }

    label {
      z-index: 1;
      width: fit-content;
      position: absolute;
      left: 0;
      font-size: 1em;
    }
    .InputTextArea-label-isHidden {
      top: 0.6em;
      padding-left: inherit;

      color: hsla(0, 0%, 20%, 0.5);
      font-weight: 400;
      pointer-events: none;
    }
    .InputTextArea-label-isShown {
      top: -1.2em;
      padding-left: 0;

      color: hsl(0, 0%, 20%);
      font-weight: 600;
    }

    .InputTextArea-input {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      padding: inherit;

      z-index: 2;
      width: 100%;
      border: none;
      background: none;

      font-weight: 400;
      font-size: 1em;
      color: black;
      resize: inherit;
    }

    .InputTextArea-dummy {
      height: 1.1em;
    }
  }

  .InputTextArea-isFocused {
    border-bottom: 0.1em solid hsl(0, 0%, 30%);
    border-bottom: 0.1em solid var(--primary-color);
  }
  .InputTextArea-isBlurred {
    border-bottom: 0.1em solid hsl(0, 0%, 70%);
  }
</style>
