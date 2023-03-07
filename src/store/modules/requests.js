import axios from 'axios';

export default {
  namespaced: true,
  state() {
    return {
      requests: [],
    };
  },
  mutations: {
    addRequest(state, payload) {
      state.requests.push(payload);
    },
    setRequests(state, payload) {
      state.requests = payload;
    },
  },
  actions: {
    async contactCoach({ commit }, payload) {
      try {
        const { data } = await axios.post(
          `https://find-a-coach-355c2-default-rtdb.firebaseio.com/requests/${payload.coachId}.json`,
          payload
        );

        commit('addRequest', {
          id: data.name,
          ...payload,
        });
      } catch (error) {
        throw new Error(error || 'Failed to submit!');
      }
    },
    async loadRequests({ rootGetters, commit }) {
      const coachId = rootGetters.userId;
      const authToken = rootGetters.token;

      try {
        const { data } = await axios.get(
          `https://find-a-coach-355c2-default-rtdb.firebaseio.com/requests/${coachId}.json?auth=${authToken}`
        );

        const requests = [];

        for (const key in data) {
          const request = {
            id: key,
            coachId: coachId,
            email: data[key].email,
            message: data[key].message,
          };

          requests.push(request);
        }

        commit('setRequests', requests);
      } catch (error) {
        throw new Error(error || 'Failed to fetch!');
      }
    },
  },
  getters: {
    requests({ requests }, _, _2, { userId }) {
      return requests.filter((req) => req.coachId === userId);
    },
    hasRequests(_, { requests }) {
      return requests && requests.length > 0;
    },
  },
};
