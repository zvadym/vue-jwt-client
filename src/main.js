import Vue from 'vue'
import App from './App.vue'
import Icon from 'vue-awesome/components/Icon.vue'

import router from '@/router'
import store from '@/store'

// Register third-party plugins
Vue.component('icon', Icon)

Vue.config.productionTip = false

// Attempt to read credentials from local storage
store.dispatch('auth/tryAutoLogin')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
