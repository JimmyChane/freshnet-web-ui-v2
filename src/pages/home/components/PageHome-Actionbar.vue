<script setup lang="ts">
  import { ref } from "vue";
  import Actionbar from "@/app/AppActionbar.vue";

  defineProps({
    isThin: { type: Boolean, default: false },
    isParentScrolledUp: { type: Boolean, default: false },
  });

  const companyTitle = ref("Freshnet Enterprise");
  const companyCategory = ref("Computer Store");
  const addressHref = ref(
    "https://www.google.com/maps/dir//No.+14,+Ground+Floor,+Freshnet+Enterprise,+Jalan+Melati+3%2F3,+Bandar+Melawati,+45000+Kuala+Selangor,+Selangor/@3.329664,101.256548,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x31ccf49e980c2d07:0xadf4850c7c433d0a!2m2!1d101.2565481!2d3.3296638",
  );
  const logo = ref(
    "https://res.cloudinary.com/freshnet/image/upload/resource/logo/svg/freshnet-enterprise-logo.svg",
  );
</script>

<template>
  <Actionbar
    class="HomeActionbar"
    :icon-theme="isParentScrolledUp ? 'white' : 'black'"
    :isParentScrolledUp="`${isParentScrolledUp}`"
    :isNavigationDrawer="`${true}`"
    :isWide="`${false}`"
  >
    <div class="HomeActionbar-body">
      <div class="HomeActionbar-title">
        <img
          class="HomeActionbar-logo"
          :style="{ 'grid-area': 'logo' }"
          :src="logo"
          :alt="`${companyTitle} Logo`"
        />

        <span class="HomeActionbar-name" :style="{ 'grid-area': 'name' }">{{
          companyTitle
        }}</span>
        <a
          class="HomeActionbar-classification"
          :style="{ 'grid-area': 'category' }"
          v-if="addressHref.length"
          :href="addressHref"
          target="_blank"
          >{{ companyCategory }}</a
        >
        <p
          class="HomeActionbar-classification"
          :style="{ 'grid-area': 'category' }"
          v-else
        >
          {{ companyCategory }}
        </p>
      </div>
    </div>
  </Actionbar>
</template>

<style lang="scss" scoped>
  .HomeActionbar {
    --primary-color: #1673e1;
    --height: max-content;

    width: 100%;
    position: sticky;
    top: 0;

    width: 100%;

    .HomeActionbar-body {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .HomeActionbar-title {
        min-width: max-content;
        padding: 0.5rem;

        --logo-size: 2rem;

        gap: 0 0.5rem;

        display: grid;
        grid-template-rows: fit-content fit-content;
        grid-template-columns: var(--logo-size) 1fr;
        grid-template-areas:
          "logo name"
          "logo category";

        .HomeActionbar-logo {
          width: var(--logo-size);
          height: var(--logo-size);
        }
        .HomeActionbar-name {
          font-weight: 600;
          line-height: 1em;
          align-self: flex-end;
        }
        .HomeActionbar-classification {
          font-size: 0.7em;
          color: inherit;
          text-decoration: inherit;
          align-self: flex-start;
        }
        a.HomeActionbar-classification {
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }
      .Home-actionbar-search {
        --background-color: hsla(0, 0%, 100%, 0.9);
        --border: 1px solid black;
      }

      .Home-actionbar-search-isThin {
        margin-left: 1rem;
      }
      .Home-actionbar-search-isWide {
        margin-left: -0.7rem;
      }
    }
  }

  .HomeActionbar[isWide="true"] {
    .Home-actionbar-search {
      max-width: 22rem;
    }
  }

  .HomeActionbar[isParentScrolledUp="true"] {
    background: transparent;
    border-bottom: transparent;
    color: white;
    .Home-actionbar-search {
      --border: 1px solid transparent;
    }
  }
  .HomeActionbar[isParentScrolledUp="false"] {
    background: white;
    border-bottom: 1px solid #0000001a;
    box-shadow: 0 0 1em #0000001a;
    color: black;
    .Home-actionbar-search {
      --border: 1px solid hsla(0, 0%, 0%, 0.2);
    }
  }

  .HomeActionbar[isNavigationDrawer="true"] {
    .HomeActionbar-title {
      grid-template-rows: fit-content fit-content;
      grid-template-columns: var(--logo-size) 1fr;
      grid-template-areas:
        "logo name"
        "logo category";
    }
  }
  .HomeActionbar[isNavigationDrawer="false"] {
    .HomeActionbar-title {
      grid-template-rows: fit-content fit-content;
      grid-template-columns: 1fr;
      grid-template-areas:
        "name"
        "category";
    }
  }
</style>
