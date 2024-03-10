<script setup lang="ts">
  import Loading from "@/components/loading/Loading.vue";
  import Input from "@/components/input/Input.vue";
  import Actionbar from "@/components/actionbar/Actionbar.vue";
  import Footer from "@/app/footer/AppFooter.vue";

  import ButtonLogin from "./ButtonLogin.vue";
  import Logo from "@/assets/logo/freshnet-enterprise-logo.svg";
  import IconHamburgerMenu from "@/assets/icon/hamburgerMenu-000000.svg";
  import { computed, onMounted, ref } from "vue";
  import { useLoginStore } from "@/stores/login.store";
  import { useRoute, useRouter } from "vue-router";
  import { useNavigationStore } from "@/stores/navigation/navigation.store";
  import { useSnackbarStore } from "@/stores/snackbar/snackbar.store";

  const route = useRoute();
  const router = useRouter();

  const navigationStore = useNavigationStore();

  const top = ref({ shadow: false });
  const usernameErrorText = ref("");
  const passwordErrorText = ref("");

  const isLoading = computed(() => useLoginStore().isLoading);

  const username = ref();
  const password = ref();

  function clickLogin() {
    const redirect = route.query.redirect?.toString() ?? "/home";

    const xUsername = username.value.value;
    const xPassword = password.value.value;
    usernameErrorText.value = "";
    passwordErrorText.value = "";

    if (xUsername === "") usernameErrorText.value = "Missing Field";
    if (xPassword === "") passwordErrorText.value = "Missing Field";
    if (xUsername === "" || xPassword == "") return;

    useLoginStore()
      .login({ username: xUsername, password: xPassword })
      .then((user) => setTimeout(() => router.push({ path: redirect }), 200))
      .catch(() => {
        useSnackbarStore().show("Login failed");
        usernameErrorText.value = "Check your username";
        passwordErrorText.value = "Check your password";
      });
  }

  onMounted(async () => {
    let user = await useLoginStore().getUser();
    if (user.isTypeNone()) return;
    if (typeof route.query.redirect !== "string") return;
    router.replace({ path: route.query.redirect });
  });
</script>

<template>
  <div
    class="PageLogin"
    @scroll="
      (event) => (top.shadow = (event.target as HTMLDivElement).scrollTop > 0)
    "
  >
    <Loading class="PageLogin-Loading" :isShowing="isLoading" />

    <Actionbar
      class="PageLogin-top transition"
      v-if="navigationStore.navigation.isDrawer()"
      :leftMenus="[
        {
          title: 'Hamburger Menu',
          icon: IconHamburgerMenu,
          click: () => navigationStore.navigation.openNavigationDrawer(),
        },
        {
          key: 'home',
          title: 'Home',
          icon: Logo,
          click: () => router.push('/home'),
        },
      ]"
    />

    <div class="PageLogin-main">
      <span class="PageLogin-title">Staff Login</span>

      <form class="PageLogin-content" @submit.prevent="clickLogin()">
        <Input
          class="PageLogin-input"
          ref="username"
          label="Username"
          type="text"
          :autocorrect="'off'"
          :autocapitalize="'none'"
          @input="
            (comp) => {
              let value = comp.value;
              if (value.includes(''))
                comp.value = value.trim().replace(' ', '');
            }
          "
          :isRequired="true"
          :error="usernameErrorText"
        />
        <Input
          class="PageLogin-input"
          ref="password"
          label="Password"
          type="password"
          :isRequired="true"
          :error="passwordErrorText"
        />

        <ButtonLogin />
      </form>
    </div>

    <Footer />
  </div>
</template>

<style lang="scss" scoped>
  .PageLogin {
    width: 100%;
    height: 100%;
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    color: black;
    overflow-y: auto;
    z-index: 1;

    --max-width: 28em;

    .PageLogin-Loading {
      z-index: 3;
      position: fixed;
      top: 0;
      width: 100%;
    }

    .PageLogin-top {
      top: 0;
      right: 0;
      left: 0;
      z-index: 2;
      width: 100%;
      position: sticky;
    }

    .PageLogin-main {
      z-index: 1;
      width: 100%;
      min-height: max-content;
      height: 100dvh;
      max-height: 100%;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      gap: 1em;
      padding: 2em;

      .PageLogin-title {
        width: 100%;
        max-width: var(--max-width);

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        color: rgba(0, 0, 0, 0.8);

        font-size: 4rem;
        line-height: 1.4;
      }

      .PageLogin-content {
        width: 100%;
        max-width: var(--max-width);
        padding: 20px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 14px;

        & > * {
          width: 100%;
        }

        .PageLogin-input {
          padding: 0.8rem 1rem;
        }
      }
    }
  }
</style>
