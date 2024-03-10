<script setup lang="ts">
  import NavigationBar from "@/components/actionbar/NavigationBar.vue";
  import Empty from "@/components/Empty.vue";
  import ItemSetting from "./ItemSetting.vue";
  import ItemSettingContacts from "./ItemSettingContacts.vue";
  import ItemSettingBusinessHours from "./ItemSettingBusinessHours.vue";
  import SettingModule from "@/data/setting/Setting";

  import { computed, onMounted } from "vue";

  import IconRefresh from "@/assets/icon/refresh-000000.svg";
  import { useUserStore } from "@/data-stores/user.store";
  import { SettingBuilderUI } from "./PageSetting";

  const isLoading = computed(() => useUserStore().isLoading);
  const isEmpty = computed(() => !useUserStore().items.length);

  function refresh() {
    useUserStore().refresh();
  }

  onMounted(() => refresh());
</script>

<template>
  <div class="PageSetting">
    <NavigationBar
      :title="$options.title"
      :rightMenus="[
        {
          key: 'refresh',
          title: 'Refresh',
          icon: IconRefresh,
          click: () => refresh(),
        },
      ]"
    />

    <div class="PageSetting-body">
      <ItemSetting
        :item="
          new SettingBuilderUI()
            .setTitle('Company (Readonly)')
            .setReadonly(true)
            .setList(
              new SettingBuilderUI()
                .setKey(SettingModule.Key.CompanyName)
                .setReadonly(true)
                .setTitle('Name')
                .setType('text'),
              new SettingBuilderUI()
                .setKey(SettingModule.Key.CompanyCategory)
                .setReadonly(true)
                .setTitle('Category')
                .setType('text'),
            )
            .build()
        "
      />
      <ItemSetting
        :item="
          new SettingBuilderUI()
            .setTitle('Location')
            .setList(
              new SettingBuilderUI()
                .setKey(SettingModule.Key.Location)
                .setTitle('Address')
                .setType('text'),
              new SettingBuilderUI()
                .setKey(SettingModule.Key.LocationLink)
                .setTitle('Link')
                .setType('text'),
            )
            .build()
        "
      />
      <ItemSettingContacts />
      <ItemSettingBusinessHours />
      <ItemSetting
        :item="
          new SettingBuilderUI()
            .setTitle('Product Page')
            .setList(
              new SettingBuilderUI()
                .setKey(SettingModule.Key.PublicShowPrice)
                .setTitle('Show Price in View Mode')
                .setType('boolean'),
            )
            .build()
        "
      />
    </div>

    <Empty v-if="isEmpty && !isLoading" :icon="$options.icon.dark.toUrl()" />
  </div>
</template>

<style lang="scss" scoped>
  .PageSetting {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    .PageSetting-body {
      width: 100%;
      max-width: 25rem;
      margin: 0 auto;
      padding: 1.8rem;
      padding-bottom: 8rem;
      gap: 0.8rem;

      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
    }
  }
</style>
@/stores/data-stores/user.store