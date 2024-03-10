<script setup lang="ts">
  import Input from "@/components/Input.vue";
  import { useLoginStore } from "@/stores/login.store";
  import { computed, onMounted, ref, watch } from "vue";

  const emits = defineEmits<{ inputName: [string] }>();
  withDefaults(defineProps<{ name?: string }>(), { name: "" });

  const nameOfUser = ref("");

  const user = computed(() => useLoginStore().user);
  const isUserDefault = computed(() => user.value.isDefault());
  const nameUserType = computed(() => {
    if (user.value.isTypeAdmin()) return "Admin";
    if (user.value.isTypeStaff()) return "Staff";
    return "unknown";
  });

  const value = ref("");
  watch(() => value.value, onInputName);

  watch(() => user.value, onUser);

  function onUser() {
    const xUser = user.value;
    if (!xUser.isTypeNone()) {
      nameOfUser.value = isUserDefault.value ? "" : xUser.name;
    }
  }
  function onInputName() {
    emits("inputName", value.value);
  }

  onMounted(() => onUser());
</script>

<template>
  <Input
    class="WindowServiceUpdate-input"
    v-if="isUserDefault"
    autocapitalize="words"
    :label="`${nameUserType}${name.trim() === '' ? ' (Your name here)' : ''}`"
    :isRequired="true"
    :bindValue="name"
    v-model="value"
  />
  <span class="WindowServiceUpdate-user-user" v-else>
    {{ `${nameUserType} : ${nameOfUser}` }}
  </span>
</template>

<style lang="scss" scoped>
  .WindowServiceUpdate-input {
    width: 12rem;
    padding: 0.6rem;
    background: hsla(0, 0%, 0%, 0.03);
    border-radius: 0.2rem;
  }
  .WindowServiceUpdate-user-user {
    width: max-content;
    padding: 0.4rem 1rem;
    background: hsla(0, 0%, 0%, 0.03);
    border: 1px solid hsla(0, 0%, 0%, 0.05);
    border-radius: 2rem;
    text-align: center;
  }
</style>
