<script setup lang="ts">
import NavigationBar from '@/components/actionbar/NavigationBar.vue';
import Tabs from '@/page-components/print/PagePrint-Tabs.vue';
import Card from '@/page-components/print/PagePrint-Card.vue';
import Footer from '@/app/footer/AppFooter.vue';
import { Price } from '@/data/Price';
import { computed, onMounted, ref } from 'vue';
import { Output } from '@/page-components/print/Output';
import { Paper } from '@/page-components/print/Paper';
import { PaperSide } from '@/page-components/print/PaperSide';
import { PaperSize } from '@/page-components/print/PaperSize';
import { Category, Item, Media, Subcategory } from '@/page-components/print/PagePrint';
import type { Tab } from '@/page-components/product-view/ViewerProduct-Tabs-Tab.vue';

const items = ref<Media[]>([
  new Media('Photostat', [
    new Category(Paper.PlainA4, [
      new Subcategory(Output.BlackWhite, [
        new Item(PaperSide.Front, new Price(0.1)),
        new Item(PaperSide.FrontBack, new Price(0.2)),
        new Item(PaperSide.FrontIc, new Price(0.2)),
      ]),
      new Subcategory(Output.Colorful, [
        new Item(PaperSide.Front, new Price(1)),
        new Item(PaperSide.FrontBack, new Price(2)),
        new Item(PaperSide.FrontIc, new Price(2)),
      ]),
    ]),
    new Category(Paper.PlainA3, [
      new Subcategory(Output.BlackWhite, [
        new Item(PaperSide.Front, new Price(0.2)),
        new Item(PaperSide.FrontBack, new Price(0.4)),
      ]),
      new Subcategory(Output.Colorful, [
        new Item(PaperSide.Front, new Price(2)),
        new Item(PaperSide.FrontBack, new Price(4)),
      ]),
    ]),
  ]),
  new Media('Computer Print', [
    new Category(Paper.PlainA4, [
      new Subcategory(Output.BlackWhite, [
        new Item(PaperSide.Front, new Price(0.5)),
        new Item(PaperSide.FrontBack, new Price(1.0)),
      ]),
      new Subcategory(Output.Colorful, [
        new Item(PaperSide.Front, new Price(1.0)),
        new Item(PaperSide.FrontBack, new Price(2.0)),
      ]),
    ]),
    new Category(Paper.PlainA3, [
      new Subcategory(Output.BlackWhite, [
        new Item(PaperSide.Front, new Price(1.0)),
        new Item(PaperSide.FrontBack, new Price(2.0)),
      ]),
      new Subcategory(Output.Colorful, [
        new Item(PaperSide.Front, new Price(2.0)),
        new Item(PaperSide.FrontBack, new Price(4.0)),
      ]),
    ]),
    new Category(Paper.Photo4R, [
      new Subcategory(Output.BorderlessColorful, [new Item(PaperSide.Front, new Price(1.5))]),
    ]),
    new Category(Paper.PhotoA4, [
      new Subcategory(Output.BorderlessColorful, [new Item(PaperSide.Front, new Price(4.0))]),
    ]),
  ]),
  new Media('Laminate Document', [
    new Category(undefined, [
      new Subcategory(undefined, [
        new Item(PaperSize.A4, new Price(2.0)),
        new Item(PaperSize.A3, new Price(4.0)),
      ]),
    ]),
  ]),
  new Media('Scan Document', [
    new Category(undefined, [
      new Subcategory(undefined, [
        new Item(PaperSize.A4, new Price(0.5)),
        new Item(PaperSize.A3, new Price(0.5)),
      ]),
    ]),
  ]),
  new Media('Binding', [
    new Category(undefined, [
      new Subcategory({ toString: () => 'Comb', color: { icon: '' } }, [
        new Item({ title: '8mm' }, new Price(1.0)),
        new Item({ title: '10mm' }, new Price(1.0)),
        new Item({ title: '12mm' }, new Price(1.5)),
        new Item({ title: '14mm' }, new Price(2.0)),
        new Item({ title: '16mm' }, new Price(2.0)),
        new Item({ title: '25mm' }, new Price(3.0)),
      ]),
      new Subcategory(undefined, [new Item({ title: 'Tape & Staple' }, new Price(1.0))]),
    ]),
  ]),
]);

const tab0 = ref<Tab>();
const tab1 = ref<Tab>();
const tab2 = ref<Tab>();

const tabs0 = computed<Tab[]>(() => {
  return items.value.map((layer) => {
    const tab = {
      title: layer.title,
      isSelected: () => tab === tab0.value,
      click: () => {
        tab0.value = tab;
        tab1.value = tabs1.value[0];
      },
    };
    return tab;
  });
});
const tabs1 = computed<Tab[]>(() => {
  if (tabs0.value.length === 0) return [];

  const layer = items.value.find((layer) => {
    return layer.title === tab0.value?.title;
  });

  if (!layer) return [];
  if (!Array.isArray(layer.items)) return [];
  if (layer.items.length === 0) return [];

  return layer.items.map((layer) => {
    const tab = {
      title: layer.title,
      isSelected: () => tab === tab1.value,
      click: () => (tab1.value = tab),
    };
    return tab;
  });
});
const tabs2 = computed<Tab[]>(() => {
  if (tabs1.value.length === 0) return [];

  const layer = items.value
    .find((layer) => layer.title === tab0.value?.title)
    ?.items.find((layer) => layer.title === tab1.value?.title);

  if (!layer) return [];
  if (!Array.isArray(layer.items)) return [];
  if (layer.items.length === 0) return [];

  return layer.items.map((layer) => {
    const tab = {
      title: layer.title,
      isSelected: () => tab === tab2.value,
      click: () => (tab2.value = tab),
    };
    return tab;
  });
});

const currentLayer = computed<Media | Category | Subcategory | undefined>(() => {
  if (tabs1.value.length === 0) return undefined;

  const layer1: Media | undefined = items.value.find((media) => media.title === tab0.value?.title);
  const layer2: Category | undefined = layer1?.items.find(
    (category) => category.title === tab1.value?.title,
  );
  const layer3: Subcategory | undefined = layer2?.items.find(
    (subcategory) => subcategory.title === tab2.value?.title,
  );

  if (layer2) return layer2;
  if (layer1) return layer1;
  if (layer3) return layer3;

  return undefined;
});

onMounted(() => {
  tab0.value = tabs0.value[0];
  tab1.value = tabs1.value[0];
  tab2.value = tabs2.value[0];
});
</script>

<template>
  <div class="PagePrint">
    <NavigationBar :style="{ 'z-index': '3' }" :title="$options.title" />

    <div class="PagePrint-tabs" :style="{ 'z-index': '2' }">
      <Tabs v-if="tabs0.length" :items="tabs0" />
      <Tabs v-if="tabs1.length" :items="tabs1" />
    </div>

    <div class="PagePrint-body" :style="{ 'z-index': '1' }" v-if="currentLayer instanceof Category">
      <Card v-for="preview of currentLayer.items" :key="preview.title" :preview="preview" />
    </div>

    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.PagePrint {
  width: 100%;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  .PagePrint-tabs {
    width: 100%;
    max-width: max-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .PagePrint-body {
    gap: 2rem;
    padding: 1rem;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    flex-grow: 1;
    align-items: flex-start;
    justify-content: center;
  }
}
</style>
