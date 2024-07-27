<script setup lang="ts">
import { useSpecificationStore } from '@/data-stores/specification.store';
import type { CustomerDeviceSpecification } from '@/data/CustomerDeviceSpecification';
import { onMounted, ref, watch } from 'vue';

const emits = defineEmits<{ click: [void]; clickRemove: [void] }>();
const props = defineProps<{ item?: CustomerDeviceSpecification }>();

const specificationType = ref();

watch(() => props.item, invalidate);

function invalidate() {
  useSpecificationStore()
    .getItemOfKey(props.item?.typeKey ?? '')
    .then((xSpecificationType) => {
      specificationType.value = xSpecificationType;
    });
}

onMounted(() => invalidate());
</script>

<template>
  <div class="ItemSpecification">
    <img
      class="ItemSpecification-icon"
      v-if="specificationType"
      :src="specificationType.icon.toUrl()"
    />

    <span class="ItemSpecification-content">{{ item?.content ?? '' }}</span>
  </div>
</template>

<style lang="scss" scoped>
.ItemSpecification {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-items: flex-start;
  gap: 0.5rem;
  --min-height: 0.9rem;
  .ItemSpecification-icon {
    --size: var(--min-height);
    width: var(--size);
    height: var(--size);
  }
  .ItemSpecification-content {
    min-height: var(--min-height);
    line-height: 1;
  }
}
</style>
