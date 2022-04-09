import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import snackbar from './snackbar';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem('user')),
  },
  getters: {},
  mutations: {
    updateUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    login(context, user) {
      return axios.post('http://localhost:8000/api/dashboard/auth/login', user);
    },
    logout({ state }) {
      return axios
        .post(
          'http://localhost:8000/api/dashboard/auth/logout',
          {},
          { headers: { Authorization: `Bearer ${state.user.token}` } },
        );
    },
  },
  modules: {
    snackbar,
  },
});
