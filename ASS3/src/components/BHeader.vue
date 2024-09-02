<template>
  <!-- Using Bootstrap's Header template (starter code) -->
  <!-- https://getbootstrap.com/docs/5.0/examples/headers/ -->
  <div class="container col-12 col-md-6">
    <header class="d-flex align-items-center justify-content-between py-3">
      <img src="@/assets/logo.png" alt="Logo" class="logo-img me-3">
      <ul class="nav nav-pills mx-auto"> 
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page">Home</router-link>
        </li>
        <li class="nav-item" v-if="!isAuthenticated">
          <router-link to="/register" class="nav-link" active-class="active" aria-current="page">Register</router-link>
        </li>
        <li class="nav-item" v-if="isAuthenticated">
          <router-link to="/about" class="nav-link" active-class="active">About</router-link>
        </li>
        <li class="nav-item" v-if="isAdmin">
          <router-link to="/manager" class="nav-link" active-class="active" aria-current="page">Manager</router-link>
        </li>
      </ul>
      
      <div class="ml-auto" v-if="!isAuthenticated" >
          <router-link to="/login" class="btn btn-outline-secondary" >Login</router-link>
        </div>
      <div v-if="isAuthenticated" class="ml-auto"> 
        <button @click="logout" class="btn btn-outline-secondary">Logout</button>
      </div>
    </header>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'


const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')
const isAdmin = ref(localStorage.getItem('isAdmin') === 'true')
const router = useRouter()

const logout = () => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('isAdmin')
  isAuthenticated.value = false
  router.push('/login').then(() => {
    router.go(0) 
  })
}

</script>

<style scoped>
.b-example-divider {
  height: 3rem;
  background-color: rgba(0, 0, 0, 0.1);
  border: solid rgba(0, 0, 0, 0.15);
  border-width: 1px 0;
  box-shadow:
    inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1),
    inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
}

.form-control-dark {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: var(--bs-gray);
}
.form-control-dark:focus {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: #fff;
  box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
}

.bi {
  vertical-align: -0.125em;
  fill: currentColor;
}

.text-small {
  font-size: 85%;
}

.dropdown-toggle {
  outline: 0;
}

.logout-botton {
  margin-left: auto;
}
.logo-img {
  height: 60px; 
  width: auto;  

}
</style>
