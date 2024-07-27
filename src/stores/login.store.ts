import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { Processor } from '@/utils/Processor';
import { LoginRequest } from '@/data/Login';
import { User, UserType } from '@/data/User';

const storageTokenKey = 'userToken';
function getToken() {
  return window.localStorage.getItem(storageTokenKey);
}
function setToken(token: string) {
  return window.localStorage.setItem(storageTokenKey, token);
}
function deleteToken() {
  return window.localStorage.removeItem(storageTokenKey);
}

export const useLoginStore = defineStore('login', () => {
  const userNone = new User({
    username: '',
    name: '',
    userType: UserType.None,
  });

  const lastModified = ref(Date.now());
  const user = ref(userNone);
  const loader = ref(new Processor());

  function onNewCredentail(arg: { token: string; user: User }) {
    const { token, user: userData } = arg;
    const newUser = new User(userData);
    setToken(token);

    user.value = newUser;
    lastModified.value = Date.now();

    return newUser;
  }

  async function refresh() {
    return loader.value.acquire('refresh', async () => {
      await getUser();
    });
  }
  async function login(arg: { username: string; password: string }) {
    return loader.value.acquire('login', async () => {
      try {
        deleteToken();
        const api = await LoginRequest.login({
          username: arg.username,
          password: arg.password,
        });
        const content = api.getObjectContent();
        const { token, user } = content;
        const newUser = onNewCredentail({ token, user });
        return newUser;
      } catch (error) {
        deleteToken();
        user.value = userNone;
        lastModified.value = Date.now();
        throw error;
      }
    });
  }
  async function logout() {
    return loader.value.acquire('logout', async () => {
      try {
        deleteToken();
        user.value = userNone;
        lastModified.value = Date.now();
        return user.value;
      } catch (error) {
        deleteToken();
        user.value = userNone;
        lastModified.value = Date.now();
        throw error;
      }
    });
  }
  async function getUser() {
    return loader.value.acquire('getUser', async () => {
      try {
        const token = getToken();
        if (!token) {
          if (user.value !== userNone) {
            user.value = userNone;
            lastModified.value = Date.now();
          }
          deleteToken();
          return user.value;
        }

        const api = await LoginRequest.user(token);
        const content = api.optObjectContent();
        const xUser = new User(content.user);

        const userNow = user.value;
        if (userNow) {
          const isUsernameSame = userNow.username === xUser.username;
          const isNameSame = userNow.name === xUser.name;
          const isUserTypeSame = userNow.userType === xUser.userType;
          if (isUsernameSame && isNameSame && isUserTypeSame) {
            return userNow;
          }
        }

        setToken(token);
        user.value = xUser;
        lastModified.value = Date.now();

        return xUser;
      } catch (error: any) {
        if (error.message === 'not signed in') {
          if (user.value !== userNone) {
            user.value = userNone;
            lastModified.value = Date.now();
          }
          deleteToken();
          return user.value;
        }
        throw error;
      }
    });
  }
  async function changePassword(arg: { passwordVerify: string; passwordNew: string }) {
    return loader.value.acquire('changePassword', async () => {
      if (!user.value?.username) {
        throw new Error('cannot find username with current user');
      }
      const username = user.value.username;
      const { passwordVerify, passwordNew } = arg;
      const api = await LoginRequest.updatePassword(username, passwordVerify, passwordNew);
      const { token } = api.optObjectContent();
      const outputUser = onNewCredentail({ token, user: user.value });

      return outputUser;
    });
  }

  return {
    lastModified: computed(() => lastModified.value),
    isLoading: computed(() => loader.value.isLoading()),
    user: computed(() => user.value),
    token: computed(() => getToken()),

    refresh,
    login,
    logout,
    getUser,
    changePassword,
  };
});
