<script setup lang="ts">
  import type { Product } from "@/data/product/Product";
  import ButtonContact from "./BottomActionbar-ButtonContact.vue";
  import ButtonTop from "./BottomActionbar-ButtonTop.vue";
  import { Setting } from "@/data/setting/Setting";
  import { onMounted, ref, watch } from "vue";
  import { useSettingStore } from "@/data-stores/setting.store";
  import type { Contact } from "@/data/contact/Contact";

  const props = withDefaults(
    defineProps<{
      product?: Product;
      isWide?: boolean;
      parentScrollTop?: number;
    }>(),
    {
      isWide: false,
      parentScrollTop: 0,
    },
  );

  const whatsappLink = ref("");

  const callTypeTitle = ref("");
  const callTitle = ref("");
  const callHref = ref("");
  const callTarget = ref("");
  const callIcon = ref("");

  const whatsappTypeTitle = ref("");
  const whatsappTitle = ref("");
  const whatsappHref = ref("");
  const whatsappTarget = ref("");
  const whatsappIcon = ref("");

  watch(() => useSettingStore().lastModified, invalidate);
  watch(() => props.product, invalidate);

  async function invalidate() {
    const contacts: Contact[] = await useSettingStore().findValueOfKey({
      key: Setting.Key.Contacts,
      default: [],
    });
    const contact = findContactByTitle(contacts, "Beh Aik Keong");

    const contactCall = contact?.links.find(
      (link) => link.socialMedia?.title === "Call",
    );
    const contactWhatsapp = contact?.links.find(
      (link) => link.socialMedia?.title === "Whatsapp",
    );

    callTypeTitle.value = contactCall?.socialMedia?.title ?? "";
    callTitle.value = contact?.title ?? "";
    callHref.value = contactCall?.toHtmlHref() ?? "";
    callTarget.value = contactCall?.toHtmlTarget() ?? "";
    callIcon.value = contactCall?.socialMedia?.icon ?? "";
    whatsappTypeTitle.value = contactWhatsapp?.socialMedia?.title ?? "";
    whatsappTitle.value = contact?.title ?? "";
    whatsappTarget.value = contactWhatsapp?.toHtmlTarget() ?? "";
    whatsappIcon.value = contactWhatsapp?.socialMedia?.icon ?? "";

    const xWhatsappHref = contactWhatsapp?.toHtmlHref() ?? "";

    const xProduct = props.product;
    if (!xProduct) {
      whatsappHref.value = xWhatsappHref;
      return;
    }

    const productLink = props.product?.getLink();
    const title = await xProduct.fetchFullTitle();

    let text = `Hi, I am interested in this product`;
    if (title) text += `\n\n${title}`;
    if (productLink) text += `\n${productLink}`;
    const textUri = encodeURIComponent(text);

    whatsappHref.value = `${xWhatsappHref}&text=${textUri}`;
  }

  function findContactByTitle(contacts: Contact[], title: string) {
    return contacts.find((contact) => contact.title === title);
  }

  onMounted(() => invalidate());
</script>

<template>
  <div
    class="ViewerProduct-BottomActionbar"
    :isButtonTopHidden="parentScrollTop <= 10"
  >
    <ButtonContact
      class="ViewerProduct-BottomActionbar-whatsapp"
      :target="whatsappTarget"
      :href="whatsappHref"
      :icon="whatsappIcon"
      :titleHeader="whatsappTypeTitle"
      :titleContent="whatsappTitle"
      primaryColorHex="#4caf50"
      :toShrink="true"
    />
    <ButtonContact
      class="ViewerProduct-BottomActionbar-call"
      :target="callTarget"
      :href="callHref"
      :icon="callIcon"
      :titleHeader="callTypeTitle"
      :titleContent="callTitle"
      primaryColorHex="#2196f3"
      :toShrink="true"
    />
    <ButtonTop
      :isHidden="parentScrollTop <= 10"
      @click="() => $emit('click-scrollToTop')"
    />
  </div>
</template>

<style lang="scss" scoped>
  .ViewerProduct-BottomActionbar {
    position: sticky;
    bottom: 0;
    width: 100%;
    gap: 0.3rem;

    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-end;
    padding: 1rem;
  }
  .ViewerProduct-BottomActionbar[isButtonTopHidden="true"] {
    .ViewerProduct-BottomActionbar-whatsapp {
      transform: translateX(4.3rem);
    }
    .ViewerProduct-BottomActionbar-call {
      transform: translateX(4.3rem);
    }
  }
</style>
