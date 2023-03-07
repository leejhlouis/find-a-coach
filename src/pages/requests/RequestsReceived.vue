<template>
  <div>
    <BaseDialog :show="!!error" title="An error occured!" @close="handleError">
      <p>{{ error }}</p>
    </BaseDialog>
    <section>
      <BaseCard>
        <header>
          <h2>Requests Received</h2>
        </header>
        <div v-if="isLoading">
          <BaseSpinner />
        </div>
        <ul v-else-if="hasRequests">
          <RequestItem
            v-for="request in requests"
            :key="request.id"
            :="request"
          />
        </ul>
        <h3 v-else>You haven't received any requests yet!</h3>
      </BaseCard>
    </section>
  </div>
</template>

<script>
import RequestItem from '../../components/requests/RequestItem.vue';
import { mapGetters } from 'vuex';

export default {
  components: { RequestItem },
  data() {
    return {
      isLoading: false,
      error: null,
    };
  },
  computed: {
    ...mapGetters('requests', ['requests', 'hasRequests']),
  },
  methods: {
    async loadRequests() {
      this.isLoading = true;
      try {
        await this.$store.dispatch('requests/loadRequests');
      } catch (error) {
        this.error = error.message || 'Something went wrong!';
      }
      this.isLoading = false;
    },
    handleError() {
      this.error = null;
    },
  },
  created() {
    this.loadRequests();
  },
};
</script>

<style scoped>
header {
  text-align: center;
}

ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}
</style>
