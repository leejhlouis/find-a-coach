import axios from 'axios';

export default {
  namespaced: true,
  state() {
    return {
      lastFetch: null,
      coaches: [
        {
          id: 'c1',
          firstName: 'Maximilian',
          lastName: 'Schwarzmüller',
          areas: ['frontend', 'backend', 'career'],
          description:
            "I'm Maximilian and I've worked as a freelance web developer for years. Let me help you become a developer as well!",
          hourlyRate: 30,
        },
        {
          id: 'c2',
          firstName: 'Julie',
          lastName: 'Jones',
          areas: ['frontend', 'career'],
          description:
            'I am Julie and as a senior developer in a big tech company, I can help you get your first job or progress in your current role.',
          hourlyRate: 30,
        },
      ],
    };
  },
  mutations: {
    addCoach(state, payload) {
      state.coaches.push(payload);
    },
    setCoaches(state, payload) {
      state.coaches = payload;
    },
    setFetchTimestamp(state) {
      state.lastFetch = new Date().getTime();
    },
  },
  actions: {
    async addCoach({ rootGetters, commit }, payload) {
      const userId = rootGetters.userId;

      try {
        await axios.put(
          `https://find-a-coach-355c2-default-rtdb.firebaseio.com/coaches/${userId}.json`,
          payload
        );

        commit('addCoach', {
          ...payload,
          id: userId,
        });
      } catch (error) {
        throw new Error(error || 'Failed to submit!');
      }
    },
    async loadCoaches({ getters, commit }, payload) {
      if (!payload.forceRefresh && !getters.shouldUpdate) {
        console.warn('gdfd');
        return;
      }

      try {
        const { data } = await axios.get(
          `https://find-a-coach-355c2-default-rtdb.firebaseio.com/coaches.json`
        );
        const coaches = [];

        for (const key in data) {
          const coach = {
            id: key,
            firstName: data[key].firstName,
            lastName: data[key].lastName,
            description: data[key].description,
            hourlyRate: data[key].hourlyRate,
            areas: data[key].areas,
          };

          coaches.push(coach);
        }

        commit('setCoaches', coaches);
        commit('setFetchTimestamp');
      } catch (error) {
        throw new Error(error || 'Failed to fetch!');
      }
    },
  },
  getters: {
    coaches({ coaches }) {
      return coaches;
    },
    hasCoaches({ coaches }) {
      return coaches && coaches.length > 0;
    },
    isCoach(_, { coaches }, _2, { userId }) {
      return coaches.some((coach) => coach.id === userId);
    },
    shouldUpdate({ lastFetch }) {
      return !lastFetch || (new Date().getTime() - lastFetch) / 1000 > 60;
    },
  },
};
