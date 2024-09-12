<template>
  <h1>Sign in</h1>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p><input type="password" placeholder="Password" v-model="password" /></p>
  <p><button @click="signin">Sign in via Firebase</button></p>
  <h1>Welcome to the system!</h1>
  <!-- Logout 按钮，点击时调用 logout 函数 -->
  <button @click="logout">Logout</button>
</template>

<script setup>
import { ref } from "vue"
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { useRouter } from "vue-router"

const email = ref("")
const password = ref("")
const router = useRouter()
const auth = getAuth()

const signin = () => {
  signInWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data) => {
      console.log("Firebase Register Successful!")
      router.push("/")
      console.log(auth.currentUser) // To check the current User signed in
    })
    .catch((error) => {
      console.log(error.code)
    })
}

// 定义 logout 函数
const logout = () => {
  signOut(auth)
    .then(() => {
      console.log('User signed out successfully!')
      // 登出成功后重定向到登录页面
      router.push('/Firelogin')
    })
    .catch((error) => {
      console.error('Sign-out error: ', error)
    })
}


</script>
