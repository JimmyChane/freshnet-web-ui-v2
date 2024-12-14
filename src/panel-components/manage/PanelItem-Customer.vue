<script setup lang="ts">
import ButtonIcon from '@/components/button/ButtonIcon.vue';
import IconHamburgerMenu from '@/assets/icon/hamburgerMenu-000000.svg';
import { computed } from 'vue';
import { ServiceCustomer } from '@/data/ServiceCustomer';
import type { Customer } from '@/data/Customer';

const emits = defineEmits<{ clickEdit: [ServiceCustomer] }>();
const props = withDefaults(defineProps<{ customer: ServiceCustomer; isEditable?: boolean }>(), {
  isEditable: true,
});

const name = computed(() => props.customer.name);
const phoneNumber = computed(() => props.customer.phoneNumber);
const phoneNumberStr = computed(() => phoneNumber.value?.toString() ?? '');
</script>

<template>
  <div class="PanelItem-Customer">
    <div class="PanelItem-Customer-data">
      <span class="PanelItem-Customer-name" v-if="name.length">{{ name }}</span>
      <span class="PanelItem-Customer-phoneNumber" v-if="phoneNumberStr.length">
        {{ phoneNumberStr }}
      </span>
    </div>

    <ButtonIcon
      :isEditable="`${isEditable}`"
      class="PanelItem-Customer-edit transition"
      :src="IconHamburgerMenu"
      @click="() => emits('clickEdit', customer)"
    />
  </div>
</template>

<style lang="scss" scoped>
.PanelItem-Customer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 0.5rem;
  text-align: start;

  .PanelItem-Customer-data {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    line-height: 1rem;

    .PanelItem-Customer-name {
      font-weight: 500;
    }
    .PanelItem-Customer-phoneNumber {
      font-size: 0.8em;
    }
  }
  .PanelItem-Customer-edit {
    font-size: 0.8rem;
  }
  .PanelItem-Customer-edit[isEditable='false'] {
    opacity: 0;
    pointer-events: none;
  }
}
</style>
