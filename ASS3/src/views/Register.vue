<script setup>
import { ref } from 'vue'
import CryptoJS from 'crypto-js';
import { useRouter } from 'vue-router'

const router = useRouter()
const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  isAustralian: false,
  reason: '',
  gender: '',
  age:'',
  userType:'user'
})

const submittedCards = ref([])

const validateReason = () => {
  const reason = formData.value.reason;

  if (reason.includes('friend')) {
    errors.value.reason = 'Great to have a friend!';
  } else if (reason.length < 10) {
    errors.value.reason = 'Reason for joining cannot be empty.';
  } else {
    errors.value.reason = null;
  }
}

const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match.'
  } else {
    errors.value.confirmPassword = null
  }
}

const submitForm = () => {
  validateName(true)
  validatePassword(true)
  validateConfirmPassword(true)
  validateReason(true)
  validateAge(true)

  
  if (!errors.value.username && !errors.value.password && !errors.value.confirmPassword && !errors.value.reason && !errors.value.age) { 
    const secretKey = 'secret';

    const encryptedPassword = CryptoJS.AES.encrypt(formData.value.password, secretKey).toString();
const encryptedConfirmPassword = CryptoJS.AES.encrypt(formData.value.confirmPassword, secretKey).toString();

const newUser = {
  username: formData.value.username,
  password: encryptedPassword,
  confirmPassword: encryptedConfirmPassword,
  isAustralian: formData.value.isAustralian,
  reason:formData.value.reason,
  gender:formData.value.gender,
  age:formData.value.age,
  userType:formData.value.userType,
};

    
    let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    

    users.push(newUser);
    
    // store back localStorage
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    submittedCards.value.push(newUser);
    clearForm()
    router.push('/SuccessRegister') 
  }
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    isAustralian: false,
    reason: '',
    gender: '',
    age:'',
    userType:''
  }
}

const errors = ref({
  username: null,
  password: null,
  confirmPassword: null,
  resident: null,
  gender: null,
  reason: null,
  age: null
})

const validateName = (blur) => {
  const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];

  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters';
  } else if (users.some(user => user.username === formData.value.username)) {
    errors.value.username = 'Username is already taken';
  } else {
    errors.value.username = null;
  }
}

const validateAge = (blur) => {
  const age = Number(formData.value.age);
  if (isNaN(age) || age < 18 || age > 150) {
    if (blur) errors.value.age = 'Age must be at normal, between 18 and 150'
  } else {
    errors.value.age= null
  }
}


const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.'
  } else {
    errors.value.password = null
  }
}

const loadUsers = () => {
  const users = JSON.parse(localStorage.getItem('registeredUsers')) || []
  submittedCards.value = users
}

loadUsers()

</script>


<template>


  <div class="container mt-5">
    <div class="row">
      <div class="col-12 col-md-10">
        <h1 class="text-center">🗄️Registration Form</h1>
        <form @submit.prevent="submitForm">

          <div class="row col-12 col-md-10">
            <div class="col-12 col-md-10">
              <label for="username" class="form-label">Username</label>
              <input
                type="text"
                class="form-control"
                id="username"
                @blur="() => validateName(true)"
                @input="() => validateName(false)"
                v-model="formData.username"
              />
              <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>
            
            <div class="col-12 col-md-10">
              <label for="gender" class="form-label">Gender</label>
              <select class="form-select" id="gender" v-model="formData.gender" required>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="col-12 col-md-10">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                @blur="() => validatePassword(true)"
                @input="() => validatePassword(false)"
                v-model="formData.password"
              />
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>
            
            <div class="col-12 col-md-10">
              <label for="confirm-password" class="form-label">Confirm password</label>
              <input
                type="password"
                class="form-control"
                id="confirm-password"
                v-model="formData.confirmPassword"
                @blur="() => validateConfirmPassword(true)"
              />
              <div v-if="errors.confirmPassword" class="text-danger">
                {{ errors.confirmPassword }}
              </div>
            </div>

          </div>

          <div class="col-12 col-md-10">
            <label for="age" class="form-label col-12 col-md-6">Age</label>
            <input
              type="number"
              class="form-control"
              id="age"
              v-model="formData.age"
              min="0"
              max="150"
              step="1"
              @blur="() => validateAge(true)"
              @input="() => validateAge(false)"
              oninput="this.value = this.value.replace(/[^0-9]/g, '')"
            />
            <div v-if="errors.age" class="text-danger">{{ errors.age }}</div>
          </div>

          <div class="row col-12 col-md-10">
            <div class="col-md-6 col-sm-6">
              <div class="form-check col-12 col-md-6">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="isAustralian"
                  v-model="formData.isAustralian"
                />
                <label class="form-check-label" for="isAustralian">Australian Resident?</label>
              </div>
            </div>
    
          </div>

          <div class="col-12 col-md-10">
            <label for="reason" class="form-label">Reason for joining</label>
            <textarea
              class="form-control"
              id="reason"
              rows="3"
              v-model="formData.reason"
              @blur="() => validateReason(true)"
            ></textarea>
            <div v-if="errors.reason" class="text-danger">
              {{ errors.reason }}
            </div>

          </div>
            <div class="text-center col-12 col-md-10">
            <button type="submit" class="btn btn-primary me-2" @click = "submitForm">Submit</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>
        </form>
      </div>
    </div>
  </div>

 
</template>

