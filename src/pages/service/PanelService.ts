import ServiceEvent, { ServiceEventData } from "@/data/service/ServiceEvent";
import ServiceImage from "@/data/service/ServiceImage";
import ServiceCustomer from "@/data/service/ServiceCustomer";
import ServiceBelonging from "@/data/service/ServiceBelonging";
import Service from "@/data/service/Service";

export interface Action {
  onClickClose: () => void;
  onClickRemove: (service: Service) => void;
  onClickToAddEvent: (event: ServiceEventData) => void;
  onClickRemoveEvent: (extra: {
    service?: Service;
    event: ServiceEvent;
  }) => void;
  onClickRemoveImage: (image: ServiceImage) => void;
  onClickUpdateCustomer: (customer: ServiceCustomer) => void;
  onClickUpdateDescription: (description: string) => void;
  onClickUpdateBelongings: (belongings: ServiceBelonging[]) => void;
}
