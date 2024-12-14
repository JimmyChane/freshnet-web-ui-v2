<script setup lang="ts">
import ItemOrderAction from './ItemOrder-Action.vue';
import { Order, OrderStatus } from '@/data/Order';
import { format } from 'date-fns';
import IconSuccessGreen from '@/assets/icon/success-green.svg';
import IconSuccessWhite from '@/assets/icon/success-white.svg';
import IconTrashRed from '@/assets/icon/trash-red.svg';
import IconTrashWhite from '@/assets/icon/trash-white.svg';
import { computed } from 'vue';

const emits = defineEmits<{
  onPending: [void];
  onComplete: [void];
  onRemove: [void];
  onExpand: [void];
  onCollapse: [void];
}>();
const props = withDefaults(defineProps<{ order: Order; isExpand?: boolean }>(), {
  isExpand: false,
});

const isStatusPending = computed(() => props.order.status === OrderStatus.Pending);
const isStatusCompleted = computed(() => props.order.status === OrderStatus.Completed);

const dateCreated = computed(() => {
  const date = props.order.createdAt === undefined ? new Date() : new Date(props.order.createdAt);
  return format(date, 'hh:mmaaa dd/LL/yyyy');
});
const customer = computed(() => props.order.customer);

const name = computed(() => customer.value?.name ?? '');
const phoneNumber = computed(() => customer.value?.phoneNumber);
const phoneNumberValue = computed(() => phoneNumber.value?.value ?? '');
const content = computed(() => props.order.content);
</script>

<template>
  <div
    :class="['ItemOrder', 'transition']"
    :isExpand="`${isExpand}`"
    @click="() => (isExpand ? emits('onCollapse') : emits('onExpand'))"
  >
    <div class="ItemOrder-main">
      <div class="ItemOrder-main-left">
        <span class="ItemOrder-date" v-if="dateCreated">{{ dateCreated }}</span>

        <router-link
          class="ItemOrder-customer"
          v-if="name"
          :to="{
            path: '/manage/customer',
            query: { name: name, phoneNumber: phoneNumberValue },
          }"
        >
          <span class="ItemOrder-name" v-if="name">{{ name }}</span>
          <span class="ItemOrder-phoneNumber" v-if="phoneNumberValue">{{ phoneNumberValue }}</span>
        </router-link>

        <span class="ItemOrder-content" v-if="content">{{ content }}</span>
      </div>

      <div class="ItemOrder-main-right">
        <img
          class="ItemOrder-button transition"
          :isExpand="`${isExpand}`"
          :alt="isExpand ? 'Expand' : 'Collapse'"
          src="@/assets/icon/down-arrow-grey.svg"
        />
      </div>
    </div>

    <div class="ItemOrder-option transition" :isExpand="`${isExpand}`">
      <ItemOrderAction
        v-if="isStatusCompleted"
        color="#f4a60d"
        text="Move to Pending"
        @button-click="emits('onPending')"
      />
      <ItemOrderAction
        v-if="isStatusPending"
        :icon="IconSuccessGreen"
        :iconActive="IconSuccessWhite"
        color="#25ad86"
        text="Move to Completed"
        @button-click="emits('onComplete')"
      />
      <ItemOrderAction
        :icon="IconTrashRed"
        :iconActive="IconTrashWhite"
        color="#DB4A2A"
        text=""
        @button-click="emits('onRemove')"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ItemOrder {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  background: none;
  text-align: start;
  cursor: pointer;
  border: 1px solid;
  border-radius: 1rem;
  transition-timing-function: cubic-bezier(1, 0, 0, 1);

  &:hover,
  &:focus {
    background: hsla(0, 0%, 0%, 0.05);
  }

  .ItemOrder-main {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: stretch;
    gap: 0.2rem;

    .ItemOrder-main-left {
      width: 100%;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 0.5rem;

      .ItemOrder-date {
        flex-grow: 1;
        color: #6f6f6f;
        font-size: 0.8rem;
      }

      .ItemOrder-customer {
        width: max-content;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 0.2rem 0.3rem;
        gap: 1rem;

        border: 1px solid #dddddd;
        border-radius: 1rem;
        background: #f4f4f4;
        text-decoration: none;
        text-align: start;
        color: inherit;

        .ItemOrder-name {
          font-size: 1rem;
          color: black;
        }
        .ItemOrder-phoneNumber {
          font-size: 0.8rem;
          color: #434343;
        }
      }

      .ItemOrder-content {
        width: 60%;
      }
    }
    .ItemOrder-main-right {
      .ItemOrder-button {
        --size: 2.1875rem;
        width: var(--size);
        height: var(--size);
        background: transparent;
        border: none;
        margin: 0 0.375rem;
        outline: none;
        border-radius: 50%;
        padding: 0.625rem;

        padding: 0;
        --size: 1rem;
        transition-timing-function: inherit;
      }
      .ItemOrder-button[isExpand='false'] {
        transform: rotate(0deg);
      }
      .ItemOrder-button[isExpand='true'] {
        transform: rotate(180deg);
      }
    }
  }
  .ItemOrder-option {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    padding: 0;
    margin-top: 0;
    transition-timing-function: inherit;

    & > * {
      min-height: 100%;
      height: unset;
      max-height: unset;
      padding: 0.625rem;
      flex-grow: 1;
      transition-timing-function: inherit;
    }
  }
  .ItemOrder-option[isExpand='false'] {
    height: 0;
    pointer-events: none;
    opacity: 0;
  }
  .ItemOrder-option[isExpand='true'] {
    height: unset;
    margin-top: 1.25rem;
    pointer-events: initial;
    opacity: 1;
  }
}
.ItemOrder[isExpand='false'] {
  box-shadow: none;
  padding: 0.625rem;
  border-color: transparent;
}
.ItemOrder[isExpand='true'] {
  padding: 1.2rem;
  font-size: 1.2rem;
  border-color: hsla(0, 0%, 0%, 0.1);
}
</style>
