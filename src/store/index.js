import Vue from 'vue'
import Vuex from 'vuex'
import User from './modules/user';
import createPersistedstate from 'vuex-persistedstate';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    User
  },
  plugins: [
    createPersistedstate({
      key: 'UCD_Parcel',
      paths: ['User']
    })
  ]
})
