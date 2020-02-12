import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/Login.vue'
import NotFound from '@/views/NotFound.vue'
import Dashboard from '@/views/Dashboard.vue'

import store from '@/store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})

// Set up global navigation guard
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.

    if (!store.getters['auth/isAuthenticated']) {
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }

  // Clear form errors on every page change
  store.commit('auth/clearFormErrors')
})

export default router
