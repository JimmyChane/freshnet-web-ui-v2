import { defineStore } from 'pinia';
import { Service, ServiceRequest } from '@/data/Service';
import { computed, ref } from 'vue';
import { DataLoader } from '@/utils/DataLoader';
import { Processor } from '@/utils/Processor';
import { List } from '@/utils/List';
import { ServiceCustomer } from '@/data/ServiceCustomer';
import { ServiceImage } from '@/data/ServiceImage';
import { ServiceEvent } from '@/data/ServiceEvent';
import { URGENT, WARRANTY } from '@/data/ServiceLabel';
import { ServiceBelonging } from '@/data/ServiceBelonging';
import type { ServiceStateId } from '@/data/ServiceState';

const Notify = {
  ItemAdd: 'item-add',
  ItemRemove: 'item-remove',
  ItemImageAdd: 'item-image-add',
  ItemImageRemove: 'item-image-remove',
  ItemEventAdd: 'item-event-add',
  ItemEventRemove: 'item-event-remove',
  ItemEventImageAdd: 'item-event-image-add',
  ItemEventImageRemove: 'item-event-image-remove',
  ItemEventDescriptionUpdate: 'item-event-description-update',
  ItemLabelAdd: 'item-label-add',
  ItemLabelRemove: 'item-label-remove',
  ItemStateUpdate: 'item-state-update',
  ItemDescriptionUpdate: 'item-description-update',
  ItemBelongingsUpdate: 'item-belongings-update',
  ItemCustomerUpdate: 'item-customer-update',
};

interface Group {
  customer?: ServiceCustomer;
  items: Service[];
}

export const useServiceStore = defineStore('service', () => {
  const dataLoader = new DataLoader<Service>(1000 * 60 * 10) // 10min
    .processor(() => processor.value as Processor | undefined)
    .setData((data) => list.value.clear().addItems(data))
    .getData(() => list.value.items as Service[])
    .loadData(async () => {
      const api = await ServiceRequest.list();
      const content: any[] = api.optArrayContent();
      return content.map((content) => new Service(content));
    });

  const processor = ref(new Processor());
  const list = ref(new List<Service>());

  async function refresh() {
    dataLoader.doTimeout();
    await getItems();
  }
  async function getItems() {
    return dataLoader.data();
  }
  async function getItemOfId(id = '') {
    let items: Service[] = await getItems();
    return items.find((service) => service.id === id);
  }
  async function getGroupsByCustomer() {
    const items: Service[] = await getItems();
    const groups: Group[] = items.reduce((groups: Group[], item: Service) => {
      let group: Group | undefined = groups.find((group: Group) => {
        if (group.customer && item.customer) {
          return group.customer.isEqual(item.customer);
        }
        return group.customer === item.customer;
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
  async function importItem(arg: { data: any }) {
    const { data } = arg;
    if (!data) throw new Error();
    const service = new Service(data).toData();
    const content = (await ServiceRequest.import(service)).optObjectContent();
    const inputItem = new Service(content);
    return list.value.addItem(inputItem);
  }
  async function addItem(arg: { data: any }) {
    const { data } = arg;
    if (!data) return null;
    if (!data) throw new Error('invalid data');

    const content = (await ServiceRequest.add(data)).optObjectContent();
    const inputItem = new Service(content);
    return list.value.addItem(inputItem);
  }
  async function removeItemOfId(arg: { id: string }) {
    const { id } = arg;
    (await ServiceRequest.remove(id)).getContent();
    return list.value.removeItemById(id);
  }

  async function updateStateOfId(arg: { serviceID: string; state: ServiceStateId }) {
    const { serviceID, state } = arg;

    (await ServiceRequest.updateState(serviceID, state)).getContent();
    return list.value.updateItemById(serviceID, (item) => {
      if (!item) return;
      item.state = state;
    });
  }
  async function updateDescriptionOfId(arg: { serviceID: string; description: string }) {
    const { serviceID, description } = arg;

    const api = await ServiceRequest.updateDescription(serviceID, description);
    api.getContent();
    return list.value.updateItemById(serviceID, (item) => {
      if (!item) return;
      item.description = description;
    });
  }
  async function updateBelongingsOfId(arg: { serviceID: string; belongings: any[] }) {
    const { serviceID, belongings } = arg;
    const api = await ServiceRequest.updateBelongings(serviceID, belongings);
    const content = api.optObjectContent();
    const inputItem = new Service(content);
    return list.value.updateItemById(inputItem.id, (item) => {
      if (!item) return inputItem;
      item.belongings = inputItem.belongings;
    });
  }

  async function updateCustomerOfId(arg: { serviceID: string; customer: any }) {
    const { serviceID, customer } = arg;
    const api = await ServiceRequest.updateCustomer(serviceID, customer);
    const content = api.optObjectContent();
    const inputItem = new Service(content);
    return list.value.updateItemById(inputItem.id, (item) => {
      if (!item) return inputItem;
      item.customer = inputItem.customer;
    });
  }
  async function addEventToId(arg: { serviceID: string; data: any }) {
    const { serviceID: id, data: eventData } = arg;
    if (!id || !eventData) return null;

    const api = await ServiceRequest.addEvent(id, eventData);
    const content = api.optObjectContent();
    const inputItem = new Service(content);
    return list.value.updateItemById(inputItem.id, (item) => {
      if (!item) return inputItem;
      item.events = inputItem.events.sort((event1, event2) => {
        return event2.compare(event1);
      });
    });
  }

  async function addEventImage(arg: {
    serviceID: string;
    eventTime: number;
    imageFiles: FileList | null;
  }) {
    const { serviceID = '', eventTime = 0, imageFiles = [] } = arg;

    const formData = new FormData();
    if (imageFiles instanceof FileList) {
      for (const imageFile of imageFiles) {
        formData.append(imageFile.name, imageFile);
      }
    }

    const api = await ServiceRequest.addEventImage(serviceID, eventTime, formData);
    const content = api.optObjectContent();

    const id: string = content.id;
    const inputEventTime: number = content.eventTime;
    const dataImages: any[] = content.items;

    return list.value.updateItemById(id, (item) => {
      if (!item) return;

      const event = item.events.find((event) => {
        return event.timestamp?.time === inputEventTime;
      });

      if (!event) return;

      dataImages
        .map((dataImage) => {
          return new ServiceImage(dataImage);
        })
        .forEach((image) => {
          const existingImage = event.images.find((eventImage) => {
            return image.name === eventImage.name;
          });

          if (!existingImage) event.images.push(image);
        });
    });
  }

  async function removeEventFromId(arg: { serviceID: string; time: number }) {
    const { serviceID, time } = arg;

    const api = await ServiceRequest.removeEvent(serviceID, time);
    api.getContent();
    return list.value.updateItemById(serviceID, (item) => {
      if (!item) return;
      item.events = item.events.filter((event: ServiceEvent) => {
        return event.timestamp?.time !== time;
      });
    });
  }
  async function updateEventDescription(arg: any) {
    const { serviceID, time, description } = arg;

    const api = await ServiceRequest.updateEventDescription(serviceID, time, description);
    const content = api.getContent();
    const { id: outputId, event } = content;
    const outputEvent = new ServiceEvent(event);
    return list.value.updateItemById(outputId, (item) => {
      if (!item) return;
      const foundEvent: ServiceEvent | undefined = item.events.find((event: ServiceEvent) => {
        return event.timestamp?.time === outputEvent.timestamp?.time;
      });
      if (foundEvent) {
        foundEvent.description = outputEvent.description;
      }
    });
  }
  async function updateUrgentOfId(arg: { serviceID: string; isUrgent: boolean }) {
    const label = URGENT.toData();
    if (arg.isUrgent) {
      return addLabelToId({ serviceID: arg.serviceID, label });
    } else {
      return removeLabelFromId({ serviceID: arg.serviceID, label });
    }
  }
  async function updateWarrantyOfId(arg: { serviceID: string; isWarranty: boolean }) {
    const label = WARRANTY.toData();
    if (arg.isWarranty) {
      return addLabelToId({ serviceID: arg.serviceID, label });
    } else {
      return removeLabelFromId({ serviceID: arg.serviceID, label });
    }
  }
  async function addLabelToId(arg: { serviceID: string; label: any }) {
    const { serviceID, label } = arg;
    const api = await ServiceRequest.addLabel(serviceID, label);
    const content = api.optObjectContent();
    const inputItem = new Service(content);
    return list.value.updateItemById(inputItem.id, (item) => {
      if (!item) return;
      if (label.title === 'Urgent') item.setUrgent(inputItem.isUrgent());
      if (label.title === 'Warranty') item.setWarranty(inputItem.isUrgent());
    });
  }
  async function removeLabelFromId(arg: { serviceID: string; label: any }) {
    const { serviceID, label } = arg;

    const api = await ServiceRequest.removeLabel(serviceID, label);
    const content = api.optObjectContent();
    const inputItem = new Service(content);
    return list.value.updateItemById(inputItem.id, (item) => {
      if (!item) return inputItem;
      item.setLabels(inputItem.labels);
    });
  }
  async function addImageTemp(imageFiles: any[]) {
    const formData = new FormData();
    for (const imageFile of imageFiles) {
      formData.append(imageFile.name, imageFile);
    }

    const api = await ServiceRequest.addImageTemp(formData);
    return api.optArrayContent();
  }
  async function addImageToId(arg: { serviceID: string; imageFiles: FileList | null }) {
    const { serviceID, imageFiles } = arg;

    const formData = new FormData();
    if (imageFiles instanceof FileList) {
      for (const imageFile of imageFiles) {
        formData.append(imageFile.name, imageFile);
      }
    }

    const api = await ServiceRequest.addImage(serviceID, formData);
    const content = api.optObjectContent();
    const id = content.id;
    const dataImages: any[] = content.items;
    return list.value.updateItemById(id, (item) => {
      if (!item) return;
      dataImages
        .map((dataImage) => new ServiceImage(dataImage))
        .forEach((image) => {
          const existingImage = item.imageFiles.find((img) => {
            return img.name === image.name;
          });
          if (!existingImage) item.imageFiles.push(image);
        });
    });
  }
  async function removeImageFromId(arg: { serviceID: string; image: any }) {
    const { serviceID, image } = arg;

    (await ServiceRequest.removeImage(serviceID, image)).getContent();
    return list.value.updateItemById(serviceID, (item) => {
      if (!item) return;
      item.imageFiles = item.imageFiles.filter((imageFile) => {
        return imageFile.name !== image.name;
      });
    });
  }
  async function removeEventImage(arg: { serviceID: string; eventTime: number; image: any }) {
    const { serviceID = '', eventTime = 0, image } = arg;

    const api = await ServiceRequest.removeEventImage(serviceID, eventTime, image);
    const content = api.getContent();

    const id = content.id;
    const inputEventTime = content.eventTime;
    const inputImage = new ServiceImage(content.image);

    return list.value.updateItemById(id, (item) => {
      if (!item) return;
      const foundEvent = item.events.find((event) => {
        return event.timestamp?.time === inputEventTime;
      });

      if (!foundEvent) return;

      foundEvent.images = foundEvent.images.filter((image) => {
        return image.name !== inputImage.name;
      });
    });
  }
  async function socketNotify(data: any) {
    const { key, content } = data;

    if (key === Notify.ItemAdd) {
      const inputItem = new Service(content);
      list.value.addItem(inputItem);
    }
    if (key === Notify.ItemRemove) {
      const inputItem = new Service(content);
      list.value.removeItemByItem(inputItem);
    }
    if (key === Notify.ItemImageAdd) {
      const { id, images } = content;
      list.value.updateItemById(id, (item) => {
        if (!item) return;

        images
          .map((dataImage: any) => new ServiceImage(dataImage))
          .forEach((image: ServiceImage) => {
            const existingImage = item.imageFiles.find((img) => {
              return img.name === image.name;
            });
            if (!existingImage) item.imageFiles.push(image);
          });
      });
    }
    if (key === Notify.ItemImageRemove) {
      const { id, image } = content;
      list.value.updateItemById(id, (item) => {
        if (!item) return;

        item.imageFiles = item.imageFiles.filter((imageFile) => {
          return imageFile.name !== image.name;
        });
      });
    }
    if (key === Notify.ItemEventAdd) {
      const { id, event } = content;
      list.value.updateItemById(id, (item) => {
        if (!item) return;

        const inputEvent = new ServiceEvent(event);
        const found = item.events.find((itemEvent: ServiceEvent) => {
          if (itemEvent.timestamp && inputEvent.timestamp) {
            return itemEvent.timestamp.time === inputEvent.timestamp.time;
          }
          return itemEvent.timestamp === inputEvent.timestamp;
        });
        if (!found) {
          item.events.push(inputEvent);
          item.events.sort((event1, event2) => event1.compare(event2));
        }
      });
    }
    if (key === Notify.ItemEventRemove) {
      const { id, event } = content;
      list.value.updateItemById(id, (item) => {
        if (!item) return;

        const inputEvent = new ServiceEvent(event);
        const found = item.events.find((itemEvent) => {
          if (itemEvent.timestamp && inputEvent.timestamp) {
            return itemEvent.timestamp.time === inputEvent.timestamp.time;
          }
          return itemEvent.timestamp === inputEvent.timestamp;
        });
        if (found) item.events.splice(item.events.indexOf(found), 1);
      });
    }
    if (key === Notify.ItemEventImageAdd) {
      const { id, eventTime, items: dataImages, fail_count: _fail_count } = content;
      list.value.updateItemById(id, (item) => {
        if (!item) return;

        const event = item.events.find((event) => {
          return event.timestamp?.time === eventTime;
        });

        if (!event) return;

        dataImages
          .map((dataImage: any) => {
            return new ServiceImage(dataImage);
          })
          .forEach((image: ServiceImage) => {
            const existingImage = event.images.find((eventImage) => {
              return image.name === eventImage.name;
            });

            if (!existingImage) event.images.push(image);
          });
      });
      return;
    }
    if (key === Notify.ItemEventImageRemove) {
      const { id, eventTime, image: inputImage } = content;

      list.value.updateItemById(id, (item) => {
        if (!item) return;
        const foundEvent = item.events.find((event) => {
          return event.timestamp?.time === eventTime;
        });

        if (!foundEvent) return;

        foundEvent.images = foundEvent.images.filter((image) => {
          return image.name !== inputImage.name;
        });
      });
      return;
    }
    if (key === Notify.ItemEventDescriptionUpdate) {
    }
    if (key === Notify.ItemLabelAdd) {
      const { id, label } = content;
      list.value.updateItemById(id, (item) => {
        if (!item) return;
        if (label.title === 'Urgent') item.setUrgent(true);
        if (label.title === 'Warranty') item.setWarranty(true);
      });
    }
    if (key === Notify.ItemLabelRemove) {
      const { id, label } = content;
      list.value.updateItemById(id, (item) => {
        if (!item) return;
        if (label.title === 'Urgent') item.setUrgent(false);
        if (label.title === 'Warranty') item.setWarranty(false);
      });
    }
    if (key === Notify.ItemStateUpdate) {
      const { id, state } = content;
      list.value.updateItemById(id, (item) => {
        if (item) item.state = state;
      });
    }
    if (key === Notify.ItemDescriptionUpdate) {
      const { id, description } = content;
      list.value.updateItemById(id, (item) => {
        if (item) item.description = description;
      });
    }
    if (key === Notify.ItemBelongingsUpdate) {
      const { id, belongings: dataBelongings } = content;

      const belongings = dataBelongings.map((belonging: {}) => {
        return new ServiceBelonging(belonging);
      });
      list.value.updateItemById(id, (item) => {
        if (item) item.belongings = belongings;
      });
    }
    if (key === Notify.ItemCustomerUpdate) {
      const { id, customer } = content;
      list.value.updateItemById(id, (item) => {
        if (item) item.customer = new ServiceCustomer(customer);
      });
    }
  }

  return {
    isLoading: computed(() => processor.value.isLoading()),
    lastModified: computed(() => list.value.lastModified),
    items: computed(() => list.value.items),

    refresh,
    getItems,
    getItemOfId,
    getGroupsByCustomer,
    importItem,
    addItem,
    removeItemOfId,
    updateStateOfId,
    updateDescriptionOfId,
    updateBelongingsOfId,
    updateCustomerOfId,
    addEventToId,
    addEventImage,
    removeEventFromId,
    updateEventDescription,
    updateUrgentOfId,
    updateWarrantyOfId,
    addLabelToId,
    removeLabelFromId,
    addImageTemp,
    addImageToId,
    removeImageFromId,
    removeEventImage,
    socketNotify,
  };
});
