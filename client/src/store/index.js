import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
// import pass from './modules/changePassword'
import test from './modules/test'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    test
  },
  strict: debug,
  plugins: [createPersistedState({
  storage: window.sessionStorage
  })]
})
