<script setup lang="ts">
import { computed, ref } from 'vue';

const emits = defineEmits<{
  focus: [string | number];
  blur: [string | number];
  input: [string | number];
  change: [string | number];
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
    name: '',
    label: '',
    type: '',
    autocorrect: '',
    autocapitalize: '',

    isRequired: false,
    error: '',
  },
);
const model = defineModel<string | number>({ default: '' });

const isFocused = ref(false);

const isValueEmpty = computed(() => {
  if (props.type === 'number') {
    return false;
  }
  if (typeof model.value === 'string') {
    return model.value.trim() === '';
  }

  return false;
});

const refSelf = ref<HTMLDivElement>();
const input = ref<HTMLInputElement>();

function focus() {
  input.value?.focus();
}

function onInput() {
  emits('input', model.value ?? '');
}

defineExpose({ focus });
</script>

<template>
  <div
    :class="['Input', isFocused ? 'Input-isFocused' : 'Input-isBlurred', 'transition']"
    ref="refSelf"
  >
    <span
      :class="[
        'Input-sign',
        'Input-sign-required',
        `Input-sign-required-${isRequired && isValueEmpty ? 'isShown' : 'isHidden'}`,
      ]"
    >
      *Required
    </span>
    <span
      :class="[
        'Input-sign',
        'Input-sign-error',
        `Input-sign-error-${error ? 'isShown' : 'isHidden'}`,
        'transition',
      ]"
    >
      {{ error }}
    </span>

    <label
      :class="['Input-label', `Input-label-${isValueEmpty ? 'isHidden' : 'isShown'}`, 'transition']"
      ref="label"
      v-if="label"
      :for="name"
    >
      {{ label }}
    </label>
    <input
      class="Input-input transition"
      ref="input"
      :name="name"
      :type="type"
      :autocorrect="autocorrect"
      :autocapitalize="autocapitalize"
      @focus="
        (event) => {
          isFocused = true;
          emits('focus', model ?? '');
        }
      "
      @blur="
        (event) => {
          isFocused = false;
          emits('blur', model ?? '');
        }
      "
      @input="onInput"
      @change="
        (event) => {
          emits('change', model ?? '');
        }
      "
      v-bind:value="model"
    />

    <div class="Input-dummy"></div>
  </div>
</template>

<style lang="scss" scoped>
.Input {
  width: 100%;
  margin-top: 0.8rem;
  position: relative;
  padding: 0.6em;
  background: hsla(0, 0%, 0%, 0.03);
  border-radius: 0.2em;
  --transition-timing: cubic-bezier(1, 0, 0, 1);

  .Input-sign {
    font-size: 0.7em;
    font-weight: 600;
    --transition-timing: cubic-bezier(1, 0, 0, 1);
  }

  .Input-sign-required {
    position: absolute;
    left: 0;
    top: -1.3em;

    color: rgb(235, 113, 68);
    padding-right: inherit;
  }
  .Input-sign-required-isHidden {
    opacity: 0;
    pointer-events: none;
  }
  .Input-sign-required-isShown {
    opacity: 1;
  }
  .Input-sign-error {
    position: absolute;
    top: -1.3em;
    right: 0;
    color: red;
  }
  .Input-sign-error-isHidden {
    opacity: 0;
    pointer-events: none;
  }
  .Input-sign-error-isShown {
    opacity: 1;
  }

  label {
    z-index: 1;
    width: fit-content;
    position: absolute;
    left: 0;
    font-size: 1em;
    --transition-timing: cubic-bezier(1, 0, 0, 1);
  }
  .Input-label-isHidden {
    top: calc(50% - 0.5em);
    padding-left: inherit;

    color: hsla(0, 0%, 20%, 0.5);
    font-weight: 400;
    pointer-events: none;
  }
  .Input-label-isShown {
    top: -1.2em;
    padding-left: 0;

    color: hsl(0, 0%, 20%);
    font-weight: 600;
  }

  .Input-input {
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
    --transition-timing: cubic-bezier(1, 0, 0, 1);
  }

  .Input-dummy {
    height: 1.1em;
  }
}

.Input-isFocused {
  border-bottom: 0.1em solid hsl(0, 0%, 30%);
  border-bottom: 0.1em solid var(--primary-color);
}
.Input-isBlurred {
  border-bottom: 0.1em solid hsl(0, 0%, 70%);
}
</style>
