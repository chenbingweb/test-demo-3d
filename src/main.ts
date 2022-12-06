import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import VConsole from "vconsole";
import "vant/lib/index.css";
if (import.meta.env.MODE == "development") {
} else {
  // new VConsole();
}

createApp(App).mount("#app");
console.log(import.meta.env);
