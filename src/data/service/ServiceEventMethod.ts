const BLUE = "#0771d2";
const PURPLE = "#961d96";
const GREEN = "#258915";

export class ServiceEventMethod {
  key: string;
  title: string;
  primaryColor: string;

  constructor(key: string = "", title: string = "", primaryColor: string = "") {
    this.key = key;
    this.title = title;
    this.primaryColor = primaryColor;
  }
}

export const INITIAL = new ServiceEventMethod("initial", "Initial", BLUE);
export const INFO = new ServiceEventMethod("info", "Info", BLUE);
export const QUOTATION = new ServiceEventMethod(
  "quotation",
  "Quotation",
  PURPLE,
);
export const PURCHASE = new ServiceEventMethod("purchase", "Purchase", GREEN);
