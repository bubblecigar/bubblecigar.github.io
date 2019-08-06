import Vue from "vue";
import App from "./App.vue";
import store from "./store";

Vue.config.productionTip = false;

import SongCard from "./components/SongCard.vue";
import AudioControls from "./components/AudioControls.vue";
import ControlBar from "./components/ControlBar.vue";
import SearchLog from "./components/SearchLog.vue";
import Button_Big from "./components/Button_Big.vue";
import Button_Medium from "./components/Button_Medium.vue";
import Button_Small from "./components/Button_Small.vue";
import Button_Cloud from "./components/Button_Cloud.vue";

Vue.component("SongCard", SongCard);
Vue.component("AudioControls", AudioControls);
Vue.component("ControlBar", ControlBar);
Vue.component("SearchLog", SearchLog);
Vue.component("Button_Big", Button_Big);
Vue.component("Button_Medium", Button_Medium);
Vue.component("Button_Small", Button_Small);
Vue.component("Button_Cloud", Button_Cloud);

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
