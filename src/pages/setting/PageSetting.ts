import { optArray, optString } from "@/U";
import { useSettingStore } from "@/data-stores/setting.store";

export class SettingBuilderUI {
  key?: string;
  title?: string;
  type?: string;
  list?: SettingBuilderUI[];
  readonly?: boolean;

  setKey(key: string): this {
    this.key = key;
    return this;
  }
  setTitle(title: string): this {
    this.title = title;
    return this;
  }
  setType(type: string): this {
    this.type = type;
    return this;
  }
  setList(...list: SettingBuilderUI[]): this {
    this.list = list;
    return this;
  }
  setReadonly(readonly: boolean = false): this {
    this.readonly = readonly;
    return this;
  }
  build(): SettingUI {
    const setting = new SettingUI();
    setting.key = this.key;
    setting.title = this.title;
    setting.type = this.type;
    setting.readonly = this.readonly;

    if (Array.isArray(this.list)) {
      setting.list = this.list.map((subSettingBuilder) => {
        const subSetting = subSettingBuilder.build();
        subSetting.parent = setting;
        return subSetting;
      });
    }

    return setting;
  }
}

export class SettingUI {
  key?: string;
  title?: string;
  type?: string;
  list?: SettingUI[];
  readonly?: boolean;

  parent?: SettingUI;

  getKey(): string {
    return optString(this.key);
  }
  getTitle(): string {
    return optString(this.title);
  }
  getParentTitle(): string {
    return this.parent?.getTitle() ?? "";
  }

  getType(): string {
    return optString(this.type);
  }
  getList(): SettingUI[] {
    return optArray(this.list);
  }
  isReadonly(): boolean | undefined {
    return this.readonly;
  }

  findValue() {
    return useSettingStore().items.find((setting) => {
      return setting.key === this.key;
    });
  }
  async updateValue(value: string | boolean): Promise<void> {
    if (!this.getKey().length) return;

    const data = { key: this.getKey(), value };
    await useSettingStore().updateItem(data);
  }
}
