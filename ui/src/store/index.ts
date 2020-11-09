import Vue from 'vue'
import Vuex from 'vuex'
import userModule from './modules/user';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    userModule
  },
});
