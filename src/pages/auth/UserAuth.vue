<template>
  <div>
    <BaseDialog :show="!!error" title="An error occured" @close="handleError">
      <p>{{ error }}</p>
    </BaseDialog>
    <BaseDialog :show="isLoading" title="Authenticating..." fixed>
      <BaseSpinner></BaseSpinner>
    </BaseDialog>
    <BaseCard>
      <h2>{{ submitButtonCaption }}</h2>
      <form @submit.prevent="submit">
        <div class="form-control">
          <label for="email">Email address</label>
          <input type="email" id="email" v-model.trim="email" />
        </div>
        <div class="form-control">
          <label for="password">Password</label>
          <input type="password" id="password" v-model.trim="password" />
        </div>
        <p class="error" v-if="!isFormValid">
          Please enter a valid email and password (must be at least 6 characters
          long).
        </p>
        <div class="form-actions">
          <BaseButton>{{ submitButtonCaption }}</BaseButton>
          <BaseButton type="button" mode="flat" @click="switchAuthMode">{{
            switchModeButtonCaption
          }}</BaseButton>
        </div>
      </form>
    </BaseCard>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      isFormValid: true,
      mode: 'login',
      isLoading: false,
      error: null,
    };
  },
  computed: {
    submitButtonCaption() {
      return this.mode.charAt(0).toUpperCase() + this.mode.slice(1);
    },
    switchModeButtonCaption() {
      return `${this.mode === 'login' ? 'Sign up' : 'Login'} instead`;
    },
  },
  methods: {
    switchAuthMode() {
      this.mode = this.mode === 'login' ? 'sign up' : 'login';
    },
    validate() {
      if (
        this.email === '' ||
        !this.email.includes('@') ||
        this.password.length < 6
      ) {
        this.isFormValid = false;
      }
    },
    async submit() {
      this.isLoading = true;
      this.validate();

      if (!this.isFormValid) {
        return;
      }

      const payload = {
        email: this.email,
        password: this.password,
      };

      try {
        if (this.mode === 'login') {
          await this.$store.dispatch('login', payload);
        } else {
          await this.$store.dispatch('signUp', payload);
        }

        const redirectUrl = '/' + (this.$route.query.redirect || 'coaches');
        this.$router.replace(redirectUrl);
      } catch (error) {
        this.error =
          error.message || 'Failed to authenticate! Try again later!';
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
form {
  margin: 1rem;
  padding: 1rem;
}

h2 {
  margin: 1rem 2rem;
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

.form-actions {
  padding-top: 1rem;
}

.error {
  color: red;
}
</style>
