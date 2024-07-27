<script setup lang="ts">
import { useLoginStore } from '@/stores/login.store';
import { computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const user = computed(() => useLoginStore().user);

watch(
  () => user.value,
  (userNow, userWas) => {
    if (!userWas.isTypeNone() && userNow.isTypeNone()) {
      redirectToLogin();
    }
  },
);

function redirectToLogin() {
  router.replace({
    path: '/login',
    query: { redirect: router.currentRoute.value.fullPath },
  });
}

onMounted(async () => {
  try {
    const user = await useLoginStore().getUser();
    if (user.isTypeNone()) redirectToLogin();
  } catch (error) {
    redirectToLogin();
  }
});
</script>

<template>
  <div class="PageManage">
    <router-view v-if="!user.isTypeNone()" />
  </div>
</template>

<style lang="scss" scoped>
.PageManage {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: stretch;
  overflow: hidden;
}
</style>
