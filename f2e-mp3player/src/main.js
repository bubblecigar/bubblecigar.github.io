import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

import SongCard from "./components/SongCard.vue";
import AudioControls from "./components/AudioControls.vue";
import ControlBar from './components/ControlBar.vue';

Vue.component("SongCard", SongCard);
Vue.component("AudioControls", AudioControls);
Vue.component("ControlBar", ControlBar);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");