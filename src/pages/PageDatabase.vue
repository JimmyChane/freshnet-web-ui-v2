<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import Loading from '@/components/loading/Loading.vue';
import Empty from '@/components/Empty.vue';
import NavigationBar from '@/components/actionbar/NavigationBar.vue';
import ItemDatabase from '@/page-components/database/ItemDatabase.vue';
import IconRefresh from '@/assets/icon/refresh-000000.svg';
import { useLoginStore } from '@/stores/login.store';
import { useDatabaseStore } from '@/data-stores/database.store';
import { useSnackbarStore } from '@/stores/snackbar/snackbar.store';

const loginStore = useLoginStore();
const databaseStore = useDatabaseStore();
const snackbarStore = useSnackbarStore();

const scrollTop = ref(0);

const isLoading = computed(() => loginStore.isLoading || databaseStore.isLoading);
const user = computed(() => loginStore.user);
const baseInfo = computed(() => databaseStore.baseInfo);
const databases = computed(() => databaseStore.items);

watch(() => user.value, actionRefresh);

function actionRefresh() {
  return Promise.resolve()
    .then(() => {
      if (user.value === null || !user.value.isTypeAdmin()) {
        throw new Error();
      }
      return databaseStore.loadBaseInfo();
    })
    .catch((error) => {
      snackbarStore.show('Error Loading Databases');
      throw error;
    });
}

onMounted(() => {
  loginStore
    .refresh()
    .then(() => {
      actionRefresh();
    })
    .catch((error) => {
      snackbarStore.show('Your login credential could be invalid');
      throw error;
    });
});
</script>

<template>
  <div
    class="PageDatabase"
    @scroll="(event) => (scrollTop = (event.target as HTMLDivElement).scrollTop)"
  >
    <NavigationBar
      style="z-index: 2"
      :title="$options.title"
      :rightMenus="[
        {
          key: 'refresh',
          title: 'Refresh',
          icon: IconRefresh,
          click: () => actionRefresh(),
        },
      ]"
    />

    <div class="PageDatabase-body" v-if="user && baseInfo && databases.length">
      <div class="PageDatabase-baseInfo">
        <span class="PageDatabase-title">Database Using Now</span>
        <span v-if="baseInfo">{{ baseInfo.currentDatabase }}</span>
      </div>

      <div>
        <span class="PageDatabase-title">Database</span>
        <ItemDatabase
          class="PageDatabase-database"
          v-for="database in databases"
          :key="database.name"
          :database="database"
        />
      </div>
    </div>

    <Empty v-if="!baseInfo && !databases.length && !isLoading" :icon="$options.icon.dark.toUrl()" />

    <Loading class="PageDatabase-loading" :isShowing="isLoading" />
  </div>
</template>

<style lang="scss" scoped>
//Abstract
.PageDatabase-title {
  font-weight: 600;
  font-size: 1.4rem;
  color: black;
}

.PageDatabase {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .PageDatabase-body {
    z-index: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 4rem;
    padding-bottom: 10rem;
    gap: 5rem;
    position: relative;

    & > * {
      width: 100%;
      max-width: 35rem;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;
    }

    .PageDatabase-baseInfo {
      font-size: 1rem;
    }
  }

  .PageDatabase-window {
    z-index: 3;
  }

  .PageDatabase-loading {
    position: absolute;
    z-index: 1;
    width: 100%;
  }
}
</style>
