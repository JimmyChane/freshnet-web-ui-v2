import { useSnackbarStore } from './snackbar.store';
import { TimeNowGetter } from '@/data/TimeNowGetter';
const keyGetter = new TimeNowGetter();

export interface SnackbarAction {
  key: string;
  title: string;
  click: () => void;
}

export interface SnackbarOption {
  text?: string;
  isLoading?: boolean;
  icon?: string;
  actions?: SnackbarAction[];
}

export class Snackbar {
  key: number;
  isShowing: boolean = false;

  icon: string | undefined;
  text: string | undefined;
  isLoading: boolean | undefined;
  actions: SnackbarAction[] | undefined;

  constructor(option: SnackbarOption) {
    this.key = keyGetter.get();

    this.icon = option.icon;
    this.isLoading = option.isLoading;
    this.text = option.text;
    this.actions = option.actions;
  }

  get index(): number {
    return useSnackbarStore().items.indexOf(this);
  }

  show(timeout: number = 3000): this {
    setTimeout(() => (this.isShowing = true), 80);
    setTimeout(() => this.hide(), timeout);
    return this;
  }

  hide(): this {
    this.isShowing = false;

    setTimeout(() => {
      const index = useSnackbarStore().items.indexOf(this);
      useSnackbarStore().items.splice(index, 1);
    }, 80);

    return this;
  }
}
