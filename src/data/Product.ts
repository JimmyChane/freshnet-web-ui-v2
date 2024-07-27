import { Specification, Type, TypeKey } from '@/data/Specification';
import { ProductStock, type ProductStockData } from './ProductStock';
import { ProductBundle, type ProductBundleData } from './ProductBundle';
import { ProductPrices, type ProductPricesData } from './ProductPrices';
import { ProductPrice } from './ProductPrice';
import { Item } from '@/data/Item';
import { useBrandStore } from '@/data-stores/brand.store';
import { useCategoryStore } from '@/data-stores/category.store';
import { getOrigin, optArray, optString, textContains, trimId, trimText } from '@/utils/U';
import { Image } from './Image';
import { Brand } from '@/data/Brand';
import { Category } from '@/data/Category';
import { serverRequest } from './Server';

const FORMAT_SPECIFICATION_ORDERS = Object.values(TypeKey);
function putForwardSlash(texts: string[], separation: string = ' / '): string {
  return texts.reduce((result, text, i) => {
    if (i === 0) return text;
    return `${result}${separation}${text}`;
  });
}

export interface ProductData {
  _id?: string;
  title?: string;
  description?: string;
  stock?: ProductStockData;
  brandId?: string;
  categoryId?: string;
  gifts?: string[];
  bundles?: ProductBundleData[];
  specifications?: { type?: string; content?: string }[];
  specification?: Record<string, string>;
  images?: { method?: string; path?: string }[];
  image?: { method?: string; path?: string };
  price?: ProductPricesData;
}

export class Product implements Item {
  id: string;
  title: string;
  description: string;
  gifts: string[];
  bundles: any[];
  brandId: string;
  categoryId: string;
  specifications: Specification[];
  images: Image[];
  price?: ProductPrices;
  stock?: ProductStock;

  category?: Category;
  brand?: Brand;

  constructor(data: ProductData) {
    this.id = trimId(data._id);
    this.title = trimText(data.title);
    this.description = trimText(data.description);
    this.stock = typeof data.stock === 'object' ? new ProductStock(data.stock) : new ProductStock();
    this.brandId = trimId(data.brandId);
    this.categoryId = trimId(data.categoryId);
    this.gifts = optArray(data.gifts)
      .map((gift) => trimText(gift))
      .filter((gift) => !!gift);
    this.bundles = optArray(data.bundles).map((bundle) => {
      return new ProductBundle(bundle).toData();
    });

    this.setCategoryId(trimId(data.categoryId));

    const specifications = optArray(data.specifications).map((specification: any) => {
      return {
        type: trimId(specification.type),
        content: trimText(specification.content),
      };
    });
    if (typeof data.specification === 'object' && data.specification) {
      const { specification } = data;
      specifications.unshift(
        ...Object.keys(specification).map((type) => {
          return {
            type: trimId(type),
            content: trimId(specification[type]),
          };
        }),
      );
    }
    this.specifications = specifications.map((specification) => {
      return new Specification({
        key: specification.type,
        content: specification.content,
      });
    });

    const images = optArray(data.images);
    if (typeof data.image === 'object' && data.image) {
      images.unshift(data.image);
    }
    this.images = images
      .filter((image) => {
        const isMethodString = typeof image.method === 'string';
        const isPathString = typeof image.path === 'string';
        return isMethodString && isPathString;
      })
      .map((image) => {
        return new Image({
          method: trimId(image.method),
          path: trimId(image.path),
        });
      });

    let dataPrice = null;
    if (data.price) dataPrice = data.price;
    else {
      const prices = optArray(data.stock?.prices ?? []).filter((price: any) => {
        return price?.normal || price.promotion;
      });
      if (prices.length > 0) dataPrice = prices[prices.length - 1];
    }
    const price = dataPrice ? new ProductPrices(dataPrice) : null;
    this.setPrice(price?.toData());
  }
  toData(): ProductData {
    return {
      _id: trimId(this.id),
      title: trimText(this.title),
      description: trimText(this.description),
      brandId: trimId(this.brandId),
      stock: this.stock instanceof ProductStock ? this.stock.toData() : {},
      categoryId: trimId(this.categoryId),
      gifts: this.gifts.map((gift) => trimText(gift)).filter((gift) => !!gift),
      bundles: this.bundles.map((bundle) => bundle.toData()),
      specification: this.specifications.reduce((obj: Record<string, string>, spec) => {
        const data = spec.toData();
        obj[data.key ?? ''] = data.content;
        return obj;
      }, {}),
      images: this.images.map((image) => image.toData()),
      price:
        this.price instanceof ProductPrices
          ? this.price.toData()
          : new ProductPrices(this.price ?? {}).toData(),
    };
  }

  getUnique(): string {
    return this.id;
  }

  toCount(strs: string[]): number {
    let { brand, category, specifications } = this;

    return strs.reduce((count, str) => {
      if (textContains('product', str)) count++;
      if (textContains(this.title, str)) count++;
      if (textContains(this.description, str)) count++;
      if (brand && textContains(brand.title, str)) count++;
      if (category && textContains(category.title, str)) count++;

      count += specifications.reduce((count, specContent) => {
        return count + specContent.toCount(strs);
      }, 0);
      return count;
    }, 0);
  }
  toImageThumbnail(): Image | undefined {
    return this.images.length ? this.images[0] : undefined;
  }
  async toStringSpecifications(): Promise<string> {
    const arr1 = [
      'Microsoft Surface Pro 9 (Platinum)',
      'Intel 15-1235U',
      '8GB D5',
      '128GB SSD',
      '13.0"Touch',
      'Intel Iris Xe Graphics',
      'W11 (QCB-00013)',
      'rm4999',
    ];
    const arr2 = [
      'Microsoft Surface Pro 9 (Graphite/ Sapphire/Frost)',
      'Intel EVO Core i5-1235U',
      '8GB D5',
      '256GB SSD',
      '13.0 Touch',
      'Intel Iris Xe Graphics',
      'W11 (QEZ-00030/ QEZ-00047/QEZ-00064)',
      'rm5499',
      'FREE Surface Pro Signature Keyboard',
    ];
    const arr3 = [
      'Microsoft Surface GO 3 (Matte Black)',
      'Intel Core i3-10100Y 1.30~3.90GHz',
      '8GB',
      '128GB SSD',
      '10.5"Touch',
      'Intel UHD Graphics 630',
      '1 Year Warranty Tel: 1800-81-8798',
      'W11 (8VC-00024)',
      'rm3150',
    ];
    const arr4 = [
      'Microsoft Surface Go Signature Type Cover',
      'Keyboard for Surface GO 2/3',
      '1-YR WRTY',
      'rm499',
    ];
    const arr5 = [
      'Microsoft Surface GO 3 (Platinum)',
      'Intel Pentium Gold 6500Y 1.10~3.40GHz',
      '8GB',
      '128GB SSD',
      '10.5"Touch',
      'Intel UHD Graphics 615',
      '1 Year Warranty Tel: 1800-81-8798',
      'W11 (8VA-00009)',
      'rm2560',
    ];

    const texts: string[] = [];
    const specs = this.specifications
      .filter((specification) => {
        return FORMAT_SPECIFICATION_ORDERS.includes(specification.typeKey);
      })
      .sort((specification1, specification2) => {
        const index1 = FORMAT_SPECIFICATION_ORDERS.indexOf(specification1.typeKey);
        const index2 = FORMAT_SPECIFICATION_ORDERS.indexOf(specification2.typeKey);

        return index1 - index2;
      });

    // title
    const title = await this.fetchFullTitle();
    const colorSpecification = this.specifications.find((specification) => {
      return specification.typeKey === Type.Key.Colour;
    });
    if (colorSpecification) {
      specs.splice(specs.indexOf(colorSpecification), 1);
      texts.push(`${title} (${colorSpecification.content})`);
    } else {
      texts.push(title);
    }

    // specification
    texts.push(
      ...specs.map((specification) => {
        return specification.content;
      }),
    );

    // price
    const price = this.price?.normal?.toString() ?? '';
    if (price.length > 0) {
      texts.push(price);
    }

    return putForwardSlash(texts);
  }

  isPricePromotion(): boolean {
    let price = this.price;
    if (!price) return false;

    let normalValue = price.normal?.value ?? 0;
    let promotionValue = price.promotion?.value ?? 0;

    return normalValue > 0 && promotionValue > 0 && normalValue > promotionValue;
  }
  isStockAvailable(): boolean {
    return this.stock?.isAvailable ?? true;
  }
  isStockSecondHand(): boolean {
    return this.stock?.isSecondHand ?? false;
  }

  compare(item: Product): number {
    let value = 0;
    if (value === 0) value = this.compareAvailable(item);
    if (value === 0) value = this.title.localeCompare(item.title);
    if (value === 0) value = this.comparePromotions(item);
    if (value === 0) value = this.compareSecondHand(item);
    if (value === 0) value = this.compareImage(item);
    if (value === 0) value = this.comparePrices(item);
    return value;
  }
  compareAvailable(item: Product): number {
    const stock1 = this.stock ?? { isAvailable: true, isSecondHand: false };
    const stock2 = item.stock ?? { isAvailable: true, isSecondHand: false };
    const isAvailable1 = stock1.isAvailable ?? true;
    const isAvailable2 = stock2.isAvailable ?? true;

    if (isAvailable1 && !isAvailable2) return -1;
    if (!isAvailable1 && isAvailable2) return 1;
    return 0;
  }
  compareImage(item: Product): number {
    return this.images.length - item.images.length;
  }
  comparePromotions(item: Product): number {
    let price1 = this.price;
    let price2 = item.price;

    let promotion1 = price1 ? optString(price1.promotion).trim() : '';
    let promotion2 = price2 ? optString(price2.promotion).trim() : '';

    let hasPromotion1 = promotion1.length > 0;
    let hasPromotion2 = promotion2.length > 0;

    if (hasPromotion1 && !hasPromotion2) return -1;
    if (!hasPromotion1 && hasPromotion2) return 1;
    return 0;
  }
  comparePrices(item: Product): number {
    let price1 = this.price;
    let price2 = item.price;

    let normal1 = price1 ? optString(price1.normal).trim() : '';
    let normal2 = price2 ? optString(price2.normal).trim() : '';

    if (!normal1 && normal2) return 1;
    if (normal1 && !normal2) return -1;

    if (normal1 > normal2) return -1;
    if (normal1 < normal2) return 1;
    return 0;
  }
  compareSecondHand(item: Product): number {
    const stock1 = this.stock ?? { isAvailable: true, isSecondHand: false };
    const stock2 = item.stock ?? { isAvailable: true, isSecondHand: false };

    const isSecondHand1 = stock1.isSecondHand ?? false;
    const isSecondHand2 = stock2.isSecondHand ?? false;
    if (isSecondHand1 && !isSecondHand2) return 1;
    if (!isSecondHand1 && isSecondHand2) return -1;
    return 0;
  }

  async fetchBrand(): Promise<Brand | undefined> {
    if (!this.brandId) return undefined;
    const brands: Brand[] = await useBrandStore().getItems();
    return brands.find((brand) => brand.id === this.brandId);
  }
  async fetchFullTitle(): Promise<string> {
    const { title } = this;
    const brand = await this.fetchBrand();
    const brandTitle = brand ? brand.title : '';

    if (!brandTitle && !title) return '';
    if (brandTitle && title) return `${brandTitle} ${title}`;
    if (title) return title;
    if (brandTitle) return brandTitle;
    return '';
  }
  async fetchCategory(): Promise<Category | undefined> {
    if (!this.categoryId) return undefined;
    const categories: Category[] = await useCategoryStore().getItems();
    return categories.find((category) => category.id === this.categoryId);
  }

  getPriceNormal(): ProductPrice | null {
    return this.price?.normal ?? null;
  }
  getPricePromotion(): ProductPrice | null {
    return this.price?.promotion ?? null;
  }
  getPriceNormalValue(): number {
    return this.getPriceNormal()?.value ?? 0;
  }
  getPricePromotionValue(): number {
    return this.getPricePromotion()?.value ?? 0;
  }
  getLink(): string {
    return `${getOrigin()}/item/id/${this.id}`;
  }

  setBrandId(brandId: string) {
    this.brandId = brandId;
    this.fetchBrand().then((brand) => {
      this.brand = brand ?? undefined;
    });
  }
  setCategoryId(categoryId: string) {
    this.categoryId = categoryId;
    this.fetchCategory().then((category) => {
      this.category = category ?? undefined;
    });
  }
  setPrice(price: any) {
    this.price = new ProductPrices(price ?? {});
  }

  setImages(images: (Image | any)[]) {
    this.images = images
      .filter((image) => {
        const isMethodString = typeof image.method === 'string';
        const isPathString = typeof image.path === 'string';
        return isMethodString && isPathString;
      })
      .map((image) => {
        return new Image({ method: image.method, path: image.path });
      });
  }
  addImages(images: (Image | any)[]) {
    this.images.push(...images.map((data) => new Image(data)));
  }
  removeImage(image: Image | any) {
    this.images = this.images.filter((thisImage) => {
      return thisImage.path !== image.path;
    });
  }

  setSpecifications(specifications: { type: string; content: string }[] = []) {
    this.specifications = specifications.map((specification) => {
      return new Specification({
        key: specification.type,
        content: specification.content,
      });
    });
  }
  addSpecification(specification: { type: string; content: string }) {
    const specContent = new Specification({
      key: specification.type,
      content: specification.content,
    });

    this.specifications.push(specContent);
  }
  removeSpecification(specification: Specification | { type: string; content: string }) {
    const typeKey =
      specification instanceof Specification ? specification.getKey() : specification.type;

    this.specifications = this.specifications.filter((thisSpecification) => {
      return !(
        thisSpecification.getKey() === typeKey &&
        thisSpecification.content === specification.content
      );
    });
  }

  setBundles(data: (ProductBundle | any)[] = []) {
    this.bundles = optArray(data).map((bundle) => {
      return new ProductBundle(bundle).toData();
    });
  }
  addBundle(bundle: ProductBundle) {
    this.bundles.push(bundle);
  }
  removeBundle(bundle: ProductBundle) {
    this.bundles = this.bundles.filter((thisBundle) => {
      return thisBundle.title !== bundle.title;
    });
  }

  setGifts(data: string[] = []) {
    this.gifts = optArray(data)
      .map((gift) => trimText(gift))
      .filter((gift) => !!gift);
  }
  addGift(gift: string) {
    this.gifts.push(gift);
  }
  removeGift(gift: string) {
    this.gifts = this.gifts.filter((thisGift) => thisGift !== gift);
  }
}

export class ProductRequest {
  static list(): Promise<any> {
    return serverRequest().path('productv2/list/').sendJson();
  }
  static addItem(data: any): Promise<any> {
    return serverRequest().POST().path('productv2/').bodyJson({ content: data }).sendJson();
  }
  static removeItem(id: string): Promise<any> {
    return serverRequest().DELETE().path(`productv2/id/${id}`).bodyJson({ id }).sendJson();
  }
  static updateTitle(id: string, title: string): Promise<any> {
    return serverRequest()
      .PUT()
      .path('productv2/title/')
      .bodyJson({ content: { productId: id, title } })
      .sendJson();
  }
  static updateDescription(id: string, description: string): Promise<any> {
    return serverRequest()
      .PUT()
      .path('productv2/description/')
      .bodyJson({ content: { productId: id, description } })
      .sendJson();
  }
  static updateBrand(id: string, brandId: string): Promise<any> {
    return serverRequest()
      .PUT()
      .path('productv2/brandId/')
      .bodyJson({ content: { productId: id, brandId } })
      .sendJson();
  }
  static updateCategory(id: string, categoryId: string): Promise<any> {
    return serverRequest()
      .PUT()
      .path('productv2/categoryId/')
      .bodyJson({ content: { productId: id, categoryId } })
      .sendJson();
  }
  static updateAvailability(id: string, isAvailable: boolean): Promise<any> {
    return serverRequest()
      .PUT()
      .path('productv2/isAvailable/')
      .bodyJson({ content: { productId: id, isAvailable } })
      .sendJson();
  }
  static updateSecondHand(id: string, isSecondHand: boolean): Promise<any> {
    return serverRequest()
      .PUT()
      .path('productv2/isSecondHand/')
      .bodyJson({ content: { productId: id, isSecondHand } })
      .sendJson();
  }
  static updatePrice(id: string, price: any): Promise<any> {
    return serverRequest()
      .PUT()
      .path('productv2/price/')
      .bodyJson({ content: { productId: id, price } })
      .sendJson();
  }
  static addBundle(id: string, bundle: any): Promise<any> {
    return serverRequest()
      .POST()
      .path('productv2/bundle/')
      .bodyJson({ content: { productId: id, bundle } })
      .sendJson();
  }
  static removeBundle(id: string, bundle: any): Promise<any> {
    return serverRequest()
      .DELETE()
      .path('productv2/bundle/')
      .bodyJson({ content: { productId: id, bundle: bundle } })
      .sendJson();
  }
  static addGift(id: string, gift: any): Promise<any> {
    return serverRequest()
      .POST()
      .path('productv2/gift/')
      .bodyJson({ content: { productId: id, gift } })
      .sendJson();
  }
  static removeGift(id: string, gift: any): Promise<any> {
    return serverRequest()
      .DELETE()
      .path('productv2/gift/')
      .bodyJson({ content: { productId: id, gift } })
      .sendJson();
  }

  static addSpecification(id: string, specification: any): Promise<any> {
    return serverRequest()
      .POST()
      .path('productv2/specification/')
      .bodyJson({ content: { productId: id, specification } })
      .sendJson();
  }
  static removeSpecification(id: string, specification: any): Promise<any> {
    return serverRequest()
      .DELETE()
      .path('productv2/specification/')
      .bodyJson({ content: { productId: id, specification } })
      .sendJson();
  }
  static updateSpecifications(id: string, specifications: any[]): Promise<any> {
    return serverRequest()
      .PUT()
      .path('productv2/specification/list')
      .bodyJson({ content: { productId: id, specifications } })
      .sendJson();
  }
  static addImage(id: string, imageForm: any): Promise<any> {
    return serverRequest().POST().path(`productv2/id/${id}/image/`).body(imageForm).send();
  }
  static removeImage(id: string, image: any): Promise<any> {
    return serverRequest()
      .DELETE()
      .path(`productv2/id/${id}/image/`)
      .bodyJson({ content: { image } })
      .sendJson();
  }
}
