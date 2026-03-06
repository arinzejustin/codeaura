import { createApp } from "vue";
import { createPinia } from "pinia";
import { createHead } from "@unhead/vue/client";
import Root from "./Root.vue";
import router from "./router";
import { preloadAllFonts } from "./data/fonts";
import "./style.css";
import "vue-sonner/style.css";

preloadAllFonts();

const app = createApp(Root);
const pinia = createPinia();
const head = createHead();

app.use(pinia);
app.use(router);
app.use(head);
app.mount("#app");
