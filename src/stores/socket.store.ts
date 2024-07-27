import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useServiceStore } from '@/data-stores/service.store';
import socketIo, { Socket } from 'socket.io-client';
import { getOriginApi } from '@/data/Server';
import { useLoginStore } from './login.store';

export const useSocketStore = defineStore('socket', () => {
  const socket = ref<Socket>();
  const isConnected = computed(() => socket.value?.connected);
  function notify(body: { manager: string; key: string; content: any }) {
    const { manager, key, content } = body;
    switch (manager) {
      case 'service':
        useServiceStore().socketNotify({ key, content });
        break;
    }
  }
  function open() {
    if (isConnected.value) return;

    const option: Record<string, any> = {
      extraHeaders: {
        authorization: window.localStorage.getItem('userToken'),
      },
    };
    const xSocket = socketIo(getOriginApi(), option)
      .on('connect', () => console.info('Socket', 'Connected'))
      .on('connect_error', () => console.info('Socket', 'Connect Error'))
      .on('disconnect', (reason) => console.info('Socket', 'Disconnected'))
      .on('notify', (body) => notify(body));
    socket.value = xSocket;
  }
  function close() {
    if (!isConnected.value || !socket.value) return;

    const xSocket = socket.value;
    socket.value = undefined;
    xSocket.close();
  }
  function restart() {
    close();
    open();
  }

  watch(() => useLoginStore().user, onUser);
  async function onUser() {
    const user = await useLoginStore().getUser();

    if (user.isTypeAdmin() || user.isTypeStaff()) {
      open();
    } else {
      close();
    }
  }
  onUser();

  return {
    isConnected,
    notify,
    open,
    close,
    restart,
  };
});
