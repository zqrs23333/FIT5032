import 'bootstrap/dist/css/bootstrap.min.css'
import CryptoJS from 'crypto-js';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'


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
    };

    const secretKey = 'secret';
 
        adminData.password = CryptoJS.AES.encrypt(adminData.password, secretKey).toString();
       
        adminData.confirmPassword = adminData.password;

        if (localStorage.getItem('ifcreate') !== 'true') {
        let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        users.push(adminData);
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        localStorage.setItem('ifcreate', 'true');
        } else {
        localStorage.setItem('ifcreate', 'true');
    }
    
  }
  
  
  createDefaultAdmin();