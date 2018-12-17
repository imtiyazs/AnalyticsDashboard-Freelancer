// import * as types from '../mutation-types'
// import axios from 'axios'
// import router from '../../router'
// import Vue from 'vue'
// initial state
// shape: [{ id, quantity }]
const state = {
  user: {
  }
}

// getters
const getters = {
  // getters

  
}

const mutations = {
    setUserData(state,data) {
        console.log('data:', data)
        state.user = data
    }
}

const actions = {
    setUserData(context, data) {
        console.log('data1:', data)
        context.commit('setUserData', data)
    }
}

export default {
  state,
  getters,
  mutations,
  actions
}
