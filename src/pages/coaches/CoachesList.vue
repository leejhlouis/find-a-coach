<template>
  <div>
    <BaseDialog :show="!!error" title="An error occured!" @close="handleError">
      <p>{{ error }}</p>
    </BaseDialog>
    <section>
      <CoachFilter @change-filter="filter" />
    </section>
    <section>
      <BaseCard>
        <div class="controls">
          <BaseButton mode="outline" @click="loadCoaches(true)"
            >Refresh</BaseButton
          >
          <BaseButton v-if="!isAuthenticated" link to="/auth?redirect=register"
            >Login to Register as Coach</BaseButton
          >
          <BaseButton v-else-if="!isCoach && !isLoading" link to="/register"
            >Register as Coach</BaseButton
          >
        </div>
        <div v-if="isLoading">
          <BaseSpinner />
        </div>
        <ul v-else-if="hasCoaches">
          <CoachItem v-for="coach in filteredCoaches" :="coach" :key="coach.id">
            {{ coach.firstName }}
          </CoachItem>
        </ul>
        <h3 v-else>No coaches found.</h3>
      </BaseCard>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CoachItem from '../../components/coaches/CoachItem.vue';
import CoachFilter from '../../components/coaches/CoachFilter.vue';

export default {
  components: {
    CoachItem,
    CoachFilter,
  },
  data() {
    return {
      isLoading: false,
      error: null,
      filters: {
        frontend: true,
        backend: true,
        career: true,
      },
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
    ...mapGetters('coaches', ['coaches', 'hasCoaches', 'isCoach']),
    filteredCoaches() {
      return this.coaches.filter((coach) => {
        if (this.filters.frontend && coach.areas.includes('frontend')) {
          return true;
        } else if (this.filters.backend && coach.areas.includes('backend')) {
          return true;
        } else if (this.filters.career && coach.areas.includes('career')) {
          return true;
        }

        return false;
      });
    },
  },
  created() {
    this.loadCoaches();
  },
  methods: {
    filter(updated) {
      this.filters = updated;
    },
    async loadCoaches(forceRefresh = false) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('coaches/loadCoaches', {
          forceRefresh,
        });
      } catch (error) {
        this.error = error.message || 'Something went wrong!';
      }
      this.isLoading = false;
    },
    handleError() {
      this.error = null;
    },
  },
};
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>
