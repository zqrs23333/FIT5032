<template>
  <div class="login-background">
    <div class="container d-flex justify-content-center align-items-center min-vh-100">
      <div class="card login-card shadow-lg p-5">
        <h2 class="text-center mb-4"><span class="key-icon">🔑</span> 登录</h2>
        <div class="login-tabs d-flex justify-content-around mb-5">
          <button :class="{ 'btn-tab-active': loginMode === 'account' }" class="btn btn-tab" @click="switchMode('account')">账号登录</button>
          <button :class="{ 'btn-tab-active': loginMode === 'email' }" class="btn btn-tab" @click="switchMode('email')">邮箱登录</button>
        </div>

        
        <form v-if="loginMode === 'account'" @submit.prevent="accountLogin">
          <div class="mb-4">
            <label for="username" class="form-label">用户名</label>
            <input type="text" class="form-control form-control-lg" v-model="username" required />
          </div>
          <div class="mb-4">
            <label for="password" class="form-label">密码</label>
            <input type="password" class="form-control form-control-lg" v-model="password" required />
          </div>
          <button type="submit" class="btn btn-primary btn-block btn-lg">账号登录</button>
          <div v-if="loginError" class="text-danger mt-3">{{ loginError }}</div>
        </form>

        
        <form v-else @submit.prevent="emailLogin">
          <div class="mb-4">
            <label for="email" class="form-label">邮箱</label>
            <input type="email" class="form-control form-control-lg" v-model="email" required />
          </div>
          <div class="mb-4">
            <label for="password" class="form-label">密码</label>
            <input type="password" class="form-control form-control-lg" v-model="password" required />
          </div>
          <button type="submit" class="btn btn-primary btn-block btn-lg">邮箱登录</button>
          <div v-if="loginError" class="text-danger mt-3">{{ loginError }}</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CryptoJS from 'crypto-js';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const username = ref('');
const email = ref('');
const password = ref('');
const loginError = ref(null);
const loginMode = ref('account'); 
const router = useRouter();
const auth = getAuth();
const db = getFirestore(); 


const switchMode = (mode) => {
  loginMode.value = mode;
  loginError.value = null;
  password.value = '';
  if (mode === 'account') {
    username.value = '';
  } else {
    email.value = '';
  }
};


const fetchUserInfo = async (username) => {
  const userDoc = doc(db, "users", username); 
  const userSnap = await getDoc(userDoc);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    throw new Error('No such document!');
  }
};


const accountLogin = async () => {
  try {
    
    const userData = await fetchUserInfo(username.value);
    const secretKey = 'secret';

    // 解密存储的密码
    const decryptedPassword = CryptoJS.AES.decrypt(userData.password, secretKey).toString(CryptoJS.enc.Utf8);
    if (decryptedPassword === password.value) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', username.value);
      
      // 根据用户类型进行不同的操作
      if (userData.userType === 'admin') {
        localStorage.setItem('isAdmin', 'true');
        router.push('/admin').then(() => {
          location.reload();
        });
      } else {
        router.push('/about').then(() => {
          location.reload();
        });
      }
    } else {
      loginError.value = '用户名或密码错误';
    }
  } catch (error) {
    console.error("登录过程中出现错误:", error);
    loginError.value = '登录失败。请检查您的凭据，然后重试。';
  }
};

// 邮箱登录方法保持不变
const emailLogin = async () => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email.value, password.value);
    console.log("Firebase login successful:", user);
    // 从 Firestore 获取用户信息
    const userData = await fetchUserInfo(user.email);

    // 根据用户类型进行不同的操作
    if (userData.userType === 'admin') {
      localStorage.setItem('isAdmin', 'true');
      router.push('/admin').then(() => {
        location.reload();
      });
    } else {
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/about').then(() => {
        location.reload();
      });
    }
  } catch (error) {
    console.error("邮箱登录过程中出现错误:", error);
    loginError.value = '邮箱登录失败。请检查您的邮箱和密码。';
  }
};
</script>

<style scoped>
.login-background {
  background: linear-gradient(to bottom, #6a11cb, #2575fc);
  height: 100vh;
}

.login-card {
  border-radius: 20px;
  width: 100%;
  max-width: 450px;
}

.btn-tab {
  padding: 10px 30px;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: bold;
  color: #6c757d;
}

.btn-tab-active {
  color: #fff;
  background-color: #007bff;
  border-radius: 10px;
}

.key-icon {
  margin-right: 10px;
}
</style>