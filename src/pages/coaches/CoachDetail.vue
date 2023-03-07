<template>
  <div>
    <section>
      <BaseCard>
        <h2>{{ fullName }}</h2>
        <h3>${{ rate }}/hour</h3>
      </BaseCard>
    </section>
    <section>
      <BaseCard>
        <header>
          <h2>Interested? Reach out now!</h2>
          <BaseButton link :to="contactLink">Contact</BaseButton>
        </header>
        <router-view></router-view>
      </BaseCard>
    </section>
    <section>
      <BaseCard>
        <BaseBadge
          v-for="area in areas"
          :key="area"
          :type="area"
          :title="area"
        ></BaseBadge>
        <p>{{ description }}</p>
      </BaseCard>
    </section>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {
      coach: null,
    };
  },
  computed: {
    fullName() {
      return `${this.coach.firstName} ${this.coach.lastName}`;
    },
    areas() {
      return this.coach.areas;
    },
    rate() {
      return this.coach.hourlyRate;
    },
    description() {
      return this.coach.description;
    },
    contactLink() {
      return `${this.$route.path}/contact`;
    },
  },
  created() {
    this.coach = this.$store.getters['coaches/coaches'].find(
      (coach) => coach.id === this.id
    );
  },
};
</script>
