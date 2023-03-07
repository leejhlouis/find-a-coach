<template>
  <form @submit.prevent="contactCoach">
    <div class="form-control">
      <label for="email">Your email</label>
      <input type="email" name="email" id="email" v-model.trim="email" />
    </div>
    <div class="form-control">
      <label for="message">Your message</label>
      <textarea rows="5" name="message" id="message" v-model.trim="message" />
    </div>
    <p class="errors" v-if="!isFormValid">
      Please fix the above errors and submit again!
    </p>
    <div class="actions">
      <BaseButton>Send Message</BaseButton>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      message: '',
      isFormValid: true,
    };
  },
  methods: {
    validate() {
      if (
        this.email === '' ||
        !this.email.includes('@') ||
        this.message === ''
      ) {
        this.isFormValid = false;
      } else {
        this.isFormValid = true;
      }
    },
    async contactCoach() {
      this.validate();

      if (!this.isFormValid) {
        return;
      }

      try {
        await this.$store.dispatch('requests/contactCoach', {
          coachId: this.$route.params.id,
          email: this.email,
          message: this.message,
        });

        this.$router.replace('/requests');
      } catch (error) {
        alert(error.message || 'Something went wrong!');
      }
    },
  },
};
</script>

<style scoped>
form {
  margin: 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}

.errors {
  font-weight: bold;
  color: red;
}

.actions {
  text-align: center;
}
</style>
