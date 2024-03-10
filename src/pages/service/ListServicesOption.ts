import { Mode } from "./item-service/ItemServiceMode";

export enum SortMode {
  DateCreated = 1,
  Name = 2,
  PhoneNumber = 3,
  Price = 4,
}
export enum GroupMode {
  None = 0,
  DateCreated = 1,
}
export const LayoutMode = Mode;
