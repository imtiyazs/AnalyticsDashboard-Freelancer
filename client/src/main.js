// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'core-js/es6/promise'
import 'core-js/es6/string'
import 'core-js/es7/array'
// import cssVars from 'css-vars-ponyfill'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Toaster from 'v-toaster'
import 'v-toaster/dist/v-toaster.css'
import Vuex from 'vuex'
import store from './store/index.js'

axios.defaults.baseURL = 'http://localhost:8080/server/'

Vue.use(Vuex)
Vue.use(BootstrapVue)
Vue.use(Toaster, {
  timeout: 3000
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
    store,
  template: '<App/>',
  components: {
    App
  }
})
