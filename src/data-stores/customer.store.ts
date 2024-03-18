import { defineStore } from "pinia";
import { CustomerRequest } from "@/data/customer/CustomerRequest";
import { Customer, type CustomerData } from "@/data/customer/Customer";
import { DataLoader } from "./tools/DataLoader";
import { Processor } from "@/stores/tools/Processor";
import { List } from "./tools/List";
import { computed, ref } from "vue";
import { useOrderStore } from "./order.store";
import { useDeviceStore } from "./device.store";
import { useServiceStore } from "@/data-stores/service.store";
import { ServiceCustomer } from "@/data/service/ServiceCustomer";
import { OrderCustomer } from "@/data/order/OrderCustomer";
import { optString } from "@/U";

export const useCustomerStore = defineStore("customer", () => {
  const dataLoader = new DataLoader<Customer>(1000 * 60 * 10) // 10min
    .processor(() => processor.value as Processor | undefined)
    .setData((data) => list.value.clear().addItems(data))
    .getData(() => list.value.items)
    .loadData(async () => {
      const api = await CustomerRequest.list();
      const content: any[] = api.optArrayContent();
      return content.map((content) => {
        return new Customer(content);
      });
    });

  const processor = ref(new Processor());
  const list = ref(new List<Customer>());

  async function refresh() {
    dataLoader.doTimeout();
    await getItems();
    await useDeviceStore().refresh();
  }
  async function getItems() {
    return dataLoader.data();
  }
  async function getItemOfId(id = "") {
    if (typeof id !== "string") return null;
    const items: Customer[] = await getItems();
    return items.find((item) => item.id === id) ?? null;
  }
  async function getItemsOfIds(ids: string[] = []) {
    if (!Array.isArray(ids)) return [];

    const items: Customer[] = await getItems();
    const results = ids.map((id) => {
      return items.find((item) => item.id === id) ?? null;
    });
    return results;
  }
  async function generateCustomersAcross() {
    const cloneCustomer = (
      customer: Customer | ServiceCustomer | OrderCustomer,
    ) => {
      return new Customer(customer.toData());
    };

    const customers: Customer[] = await getItems();
    for (const customer of customers) {
      customer.cachedServices = [];
      customer.cachedOrders = [];
    }
    const optCustomer = (
      eCustomer?: Customer | ServiceCustomer | OrderCustomer,
    ) => {
      if (!eCustomer) return;

      let customer = customers.find((customer) => {
        const eName = optString(customer.name);
        const ePhoneNumberValue = customer.phoneNumber?.value ?? "";

        const name = optString(eCustomer.name);
        const phoneNumberValue = eCustomer.phoneNumber?.value ?? "";

        return eName === name && ePhoneNumberValue === phoneNumberValue;
      });

      if (!customer) {
        customer = cloneCustomer(eCustomer);
        customers.push(customer);
      }

      return customer;
    };

    const serviceGroups = await useServiceStore().getGroupsByCustomer();
    const orderGroups = await useOrderStore().getGroupsByCustomer();
    for (const serviceGroup of serviceGroups) {
      const customer = optCustomer(serviceGroup.customer);
      customer?.cachedServices.push(...serviceGroup.items);
    }
    for (const orderGroup of orderGroups) {
      const customer = optCustomer(orderGroup.customer);
      customer?.cachedOrders.push(...orderGroup.items);
    }

    return customers;
  }
  async function addItem(arg: CustomerData) {
    const data: any = new Customer(arg).toData();
    delete data.id;
    const api = await CustomerRequest.add(data);
    const content = api.optObjectContent();
    const item = new Customer(content);
    return list.value.addItem(item);
  }
  async function removeItemOfId(arg: { _id: string }) {
    const { _id } = arg;
    const api = await CustomerRequest.remove(_id);
    const content = api.optObjectContent();
    const item = new Customer(content);
    return list.value.removeItemByItem(item);
  }
  async function updateNamePhoneNumberOfItemId(arg: {
    _id: string;
    name: string;
    phoneNumber: string;
  }) {
    const { _id, name, phoneNumber } = arg;
    const api = await CustomerRequest.updateNamePhoneNumber(
      _id,
      name,
      phoneNumber,
    );
    const content = api.optObjectContent();
    const inputItem = new Customer(content);
    return list.value.updateItemById(inputItem.id, (item) => {
      if (!item) return;
      item.name = inputItem.name;
      item.phoneNumber = inputItem.phoneNumber;
    });
  }

  async function updateDescriptionOfId(arg: {
    _id: string;
    description: string;
  }) {
    const { _id, description } = arg;
    const api = await CustomerRequest.updateDescription(_id, description);
    const content = api.optObjectContent();
    const inputItem = new Customer(content);
    return list.value.updateItemById(inputItem.id, (item) => {
      if (!item) return;
      item.description = inputItem.description;
    });
  }

  return {
    isLoading: computed(() => processor.value.isLoading()),
    lastModified: computed(() => list.value.lastModified),
    items: computed(() => list.value.items),

    refresh,
    getItems,
    getItemOfId,
    getItemsOfIds,
    generateCustomersAcross,
    addItem,
    removeItemOfId,
    updateNamePhoneNumberOfItemId,
    updateDescriptionOfId,

    devices: computed(() => useDeviceStore().items),

    getDevices: () => useDeviceStore().getItems(),
    getDeviceById: (id: string) => useDeviceStore().getItemOfId(id),
    getDevicesByIds: (ids: string[]) => useDeviceStore().getItemsOfIds(ids),
    addDevice: (arg: any) => useDeviceStore().addItem(arg),
    removeDevice: (arg: any) => useDeviceStore().removeItemOfId(arg),
    updateDeviceSpecifications: (arg: any) =>
      useDeviceStore().updateSpecificationsOfId(arg),
    updateDeviceDescription: (arg: any) =>
      useDeviceStore().updateDescriptionOfId(arg),
  };
});
