import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import firebase from './firebaseConfig'

Vue.config.productionTip = false;

// handle page reloads
let app
firebase.auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App)
    })
  }
})