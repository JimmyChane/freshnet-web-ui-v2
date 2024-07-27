<script setup lang="ts">
import { Service } from '@/data/Service';
import { format, formatDistanceToNow } from 'date-fns';
import { computed } from 'vue';

const props = withDefaults(defineProps<{ service?: Service; line?: number }>(), { line: 2 });

const timestamp = computed(() => props.service?.timestamp);
const timestampText = computed(() => {
  if (!timestamp.value) return '';

  const time = timestamp.value.time;

  const distance = formatDistanceToNow(time);
  const dateText = format(time, 'EEE, dd/LL/yyyy');
  const timeText = format(time, 'hh:mmaaa');

  if (props.line === 1) {
    return `${dateText} ${timeText} (${distance} ago)`;
  } else {
    return `${dateText}\n${distance} ago, ${timeText}`;
  }
});
</script>

<template>
  <p class="ItemService-timestamp">{{ timestampText }}</p>
</template>

<style lang="scss" scoped>
.ItemService-timestamp {
  max-width: max-content;
  flex-grow: 1;
  text-align: center;
  font-weight: 600;
  font-size: 0.7rem;
}
</style>
