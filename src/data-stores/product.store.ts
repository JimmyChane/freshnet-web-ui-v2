import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Product } from "@/data/product/Product";
import { DataLoader } from "./tools/DataLoader";
import { Processor } from "@/stores/tools/Processor";
import { List } from "./tools/List";
import { ProductRequest } from "@/data/product/ProductRequest";
import { useCategoryStore } from "./category.store";
import { Category } from "@/data/category/Category";
import { Brand } from "@/data/brand/Brand";
import { ProductPrices } from "@/data/product/ProductPrices";
import { ProductBundle } from "@/data/product/ProductBundle";
import { Specification } from "@/data/specification/Specification";
import { Image } from "@/data/Image";
import { optString, trimText } from "@/U";

export const useProductStore = defineStore("product", () => {
  const dataLoader = new DataLoader<Product>(1000 * 60 * 10) // 10min
    .processor(() => processor.value as Processor | undefined)
    .setData((data) => list.value.clear().addItems(data))
    .getData(() => list.value.items as Product[])
    .loadData(async () => {
      const api = await ProductRequest.list();
      const content: any[] = api.optArrayContent();
      const promises = content.map((content) => {
        return new Product().fromData(content);
      });
      return Promise.all(promises);
    });

  const processor = ref(new Processor());
  const list = ref(new List<Product>());

  async function refresh() {
    dataLoader.doTimeout();
    return await getItems();
  }
  async function getItems() {
    return dataLoader.data();
  }
  async function getItemOfId(id: string) {
    let items: Product[] = await getItems();
    let item: Product | undefined = items.find((item) => item.id === id);
    if (!item) {
      items = await refresh();
      item = items.find((item) => item.id === id);
    }
    return item;
  }
  async function getGroupsByCategory() {
    const items = await getItems();

    const categoryOther = await useCategoryStore().getItemOfKey(
      Category.Key.Other,
    );

    interface Group {
      category?: Category;
      items: Product[];
    }

    const groups: Group[] = [];
    for (const item of items) {
      let category = await item.fetchCategory();
      if (!category) category = categoryOther;
      let categoryId = category?.id ?? "";

      let group = groups.find((group) => {
        return group.category?.id === categoryId;
      });

      if (!group) {
        groups.push((group = { category, items: [] }));
      }

      group.items.push(item);
    }

    return groups;
  }
  async function getGroupsByBrand() {
    const items: Product[] = await getItems();

    interface Group {
      brand: Brand | null | undefined;
      items: Product[];
    }

    const groups: Group[] = [];
    for (const item of items) {
      let group = groups.find((group) => {
        const brandId = group.brand?.id ?? "";
        return brandId === item.brandId;
      });

      let brand: Brand | null | undefined = await item.fetchBrand();
      if (!group) {
        groups.push((group = { brand, items: [] }));
      }

      group.items.push(item);
    }

    return groups;
  }
  async function addItem(arg: { data: any }) {
    const { data } = arg;
    if (!data) throw new Error("data not valid");
    const api = await ProductRequest.addItem(data);
    const inputItem = new Product().fromData(api.optObjectContent());
    return list.value.addItem(inputItem);
  }
  async function removeItemOfId(arg: { id: string }) {
    const { id } = arg;
    const api = await ProductRequest.removeItem(id);
    api.getContent();
    list.value.removeItemById(id);
    return true;
  }
  async function updateTitleOfId(arg: { id: string; title: string }) {
    const { id, title } = arg;
    const api = await ProductRequest.updateTitle(id, title);
    const content = api.optObjectContent();
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.title = optString(content.title);
    });
  }
  async function updateDescriptionOfId(arg: {
    id: string;
    description: string;
  }) {
    const { id, description } = arg;
    const api = await ProductRequest.updateDescription(id, description);
    const content = api.optObjectContent();
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      const { description } = content;
      item.description =
        typeof description === "string" ? description.trim() : "";
    });
  }
  async function updateBrandIdOfId(arg: { id: string; brandId: string }) {
    const { id, brandId } = arg;
    const api = await ProductRequest.updateBrand(id, brandId);
    const content = api.optObjectContent();
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.setBrandId(content.brandId);
    });
  }
  async function updateCategoryIdOfId(arg: { id: string; categoryId: string }) {
    const { id, categoryId } = arg;
    const api = await ProductRequest.updateCategory(id, categoryId);
    const content = api.optObjectContent();
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.setCategoryId(content.categoryId);
    });
  }
  async function updateAvailabilityOfId(arg: {
    id: string;
    isAvailable: boolean;
  }) {
    const { id, isAvailable } = arg;
    const api = await ProductRequest.updateAvailability(id, isAvailable);
    const content = api.optObjectContent();
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      if (item.stock) item.stock.isAvailable = content.isAvailable;
    });
  }
  async function updateSecondHandOfId(arg: {
    id: string;
    isSecondHand: boolean;
  }) {
    const { id, isSecondHand } = arg;
    const api = await ProductRequest.updateSecondHand(id, isSecondHand);
    const content = api.optObjectContent();
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      if (item.stock) item.stock.isSecondHand = content.isSecondHand;
    });
  }
  async function updatePriceOfId(arg: { id: string; price: any }) {
    const { id, price } = arg;
    const api = await ProductRequest.updatePrice(
      id,
      new ProductPrices().fromData(price).toData(),
    );

    const content = api.optObjectContent();
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.setPrice(new ProductPrices().fromData(content.price).toData());
    });
  }
  async function addBundleOfId(arg: { id: string; bundle: any }) {
    const { id, bundle } = arg;
    const api = await ProductRequest.addBundle(id, bundle);
    const content = api.optObjectContent();
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.addBundle(
        new ProductBundle().fromData({
          title: trimText(content.bundle.title),
        }),
      );
    });
  }
  async function removeBundleOfId(arg: { id: string; bundle: any }) {
    const { id, bundle } = arg;
    const api = await ProductRequest.removeBundle(id, bundle);
    const content = api.optObjectContent();
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.removeBundle(content.bundle);
    });
  }
  async function addGiftOfId(arg: { id: string; gift: any }) {
    const { id, gift } = arg;
    const api = await ProductRequest.addGift(id, gift);
    const content = api.optObjectContent();
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.addGift(content.gift);
    });
  }
  async function removeGiftOfId(arg: { id: string; gift: any }) {
    const { id, gift } = arg;
    const api = await ProductRequest.removeGift(id, gift);
    const content = api.optObjectContent();
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.removeGift(content.gift);
    });
  }

  async function addSpecificationOfId(arg: { id: string; specification: any }) {
    const { id, specification } = arg;
    const api = await ProductRequest.addSpecification(id, specification);
    const content = api.optObjectContent();
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.addSpecification(content.specification);
    });
  }
  async function removeSpecificationOfId(arg: {
    id: string;
    specification: any;
  }) {
    const { id } = arg;
    let { specification } = arg;
    specification =
      specification instanceof Specification
        ? specification.toData()
        : specification;
    specification.type = specification.key;
    const api = await ProductRequest.removeSpecification(id, specification);
    const content = api.optObjectContent();
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.removeSpecification(content.specification);
    });
  }
  async function updateSpecificationsOfId(arg: {
    id: string;
    specifications: any[];
  }) {
    const { id, specifications } = arg;
    const api = await ProductRequest.updateSpecifications(id, specifications);
    const content = api.optObjectContent();
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.setSpecifications(content.specifications);
    });
  }
  async function addImageOfId(arg: { id: string; files: any }) {
    const { id, files } = arg;

    const imageFileForm = new FormData();
    for (const file of files) {
      imageFileForm.append(file.name, file);
    }

    const api = await ProductRequest.addImage(id, imageFileForm);
    const content = api.optObjectContent();
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.addImages(content.images);
    });
  }
  async function removeImageOfId(arg: { id: string; image: any }) {
    const { id } = arg;
    let { image } = arg;
    image = image instanceof Image ? image.toData() : image;
    const api = await ProductRequest.removeImage(id, image);
    const content = api.optObjectContent();
    return list.value.updateItemById(content.productId, (item) => {
      if (!item) return;
      item.removeImage(content.image);
    });
  }

  return {
    isLoading: computed(() => processor.value.isLoading()),
    lastModified: computed(() => list.value.lastModified),
    items: computed(() => list.value.items),

    refresh,
    getItems,
    getItemOfId,
    getGroupsByCategory,
    getGroupsByBrand,
    addItem,
    removeItemOfId,
    updateTitleOfId,
    updateDescriptionOfId,
    updateBrandIdOfId,
    updateCategoryIdOfId,
    updateAvailabilityOfId,
    updateSecondHandOfId,
    updatePriceOfId,
    addBundleOfId,
    removeBundleOfId,
    addGiftOfId,
    removeGiftOfId,
    addSpecificationOfId,
    removeSpecificationOfId,
    updateSpecificationsOfId,
    addImageOfId,
    removeImageOfId,
  };
});
