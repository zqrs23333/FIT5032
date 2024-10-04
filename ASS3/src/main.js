import 'bootstrap/dist/css/bootstrap.min.css'
import CryptoJS from 'crypto-js'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)

app.mount('#app')

const createDefaultAdmin = () => {
  const adminData = {
    username: 'admin',
    password: '123456',
    isAustralian: true,
    reason: 'Admin account',
    gender: 'male',
    age: '35',
    userType: 'admin'
  }

  const secretKey = 'secret'

  adminData.password = CryptoJS.AES.encrypt(adminData.password, secretKey).toString()

  adminData.confirmPassword = adminData.password

  if (localStorage.getItem('ifcreate') !== 'true') {
    let users = JSON.parse(localStorage.getItem('registeredUsers')) || []
    users.push(adminData)
    localStorage.setItem('registeredUsers', JSON.stringify(users))
    localStorage.setItem('ifcreate', 'true')
  } else {
    localStorage.setItem('ifcreate', 'true')
  }
}

createDefaultAdmin()

const firebaseConfig = {
  apiKey: 'AIzaSyDkrBPTJfESsh0UP6nZtHAqUYW6bNowhPw',
  authDomain: 'week7-qiruizhang.firebaseapp.com',
  projectId: 'week7-qiruizhang',
  storageBucket: 'week7-qiruizhang.appspot.com',
  messagingSenderId: '63293350787',
  appId: '1:63293350787:web:ea97c7599bf62b193accb6',
  measurementId: 'G-9R295ZRYGJ'
}

initializeApp(firebaseConfig)
