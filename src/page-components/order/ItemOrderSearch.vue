<script setup lang="ts">
import { Order } from '@/data/Order';
import { computed } from 'vue';

const props = defineProps<{ item: Order }>();

const content = computed(() => props.item.content);
const name = computed(() => props.item.customer?.name);
const phoneNumber = computed(() => props.item.customer?.phoneNumber);
const status = computed(() => props.item.status);
</script>

<template>
  <div class="ItemOrderSearch">
    <span>{{ content }}</span>
    <span>{{ name }}</span>
    <span>{{ phoneNumber }}</span>
    <span>{{ status }}</span>
  </div>
</template>

<style lang="scss" scoped>
.ItemOrderSearch {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 1rem;
}
</style>
