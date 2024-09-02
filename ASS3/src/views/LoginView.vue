<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="col-12 col-md-12">
        <label for="username" class="form-label">Username</label>
        <input type="text" class="form-control" v-model="username" required />
      </div>
      <div class="col-12 col-md-12">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" v-model="password" required />
      </div>
      <div class="col-12 col-md-12">
        <label for="userType" class="form-label">User type</label>
        <select class="form-select" type="userType" v-model="userType" required>
          <option value="user">User</option>
          <option value="admin">Admin</option>
            </select>
      </div>

      <button type="submit" class="btn btn-primary">Login</button>
      <div v-if="loginError" class="text-danger col-12 col-md-11">{{ loginError }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CryptoJS from 'crypto-js';


const username = ref('')
const password = ref('')
const loginError = ref(null)
const router = useRouter()
const userType = ref('user')

const login = () => {
  const users = JSON.parse(localStorage.getItem('registeredUsers')) || []
  const secretKey = 'secret';


  const user = users.find(user => user.username === username.value && user.userType === userType.value)

  if (user) {

    const decryptedPassword = CryptoJS.AES.decrypt(user.password, secretKey).toString(CryptoJS.enc.Utf8);

    
    if (decryptedPassword === password.value) {
      if (userType.value === 'admin'){
        localStorage.setItem('isAdmin', 'true')
      }
      localStorage.setItem('currentUser',username.value)
      localStorage.setItem('isAuthenticated', 'true')
      router.push('/about').then(() => {
        router.go(0) 
      })
    } else {
      loginError.value = 'Invalid username or password'
    }
  } else {
    loginError.value = 'Invalid username or password'
  }
}



</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 0px;
  border: 0px solid #ccc;
  border-radius: 8px;
}
</style>

