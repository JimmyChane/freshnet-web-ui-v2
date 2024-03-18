import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { UserRequest } from "@/data/user/UserRequest";
import { DataLoader } from "./tools/DataLoader";
import { Processor } from "@/stores/tools/Processor";
import { List } from "./tools/List";
import { User } from "@/data/user/User";
import { useLoginStore } from "@/stores/login.store";

export const useUserStore = defineStore("user", () => {
  const dataLoader = new DataLoader<User>(1000 * 60 * 10) // 10min
    .processor(() => processor.value as Processor | undefined)
    .setData((data) => list.value.clear().addItems(data))
    .getData(() => list.value.items)
    .loadData(async () => {
      const user = await useLoginStore().getUser();
      if (!user.isTypeAdmin() && !user.isTypeStaff()) throw new Error();

      const api = await UserRequest.list();
      const content: any[] = api.optArrayContent();
      return content.map((data) => new User(data));
    });

  const processor = ref(new Processor());
  const list = ref(new List<User>());

  async function refresh() {
    dataLoader.doTimeout();
    await getUsers();
  }
  async function getUsers() {
    return await dataLoader.data();
  }
  async function getUserByUsername(username: string) {
    const users: User[] = await getUsers();
    return users.find((user) => user.username === username);
  }
  async function updateTypeOfUserByUsername(arg: {
    username: string;
    userType: string;
  }) {
    try {
      const user = await useLoginStore().getUser();

      if (!user.isTypeAdmin()) throw new Error();

      const { username, userType } = arg;
      const api = await UserRequest.update(username, userType);
      const content = api.optObjectContent();
      const userChange = new User(content);
      if (!userChange) throw new Error();
      list.value.updateItemById(userChange.username, (item) => {
        return userChange;
      });

      return userChange;
    } catch (error) {
      list.value.clear();
      throw error;
    }
  }
  async function addUser(arg: {
    username: string;
    name: string;
    passwordNew: string;
    passwordRepeat: string;
  }) {
    const user: User = await useLoginStore().getUser();

    if (!user.isTypeAdmin()) throw new Error();

    const api = await UserRequest.add(
      arg.username,
      arg.name,
      arg.passwordNew,
      arg.passwordRepeat,
    );
    const content = api.getObjectContent();
    const newUser = new User(content);
    list.value.addItem(newUser);
    return newUser;
  }
  async function removeUserByUsername(arg: { username: string }) {
    const user = await useLoginStore().getUser();

    if (!user.isTypeAdmin()) throw new Error();

    const api = await UserRequest.remove(arg.username);
    const content = api.getStringContent();
    if (content !== "ok") throw new Error();
    list.value.removeItemById(arg.username);
    return true;
  }

  return {
    isLoading: computed(() => processor.value.isLoading()),
    lastModified: computed(() => list.value.lastModified),
    items: computed(() => list.value.items),

    refresh,
    getUsers,
    getUserByUsername,
    updateTypeOfUserByUsername,
    addUser,
    removeUserByUsername,
  };
});
