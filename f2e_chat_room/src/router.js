import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [{
    path: "/",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import( /* webpackChunkName: "about" */ "./views/About.vue")
  }, {
    path: "/features",
    name: "features",
    component: () =>
      import( /* webpackChunkName: "about" */ "./views/Features.vue")
  }, {
    path: "/settings",
    name: "settings",
    component: () =>
      import( /* webpackChunkName: "about" */ "./views/Settings.vue")
  }, {
    path: "/documentation",
    name: "documentation",
    component: () =>
      import( /* webpackChunkName: "about" */ "./views/Documentation.vue")
  }]
});