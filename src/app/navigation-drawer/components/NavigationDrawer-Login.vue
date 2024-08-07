<script setup lang="ts">
import { useLoginStore } from '@/stores/login.store';
import { usePageStore } from '@/stores/page.store';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const emits = defineEmits<{ clickLogout: [void] }>();
withDefaults(defineProps<{ isWide?: boolean }>(), { isWide: true });

const pageStore = usePageStore();
const loginStore = useLoginStore();
const route = useRoute();
const router = useRouter();

const redirect = ref('');

const user = computed(() => loginStore.user);
const userName = computed(() => user.value.name);
const isLoginPage = computed(() => pageStore.currentPageKey === 'login');

watch(() => route, invalidateRedirection);

function invalidateRedirection() {
  if (!isLoginPage.value) {
    redirect.value = router.currentRoute.value.fullPath;
  }
}

onMounted(() => {
  invalidateRedirection();
  loginStore.refresh();
});
</script>

<template>
  <div class="LeftNavigationLogin" :isWide="`${isWide}`" v-if="!isLoginPage || user.isTypeNone()">
    <div class="LeftNavigationLogin-loggedIn" v-if="!user.isTypeNone()">
      <span class="LeftNavigationLogin-loggedIn-user">{{ userName }}</span>
      <div class="LeftNavigationLogin-loggedIn-body">
        <button class="LeftNavigationLogin-loggedIn-logout" @click="emits('clickLogout')">
          <span>Logout</span>
        </button>
      </div>
    </div>

    <div class="LeftNavigationLogin-loggedOut" v-if="!isLoginPage && user.isTypeNone()">
      <router-link
        class="LeftNavigationLogin-loggedOut-login transition"
        :to="{ path: '/login', query: { redirect } }"
      >
        <span>{{ isWide ? 'Staff Login' : 'Login' }}</span>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.LeftNavigationLogin {
  flex-grow: 0;
  position: sticky;
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-top: 1px solid hsla(0, 0%, 0%, 0.1);
  background: inherit;

  .LeftNavigationLogin-loggedIn {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    .LeftNavigationLogin-loggedIn-user {
      font-size: 0.8rem;
    }
    .LeftNavigationLogin-loggedIn-body {
      border-radius: 6px;
      background: white;
      display: flex;
      flex-direction: row;
      align-items: center;
      .LeftNavigationLogin-loggedIn-logout {
        width: 100%;
        flex-grow: 1;
        border-radius: 0.5em;
        border: none;
        cursor: pointer;
        padding: 0.4em;
        transition: 0.1s;
        color: white;

        --accent-color: #ca4242;

        background: hsla(0, 0%, 0%, 0.8);

        &:hover {
          background: var(--accent-color);
        }
      }
    }
  }
  .LeftNavigationLogin-loggedOut {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    .LeftNavigationLogin-loggedOut-login {
      width: 100%;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      padding: 0.5em;

      display: flex;
      text-decoration: none;
      align-items: center;
      justify-content: center;

      --primary-color: #2683d8;
      --primary-color: hsla(0, 0%, 0%, 0.8);

      background: none;
      border: 0.1em solid var(--primary-color);
      color: var(--primary-color);
      font-size: 0.8rem;

      &:hover,
      &:focus {
        background: var(--primary-color);
        color: white;
      }
    }
  }
}

.LeftNavigationLogin[isWide='true'] {
  padding: 0.5rem;
}
.LeftNavigationLogin[isWide='false'] {
  padding: 0.2rem;
  .LeftNavigationLogin-loggedIn {
    gap: 0;
    .LeftNavigationLogin-loggedIn-user {
      padding: 0.2rem;
      text-align: center;
    }
    .LeftNavigationLogin-loggedIn-body {
      .LeftNavigationLogin-loggedIn-logout {
        border-radius: 0.2rem;
      }
    }
  }
  .LeftNavigationLogin-loggedOut {
    .LeftNavigationLogin-loggedOut-login {
      border-radius: 0.2rem;
      border: none;
    }
  }
}
</style>
