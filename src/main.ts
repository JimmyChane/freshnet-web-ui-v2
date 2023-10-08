import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./app/App.vue";
import router from "@/routers/index";
import Mixin from "@/mixins/index";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mixin(Mixin);
app.use(router);
app.mount("#app");
