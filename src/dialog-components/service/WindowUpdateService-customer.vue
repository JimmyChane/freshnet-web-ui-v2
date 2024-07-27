<script setup lang="ts">
import Input from '@/components/input/Input.vue';
import { ref, watch } from 'vue';

const emits = defineEmits<{
  inputName: [string];
  inputPhoneNumber: [string];
}>();

const nameModel = defineModel<string>('name', { default: '' });
const phoneNumberModel = defineModel<string>('phoneNumber', { default: '' });

const Name = ref<typeof Input>();

watch(() => nameModel.value, onInputName);
watch(() => phoneNumberModel.value, onInputPhoneNumber);

function onInputName() {
  emits('inputName', nameModel.value);
}
function onInputPhoneNumber() {
  emits('inputPhoneNumber', phoneNumberModel.value);
}
</script>

<template>
  <div class="WindowUpdateService-customer">
    <span class="WindowUpdateService-title">Customer</span>
    <Input
      class="WindowUpdateService-input"
      label="Name"
      ref="Name"
      autocapitalize="words"
      :isRequired="true"
      v-model="nameModel"
    />
    <Input
      class="WindowUpdateService-input"
      label="Phone Number"
      type="tel"
      v-model="phoneNumberModel"
    />
  </div>
</template>

<style lang="scss" scoped>
.WindowUpdateService-customer {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;

  .WindowUpdateService-title {
    font-size: 1.1rem;
    font-weight: 600;
  }
  .WindowUpdateService-input {
    font-size: 1rem;
    background: hsla(0, 0%, 0%, 0.03);
    border-radius: 0.2rem;
    padding: 0.6rem;
  }
}
</style>
