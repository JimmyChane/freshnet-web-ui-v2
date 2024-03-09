import { defineStore } from "pinia";
import { Order } from "@/data/order/Order";
import { OrderRequest } from "@/data/order/OrderRequest";
import { DataLoader } from "./tools/DataLoader";
import { Processor } from "@/stores/tools/Processor";
import { List } from "./tools/List";
import { computed, ref } from "vue";
import { OrderCustomer } from "@/data/order/OrderCustomer";
import { ServiceCustomer } from "@/data/service/ServiceCustomer";

export const useOrderStore = defineStore("order", () => {
  const dataLoader = new DataLoader<Order>(1000 * 60 * 10) // 10min
    .processor(() => processor.value as Processor | undefined)
    .setData((data) => list.value.clear().addItems(data))
    .getData(() => list.value.items)
    .loadData(async () => {
      const api = await OrderRequest.list();
      const content: any[] = api.optArrayContent();
      return content.map((data) => new Order().fromData(data));
    });

  const processor = ref(new Processor());
  const list = ref(new List<Order>());

  async function refresh() {
    dataLoader.doTimeout();
    await getItems();
  }
  async function getItems() {
    return dataLoader.data();
  }

  async function getGroupsByCustomer() {
    interface Group {
      customer?: OrderCustomer;
      items: Order[];
    }

    const items: Order[] = await getItems();
    const groups: Group[] = items.reduce((groups: Group[], item: Order) => {
      let group: Group | undefined = groups.find((group: Group) => {
        if (group.customer === item.customer) return true;
        if (
          group.customer instanceof ServiceCustomer &&
          item.customer instanceof ServiceCustomer
        ) {
          return group.customer.isEqual(item.customer);
        }
      });

      if (!group) {
        group = { customer: item.customer, items: [] };
        groups.push(group);
      }

      group.items.push(item);
      return groups;
    }, []);

    return groups;
  }
  async function getGroupsByStatus() {
    interface Group {
      status: number;
      items: Order[];
    }

    const items = await getItems();
    const groups: Group[] = items.reduce((groups: Group[], item: Order) => {
      let group: Group | undefined = groups.find((group: Group) => {
        return group.status === item.status;
      });

      if (!group) {
        group = { status: item.status, items: [] };
        groups.push(group);
      }

      group.items.push(item);
      return groups;
    }, []);

    return groups;
  }

  async function addItem(arg: { data: any }) {
    const { data } = arg;
    if (!data) return null;
    const api = await OrderRequest.add(data);
    const order = new Order().fromData(api.optObjectContent());
    return list.value.addItem(order);
  }
  async function removeOItemOfId(arg: { id: string }) {
    const { id } = arg;
    const api = await OrderRequest.delete(id);
    api.getContent();
    list.value.removeItemById(id);
  }
  async function updateStatusOfId(arg: { id: string; status: number }) {
    const { id, status } = arg;
    const api = await OrderRequest.updateStatus(id, status);
    api.getContent();
    return list.value.updateItemById(id, (item) => {
      if (!item) return;
      item.status = status;
    });
  }

  async function updateToPendingOfId(id = "") {
    const status = Order.Status.Pending;
    return updateStatusOfId({ id, status });
  }
  async function updateToCompletedOfId(id = "") {
    const status = Order.Status.Completed;
    return updateStatusOfId({ id, status });
  }

  return {
    isLoading: computed(() => processor.value.isLoading()),
    lastModified: computed(() => list.value.lastModified),
    items: computed(() => list.value.items),

    refresh,
    getItems,
    getGroupsByCustomer,
    getGroupsByStatus,
    addItem,
    removeOItemOfId,
    updateStatusOfId,
    updateToPendingOfId,
    updateToCompletedOfId,
  };
});
