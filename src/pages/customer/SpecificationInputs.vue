<script setup lang="ts">
  import ItemSpec from "./ItemSpecificationInput.vue";
  import Selector4 from "@/components/selector/Selector4.vue";
  import { Type } from "@/data/specification/Specification";
  import { useSpecificationStore } from "@/data-stores/specification.store";
  import { computed, onMounted, ref, watch } from "vue";

  const props = withDefaults(defineProps<{ items?: any[] }>(), {
    items: () => [],
  });

  const list = ref<any[]>([]);

  const KeyNone = computed(() => "none");
  const SpecKey = computed(() => Type.Key);
  const SpecKeys = computed(() => [
    KeyNone.value,
    ...Object.keys(SpecKey.value).map((key) => SpecKey.value[key]),
  ]);
  const SpecificationMenus = computed((c) => {
    return [
      { key: KeyNone.value, title: "None" },
      ...useSpecificationStore().items.map((item) => item),
    ]
      .map((item) => ({
        key: item.key,
        title: item.title,
        icon: item.icon?.toUrl() ?? "",
      }))
      .filter((menu) => {
        if (menu.key === "none") return true;

        const dataSpecification = list.value.find((dataSpec) => {
          return dataSpec.typeKey === menu.key;
        });
        return !dataSpecification;
      })
      .sort((menu1, menu2) => {
        return c.SpecKeys.indexOf(menu1.key) - c.SpecKeys.indexOf(menu2.key);
      });
  });

  watch(
    () => props.items,
    () => {
      list.value = props.items;
    },
  );

  function addItem(item) {
    list.value.push(item);
  }
  function removeItem(item) {
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
        :key="item.key"
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
