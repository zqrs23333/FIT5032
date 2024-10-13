import 'bootstrap/dist/css/bootstrap.min.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import PrimeVue from 'primevue/config';

// Firebase 配置
const firebaseConfig = {
  apiKey: 'AIzaSyDkrBPTJfESsh0UP6nZtHAqUYW6bNowhPw',
  authDomain: 'week7-qiruizhang.firebaseapp.com',
  projectId: 'week7-qiruizhang',
  storageBucket: 'week7-qiruizhang.appspot.com',
  messagingSenderId: '63293350787',
  appId: '1:63293350787:web:ea97c7599bf62b193accb6',
  measurementId: 'G-9R295ZRYGJ'
};

// 初始化 Firebase 应用
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// 创建 Vue 应用
const app = createApp(App);
app.use(PrimeVue);
app.use(router);
app.mount('#app');
