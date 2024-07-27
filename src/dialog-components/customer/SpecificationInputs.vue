<script setup lang="ts">
import ItemSpec from '@/page-components/customer/ItemSpecificationInput.vue';
import Selector4 from '@/components/selector/Selector4.vue';
import { useSpecificationStore } from '@/data-stores/specification.store';
import { Specification, TypeKey } from '@/data/Specification';
import { computed, onMounted, ref, watch } from 'vue';

const props = withDefaults(defineProps<{ items: Specification[] }>(), { items: () => [] });

const specificationStore = useSpecificationStore();

const list = ref<Specification[]>([]);

const KeyNone = computed(() => 'none');

const SpecKeys = computed(() => [
  KeyNone.value,
  ...Object.keys(TypeKey).map((key) => TypeKey[key]),
]);
const SpecificationMenus = computed(() => {
  return [{ key: KeyNone.value, title: 'None' }, ...specificationStore.items.map((item) => item)]
    .map((item) => ({
      key: item.key,
      title: item.title,
      icon: item.icon?.toUrl() ?? '',
    }))
    .filter((menu) => {
      if (menu.key === 'none') return true;

      const dataSpecification = list.value.find((dataSpec) => {
        return dataSpec.typeKey === menu.key;
      });
      return !dataSpecification;
    })
    .sort((menu1, menu2) => {
      return SpecKeys.value.indexOf(menu1.key) - SpecKeys.value.indexOf(menu2.key);
    });
});

watch(
  () => props.items,
  () => (list.value = props.items),
);

function addItem(item: Specification) {
  list.value.push(item);
}
function removeItem(item: Specification) {
  list.value.splice(list.value.indexOf(item), 1);
}

onMounted(() => {
  specificationStore.refresh();
});
</script>

<template>
  <div class="SpecificationInputs">
    <div class="SpecificationInputs-contents">
      <ItemSpec
        v-for="item in list"
        :key="item.typeKey"
        :item="item"
        @input-content="(value) => (item.content = value)"
        @click-remove="(item) => removeItem(item)"
      />
    </div>
    <Selector4
      :menus="SpecificationMenus"
      @click-menu="(menu) => addItem({ content: '', typeKey: menu.key })"
    />
  </div>
</template>

<style lang="scss" scoped>
.SpecificationInputs {
  display: flex;
  flex-direction: column;
  gap: 1em;
  --primary-color: hsl(0, 0%, 30%);
  .SpecificationInputs-contents {
    display: flex;
    flex-direction: column;
    gap: 0.3em;
  }
}
</style>
