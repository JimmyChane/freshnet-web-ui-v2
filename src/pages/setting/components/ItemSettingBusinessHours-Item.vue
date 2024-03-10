<script setup lang="ts">
  import { WorkingDay } from "@/data/working-day/WorkingDay";

  defineProps<{ value: WorkingDay }>();
</script>

<template>
  <div class="ItemSettingBusinessHours-Item">
    <span>{{ value.title }}</span>
    <span>{{ value.hours.toString() }}</span>
  </div>
</template>

<style lang="scss" scoped>
  .ItemSettingBusinessHours-Item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    :nth-child(1) {
      text-align: start;
    }
    :nth-child(2) {
      text-align: end;
    }
  }
</style>
