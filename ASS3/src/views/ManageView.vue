<template>
    <div class="col-12 col-md-6">
        <h4>This is a manager's Datatable.</h4>
        <DataTable :value="decryptedUsers" tableStyle="min-width: 50rem">
          <Column field="username" header="Username"></Column>
          <Column field="password" header="Password"></Column>
          <Column field="isAustralian" header="Australian Resident"></Column>
          <Column field="gender" header="Gender"></Column>
          <Column field="reason" header="Reason"></Column>
          <Column field="age" header="Age"></Column>
          <Column field="userType" header="User Type"></Column>
        </DataTable>
      </div>
  
      <div class="col-12 col-md-6" v-if="decryptedUsers.length">
        <div class="d-flex flex-wrap justify-content-start">
          <div
            v-for="(card, index) in decryptedUsers"
            :key="index"
            class="card m-2"
            style="width: 18rem"
          >
            <div class="card-header col-12 col-md-6">User Information</div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">Username: {{ card.username }}</li>
              <li class="list-group-item">Password: {{ card.password }}</li>
              <li class="list-group-item">
                Australian Resident: {{ card.isAustralian}}
              </li>
              <li class="list-group-item">Gender: {{ card.gender }}</li>
              <li class="list-group-item">Reason: {{ card.reason }}</li>
              <li class="list-group-item">Age: {{ card.age }}</li>
              <li class="list-group-item">User Type: {{ card.userType }}</li>
            </ul>
          </div>
        </div>
      </div>
  </template>
  
  <script setup>
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import { ref, computed } from 'vue'
  import CryptoJS from 'crypto-js';
  
  
  const secretKey = 'secret'
  
 
  const users = ref(JSON.parse(localStorage.getItem('registeredUsers')) || [])
  
  const decryptedUsers = computed(() => {
    return users.value.map(user => {
      const decryptedPassword = CryptoJS.AES.decrypt(user.password, secretKey).toString(CryptoJS.enc.Utf8)
      return {
        ...user,
        password: decryptedPassword,

      }
    })
  })
  </script>
  
  