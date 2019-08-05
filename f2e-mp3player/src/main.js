import Vue from "vue";
import App from "./App.vue";
import store from "./store";

Vue.config.productionTip = false;

import SongCard from "./components/SongCard.vue";
import AudioControls from "./components/AudioControls.vue";
import ControlBar from "./components/ControlBar.vue";
import SearchLog from "./components/SearchLog.vue";

Vue.component("SongCard", SongCard);
Vue.component("AudioControls", AudioControls);
Vue.component("ControlBar", ControlBar);
Vue.component("SearchLog", SearchLog);

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
