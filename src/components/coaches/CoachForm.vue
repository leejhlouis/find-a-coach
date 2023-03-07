<template>
  <form @submit.prevent="submitForm">
    <div class="form-control">
      <label for="firstname">Firstname</label>
      <input type="text" id="firstname" v-model.trim="firstName.value" />
    </div>
    <div class="form-control">
      <label for="lastname">Lastname</label>
      <input type="text" id="lastname" v-model.trim="lastName.value" />
    </div>
    <div class="form-control">
      <label for="description">Description</label>
      <textarea
        id="description"
        rows="5"
        v-model.trim="description.value"
      ></textarea>
    </div>
    <div class="form-control">
      <label for="rate">Hourly Rate</label>
      <input type="number" id="rate" v-model.number="rate.value" />
    </div>
    <div class="form-control">
      <h3>Areas of Expertise</h3>
      <div>
        <input
          type="checkbox"
          id="frontend"
          value="frontend"
          v-model="areas.value"
        />
        <label for="frontend">Frontend Development</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="backend"
          value="backend"
          v-model="areas.value"
        />
        <label for="backend">Backend Development</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="career"
          value="career"
          v-model="areas.value"
        />
        <label for="career">Career Advisory</label>
      </div>
    </div>
    <p class="text-red" v-if="!isFormValid">
      Please fix the above errors and submit again!
    </p>
    <base-button>Register</base-button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      firstName: {
        value: '',
        isValid: true,
      },
      lastName: {
        value: '',
        isValid: true,
      },
      description: {
        value: '',
        isValid: true,
      },
      rate: {
        value: null,
        isValid: true,
      },
      areas: {
        value: [],
        isValid: true,
      },
      isFormValid: true,
    };
  },
  methods: {
    validate() {
      if (this.firstName.value === '') {
        this.firstName.isValid = false;
        this.isFormValid = false;
      }
      if (this.lastName.value === '') {
        this.lastName.isValid = false;
        this.isFormValid = false;
      }
      if (this.description.value === '') {
        this.description.isValid = false;
        this.isFormValid = false;
      }
      if (!this.rate.value || this.rate.value < 0) {
        this.rate.isValid = false;
        this.isFormValid = false;
      }
      if (this.areas.length === 0) {
        this.areas.isValid = false;
        this.isFormValid = false;
      }
    },
    submitForm() {
      this.validate();

      if (!this.isFormValid) return;

      this.$emit('save-data', {
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        description: this.description.value,
        hourlyRate: this.rate.value,
        areas: this.areas.value,
      });
    },
  },
};
</script>

<style scoped>
.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

input[type='checkbox'] + label {
  font-weight: normal;
  display: inline;
  margin: 0 0 0 0.5rem;
}

input,
textarea {
  display: block;
  width: 100%;
  border: 1px solid #ccc;
  font: inherit;
}

input:focus,
textarea:focus {
  background-color: #f0e6fd;
  outline: none;
  border-color: #3d008d;
}

input[type='checkbox'] {
  display: inline;
  width: auto;
  border: none;
}

input[type='checkbox']:focus {
  outline: #3d008d solid 1px;
}

h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.invalid label {
  color: red;
}

.invalid input,
.invalid textarea {
  border: 1px solid red;
}

.text-red {
  color: red;
}
</style>
