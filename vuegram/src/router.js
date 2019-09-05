import Vue from "vue";
import Router from "vue-router";
import firebase from './firebaseConfig'

import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import Settings from '@/views/Settings.vue'

Vue.use(Router);

const router = new Router({
  routes: [{
      path: "/",
      name: "home",
      component: Home
    }, {
      path: "*",
      redirect: '/',
      name: "default"
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import( /* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {

  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const currentUser = firebase.auth.currentUser;

  if (requiresAuth && !currentUser) {
    next('/login')
  } else if (requiresAuth && currentUser) {
    next()
  } else {
    next()
  }
})

export default router