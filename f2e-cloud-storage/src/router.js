import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login.vue';

import firebase from '@/firebaseConfig.js'

Vue.use(Router);

const router =
  new Router({
    routes: [{
        path: '/',
        name: 'Login',
        component: Login,
      },
      {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ './views/About.vue'),
      },
      {
        path: '/storage',
        name: 'storage',
        meta: {
          requiresAuth: true
        },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ './views/Storage.vue'),
      }
    ],
  });

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const currentUser = firebase.auth().currentUser;
  if (requiresAuth && !currentUser) {
    next('/')
  } else if (requiresAuth && currentUser) {
    next()
  } else {
    next()
  }
})

export default router
