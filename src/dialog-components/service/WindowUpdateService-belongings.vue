<script setup lang="ts">
import BelongingListEditVue from './BelongingListEdit.vue';
import type { ServiceBelongingData } from '@/data/ServiceBelonging';

withDefaults(defineProps<{ belongings?: ServiceBelongingData[] }>(), {
  belongings: () => [],
});
</script>

<template>
  <div class="WindowServiceUpdate-belonging">
    <span class="WindowServiceUpdate-title">Belonging</span>
    <BelongingListEditVue
      class="WindowServiceUpdate-belonging-list"
      ref="BelongingListEditVue"
      :values="belongings"
    />
  </div>
</template>

<style lang="scss" scoped>
.WindowServiceUpdate-belonging {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  .WindowServiceUpdate-title {
    font-size: 1.1rem;
    font-weight: 600;
  }
  .WindowServiceUpdate-belonging-list {
    width: 100%;
  }
}
</style>
