import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./routes/routes";
import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import "./style.css";

import App from "./App.vue";

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.use(router);

app.use(ToastPlugin);

app.mount("#app");
