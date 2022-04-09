export default {
  namespaced: true,
  state: {
    snackbar: {
      show: false,
      text: '',
      color: 'black',
    },
  },
  getters: {},
  mutations: {
    updateSnackbar(state, snackbar) {
      state.snackbar = snackbar;
    },
  },
  actions: {
    success({ commit }, text) {
      commit('updateSnackbar', {
        show: true,
        text,
        color: '#2a6e2d',
      });
    },
    error({ commit }, text) {
      commit('updateSnackbar', {
        show: true,
        text,
        color: '#d42f23',
      });
    },
  },
};
