import axios from 'axios';

let timer;

export default {
  state() {
    return {
      userId: null,
      token: null,
      didAutoLogout: false,
    };
  },
  mutations: {
    setUser(state, payload) {
      state.token = payload.token;
      state.userId = payload.userId;
      state.didAutoLogout = false;
    },
    setAutoLogout(state) {
      state.didAutoLogout = true;
    },
  },
  actions: {
    async authenticate({ commit, dispatch }, { url, credentials }) {
      try {
        const { data } = await axios.post(url, {
          ...credentials,
          returnSecureToken: true,
        });

        const expiresIn = +data.expiresIn * 1000;
        const expirationDate = new Date().getTime() + expiresIn;

        localStorage.setItem('token', data.idToken);
        localStorage.setItem('userId', data.localId);
        localStorage.setItem('tokenExpiration', expirationDate);

        timer = setTimeout(() => {
          dispatch('autoLogout');
        }, expiresIn);

        commit('setUser', {
          userId: data.localId,
          token: data.idToken,
        });
      } catch (error) {
        throw new Error(error || 'Failed to authenticate!');
      }
    },
    async signUp({ dispatch }, payload) {
      return dispatch('authenticate', {
        url: 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyACQAI-_kCK4ibJHYgnBYa5v_kAmpLsR9U',
        credentials: {
          ...payload,
        },
      });
    },
    async login({ dispatch }, payload) {
      return dispatch('authenticate', {
        url: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyACQAI-_kCK4ibJHYgnBYa5v_kAmpLsR9U',
        credentials: {
          ...payload,
        },
      });
    },
    logout({ commit }) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('tokenExpiration');

      clearTimeout(timer);

      commit('setUser', {
        token: null,
        userId: null,
      });
    },
    tryLogin({ commit, dispatch }) {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const tokenExpiration = localStorage.getItem('tokenExpiration');

      const expiresIn = +tokenExpiration - new Date().getTime();

      if (expiresIn < 0) {
        return;
      }

      timer = setTimeout(() => {
        dispatch('autoLogout');
      }, expiresIn);

      if (token && userId) {
        commit('setUser', {
          token,
          userId,
        });
      }
    },
    autoLogout({ commit, dispatch }) {
      dispatch('logout');
      commit('setAutoLogout');
    },
  },
  getters: {
    userId({ userId }) {
      return userId;
    },
    token({ token }) {
      return token;
    },
    isAuthenticated({ token }) {
      return !!token;
    },
    didAutoLogout({ didAutoLogout }) {
      return didAutoLogout;
    },
  },
};
