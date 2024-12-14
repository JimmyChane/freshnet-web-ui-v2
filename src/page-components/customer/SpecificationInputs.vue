<script setup lang="ts">
import ItemSpec from './ItemSpecificationInput.vue';
import Selector4, { type Menu as Selector4Menu } from '@/components/selector/Selector4.vue';
import { Specification, Type, TypeKey } from '@/data/Specification';
import { useSpecificationStore } from '@/data-stores/specification.store';
import { computed, onMounted, ref, watch } from 'vue';

const props = withDefaults(defineProps<{ items?: any[] }>(), {
  items: () => [],
});

const list = ref<Specification[]>([]);

const typeNone = computed<Type>(() => new Type({ key: 'none', title: 'None' }));

const specKeys = computed(() => [typeNone.value.key, ...Object.values(TypeKey)]);
const specificationMenus = computed<Selector4Menu[]>(() => {
  const specificationStore = useSpecificationStore();
  const specifications = specificationStore.items;

  return [typeNone.value, ...specifications.map((item) => item)]
    .map((item) => {
      return {
        key: item.key,
        title: item.title,
        icon: item.icon?.toUrl() ?? '',
      };
    })
    .filter((menu) => {
      if (menu.key === typeNone.value.key) return true;

      const dataSpecification = list.value.find((dataSpec) => {
        return dataSpec.typeKey === menu.key;
      });
      return !dataSpecification;
    })
    .sort((menu1, menu2) => {
      return specKeys.value.indexOf(menu1.key) - specKeys.value.indexOf(menu2.key);
    })
    .map((item) => {
      return {
        key: item.key ?? '',
        icon: item.icon,
        title: item.title,
      };
    });
});

watch(
  () => props.items,
  () => {
    list.value = props.items;
  },
);

function addItem(item: Specification) {
  list.value.push(item);
}
function removeItem(item: Specification) {
  list.value.splice(list.value.indexOf(item), 1);
}

onMounted(() => {
  useSpecificationStore().refresh();
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
      :menus="specificationMenus"
      @click-menu="(menu) => addItem(new Specification({ key: menu.key, content: '' }))"
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
