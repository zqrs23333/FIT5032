<template>
  <div class="container mt-5">
    <h1 class="text-center">User Information Form</h1>
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input type="text" class="form-control" id="username"
               @blur="() => validateName(true)"
               @input="() => validateName(false)"
               v-model="formData.username">
        <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" id="password"
               @blur="() => validatePassword(true)"
               @input="() => validatePassword(false)"
               v-model="formData.password">
        <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
      </div>

      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="isAustralian"
               @blur="() => validateResident(true)"
               @change="() => validateResident(false)"
               v-model="formData.isAustralian">
        <label class="form-check-label" for="isAustralian">Australian Resident?</label>
        <div v-if="errors.resident" class="text-danger">{{ errors.resident }}</div>
      </div>

      <div class="mb-3">
        <label for="gender" class="form-label">Gender</label>
        <select class="form-select" id="gender"
                @blur="() => validateGender(true)"
                @change="() => validateGender(false)"
                v-model="formData.gender">
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <div v-if="errors.gender" class="text-danger">{{ errors.gender }}</div>
      </div>

      <div class="mb-3">
        <label for="reason" class="form-label">Reason for joining</label>
        <textarea class="form-control" id="reason" rows="3"
                  @blur="() => validateReason(true)"
                  @input="() => validateReason(false)"
                  v-model="formData.reason"></textarea>
        <div v-if="errors.reason" class="text-danger">{{ errors.reason }}</div>
      </div>

      <div class="text-center">
        <button type="submit" class="btn btn-primary">Submit</button>
        <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
      </div>
    </form>

    <!-- DataTable for displaying submitted user data -->
    <DataTable v-if="submittedCards.length" :value="submittedCards" class="mt-5">
      <Column field="username" header="Username"></Column>
      <Column field="password" header="Password"></Column>
      <Column field="isAustralian" header="Australian Resident?"></Column>
      <Column field="gender" header="Gender"></Column>
      <Column field="reason" header="Reason"></Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const formData = ref({
    username: '',
    password: '',
    isAustralian: false,
    gender: '',
    reason: ''
});

const submittedCards = ref([]);
const errors = ref({
    username: null,
    password: null,
    resident: null,
    gender: null,
    reason: null
});

// Validation functions (as previously described)
// Include the methods validateName, validatePassword, validateResident, validateGender, validateReason

const submitForm = () => {
    validateName(true);
    validatePassword(true);
    validateResident(true);
    validateGender(true);
    validateReason(true);

    if (!errors.value.username && !errors.value.password && !errors.value.resident &&
        !errors.value.gender && !errors.value.reason) {
        submittedCards.value.push({ ...formData.value });
        clearForm();
    }
};

const clearForm = () => {
    formData.value = {
        username: '',
        password: '',
        isAustralian: false,
        gender: '',
        reason: ''
    };
};

const validateName = (blur) => {
    if (formData.value.username.length < 3) {
        if (blur) {
            errors.value.username = "Name must be at least 3 characters";
        }
    } else {
        errors.value.username = null;
    }
};

const validatePassword = (blur) => {
    const password = formData.value.password;
    let errorMessage = null;

    if (password.length < 8) {
        errorMessage = "Password must be at least 8 characters long.";
    } else if (!/[A-Z]/.test(password)) {
        errorMessage = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(password)) {
        errorMessage = "Password must contain at least one lowercase letter.";
    } else if (!/\d/.test(password)) {
        errorMessage = "Password must contain at least one number.";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errorMessage = "Password must contain at least one special character.";
    }

    if (blur || errorMessage) {
        errors.value.password = errorMessage;
    } else {
        errors.value.password = null;
    }
};

const validateResident = (blur) => {
    if (!formData.value.isAustralian && blur) {
        errors.value.resident = "Please confirm your residency status.";
    } else {
        errors.value.resident = null;
    }
};

const validateGender = (blur) => {
    if (!formData.value.gender && blur) {
        errors.value.gender = "Please select your gender.";
    } else {
        errors.value.gender = null;
    }
};

const validateReason = (blur) => {
    if (formData.value.reason.trim().length < 10) {
        if (blur) {
            errors.value.reason = "Reason must be at least 10 characters long.";
        }
    } else {
        errors.value.reason = null;
    }
};

</script>

<style scoped>
.form-control, .form-select {
    max-width: 300px;
    margin: auto;
}
</style>


