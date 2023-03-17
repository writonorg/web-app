import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import TonConnect from "./plugins/TonConnect";
import axios from "axios";
import VueAxios from "vue-axios";

// Nucleo Icons
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";

import materialKit from "./material-kit";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(materialKit);
app.use(VueAxios, axios);
app.use(TonConnect);
app.mount("#app");
