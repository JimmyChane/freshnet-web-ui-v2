<script setup lang="ts">
  import Input from "@/components/input/Input.vue";
  import { useOrderStore } from "@/data-stores/order.store";
  import type { PopupWindow } from "@/stores/popup-window/PopupWindow";
  import { useSnackbarStore } from "@/stores/snackbar/snackbar.store";
  import { ref } from "vue";

  const props = defineProps<{ popupWindow: PopupWindow }>();

  const contentError = ref("");

  const customer_name = ref("");
  const phone_number = ref("");
  const content = ref("");

  function createOrder() {
    if (content.value.trim() === "") {
      contentError.value = "Missing Content";
      return;
    }

    const order: Record<string, string> = { content: content.value.trim() };
    if (customer_name.value.trim())
      order.customer_name = customer_name.value.trim();
    if (phone_number.value.trim())
      order.phone_number = phone_number.value.trim();

    useOrderStore()
      .addItem({ data: order })
      .then((order) => props.popupWindow.close())
      .catch((error) => {
        useSnackbarStore().show("Error While Creating Order");
      });
  }
</script>

<template>
  <div class="pageOrder-dialog-newOrder-body">
    <h1 class="pageOrder-dialog-newOrder-title">New Order</h1>

    <Input
      class="PageOrder-input"
      label="Customer Name"
      autocapitalize="words"
      v-model="customer_name"
    />
    <Input
      class="PageOrder-input"
      label="Customer Phone Number"
      v-model="phone_number"
    />

    <Input
      class="PageOrder-input"
      label="Content"
      :isRequired="true"
      :error="contentError"
      v-model="content"
    />

    <div class="buttons">
      <div class="body">
        <button class="button-focus-none" @click="() => popupWindow.close()">
          Cancel
        </button>
      </div>

      <div class="body">
        <button class="button-focus transition" @click="() => createOrder()">
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .pageOrder-dialog-newOrder-body {
    width: 500px;
    max-width: 100%;
    height: 100%;
    border-radius: 10px;
    padding: 2rem;

    display: flex;
    flex-direction: column;
    align-items: center;

    background: white;

    overflow-x: hidden;
    overflow-y: auto;
    cursor: initial;
    pointer-events: unset;

    .PageOrder-input {
      width: 100%;
      margin-top: 2rem;
    }

    .pageOrder-dialog-newOrder-title {
      width: 100%;
      margin-bottom: 10px;
    }

    .buttons {
      width: 100%;
      display: flex;
      flex-direction: row;
      column-gap: 30px;
      margin-top: 40px;

      .body {
        width: calc(100% - 20px);
        max-width: calc(var(--width-max) - 20px);

        display: flex;
        flex-direction: row;
        flex-basis: auto;

        flex-grow: 1;

        button {
          flex-grow: 1;

          border: none;
          border-radius: 10px;

          padding: 10px 20px;
          color: white;
          font-weight: 600;
          background: var(--accent-color);

          cursor: pointer;

          outline: none;

          &:hover,
          &:focus {
            box-shadow: 0 0 8px #828282;
          }
        }

        .button-focus-none {
          border: 2px solid var(--accent-color);
          background: white;
          color: var(--accent-color);

          &:hover,
          &:focus {
            background: var(--accent-color);
            color: white;
          }
        }

        .button-focus {
          border: 2px solid var(--accent-color);
          background: var(--accent-color);
          color: white;

          &:hover,
          &:focus {
            border: 2px solid var(--accent-color);
            background: var(--accent-color);
          }
        }
      }
    }
  }
</style>
