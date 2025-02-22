import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import { Icon } from "@iconify/vue";

import App from "./App.vue";
import router from "./router";
import store from "./stores";
const app = createApp(App);

import VueObserveVisibility from "vue3-observe-visibility";

app.use(createPinia());

import moment from "moment-timezone";
const momentPlugin = {
  install(app) {
    // Attach moment to Vue 3 global properties, to make it globally available.
    // https://vuejs.org/guide/reusability/plugins.html#writing-a-plugin
    app.config.globalProperties.$moment = moment;
  },
};

app.use(store).use(router).use(momentPlugin).use(VueObserveVisibility);
app.component("Icon", Icon);
app.mount("#app");
