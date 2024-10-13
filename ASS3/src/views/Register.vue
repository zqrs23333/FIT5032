<template>
  <div class="container mt-3">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8">
        <div class="card p-4 shadow">
          <h1 class="text-center mb-4">🗄️ Registration Form</h1>
          <form @submit.prevent="submitForm">
            <!-- 用户名 -->
            <div class="mb-3">
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

            <!-- 邮箱 -->
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email" v-model="formData.email" />
              <button type="button" class="btn btn-info mt-2" @click="sendVerificationCode">发送验证码</button>
            </div>

            <!-- 验证码输入 -->
            <div class="mb-3">
              <label for="verificationCode" class="form-label">验证码</label>
              <input
                type="text"
                class="form-control"
                id="verificationCode"
                v-model="verificationCode"
                placeholder="请输入验证码"
                @blur="validateVerificationCode" 
                maxlength="6"
              />
              <div v-if="errors.verificationCode" class="text-danger">{{ errors.verificationCode }}</div>
            </div>

            <!-- 密码和确认密码 -->
            <div class="mb-3">
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

            <div class="mb-3">
              <label for="confirm-password" class="form-label">Confirm Password</label>
              <input
                type="password"
                class="form-control"
                id="confirm-password"
                v-model="formData.confirmPassword"
                @blur="() => validateConfirmPassword(true)"
              />
              <div v-if="errors.confirmPassword" class="text-danger">{{ errors.confirmPassword }}</div>
            </div>

            <!-- 年龄 -->
            <div class="mb-3">
              <label for="age" class="form-label">Age</label>
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

            <!-- 澳大利亚居民选择 -->
            <div class="form-check mb-3">
              <input type="checkbox" class="form-check-input" id="isAustralian" v-model="formData.isAustralian" />
              <label class="form-check-label" for="isAustralian">Australian Resident?</label>
            </div>

            <!-- 加入原因 -->
            <div class="mb-3">
              <label for="reason" class="form-label">Reason for joining</label>
              <textarea
                class="form-control"
                id="reason"
                rows="3"
                v-model="formData.reason"
                @blur="() => validateReason(true)"
              ></textarea>
              <div v-if="errors.reason" class="text-danger">{{ errors.reason }}</div>
            </div>

            <!-- 提交按钮 -->
            <div class="text-center">
              <button type="submit" class="btn btn-success me-2">Submit</button>
              <button type="button" class="btn btn-outline-danger" @click="clearForm">Clear</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import CryptoJS from 'crypto-js';
import { useRouter } from 'vue-router';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, doc, setDoc,collection, getDoc } from 'firebase/firestore';

const router = useRouter();
const auth = getAuth();
const db = getFirestore();

const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  isAustralian: false,
  reason: '',
  gender: '',
  age: '',
  userType: 'user'
});

const verificationCode = ref('');

const verifyCode = async () => {
  const codeDoc = await db.collection('verificationCodes').doc(formData.value.email).get();
  if (codeDoc.exists && codeDoc.data().code === userEnteredCode) {
    alert('验证码正确');
  } else {
    alert('验证码错误');
  }
};

const sendVerificationCode = async () => {
  try {
    const response = await fetch('https://sendverificationcode-3wyv3d3kia-uc.a.run.app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: formData.value.email }),
    });

    if (response.ok) {
      alert("verificationcode is sent to your email");
    } else {
      alert("发送验证码失败，请稍后再试");
    }
  } catch (error) {
    console.error('发送验证码失败:', error);
    alert('发送验证码失败，请稍后再试');
  }
};

const errors = ref({
  username: null,
  email: null,
  password: null,
  confirmPassword: null,
  reason: null,
  age: null,
  verificationCode: null
});

const validateVerificationCode = async () => {
  try {
    const codeDocRef = doc(db, 'verificationCodes', formData.value.email);
    const codeDoc = await getDoc(codeDocRef);
    // if (codeDoc.exists && codeDoc.data().code === verificationCode.value) {
    //   errors.value.verificationCode = null; // 验证通过
    // } else {
    //   errors.value.verificationCode = '验证码错误'; // 验证失败，显示错误信息
    // }
    errors.value.verificationCode = null
  } catch (error) {
    console.error('验证验证码时发生错误:', error);
    errors.value.verificationCode = '验证验证码时发生错误，请稍后重试'; // 处理错误的情况
  }
};

const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    errors.value.username = blur ? 'Name must be at least 3 characters' : null;
  } else {
    errors.value.username = null;
  }
};

const validateEmail = (blur) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(formData.value.email)) {
    errors.value.email = blur ? 'Invalid email format' : null;
  } else {
    errors.value.email = null;
  }
};

const validatePassword = (blur) => {
  const password = formData.value.password;
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    errors.value.password = blur ? `Password must be at least ${minLength} characters long.` : null;
  } else if (!hasUppercase) {
    errors.value.password = blur ? 'Password must contain at least one uppercase letter.' : null;
  } else if (!hasLowercase) {
    errors.value.password = blur ? 'Password must contain at least one lowercase letter.' : null;
  } else if (!hasNumber) {
    errors.value.password = blur ? 'Password must contain at least one number.' : null;
  } else if (!hasSpecialChar) {
    errors.value.password = blur ? 'Password must contain at least one special character.' : null;
  } else {
    errors.value.password = null;
  }
};

const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = blur ? 'Passwords do not match.' : null;
  } else {
    errors.value.confirmPassword = null;
  }
};

const validateReason = (blur) => {
  const reason = formData.value.reason;
  if (reason.includes('friend')) {
    errors.value.reason = blur ? 'Great to have a friend!' : null;
  } else if (reason.length < 10) {
    errors.value.reason = blur ? 'Reason for joining cannot be empty.' : null;
  } else {
    errors.value.reason = null;
  }
};

const validateAge = (blur) => {
  const age = Number(formData.value.age);
  if (isNaN(age) || age < 18 || age > 100) {
    errors.value.age = blur ? 'Age must be between 18 and 100' : null;
  } else {
    errors.value.age = null;
  }
};

const submitForm = async () => {
  validateName(true);
  validateEmail(true);
  validatePassword(true);
  validateConfirmPassword(true);
  validateReason(true);
  validateAge(true);

  if (!Object.values(errors.value).some(Boolean)) {
    try {
      await createUserWithEmailAndPassword(auth, email.value, formData.value.password);
      console.log("Firebase Register Successful!");

      const secretKey = 'secret';
      const encryptedPassword = CryptoJS.AES.encrypt(formData.value.password, secretKey).toString();

      const newUser = {
        username: formData.value.username,
        email: formData.value.email,
        password: encryptedPassword,
        isAustralian: formData.value.isAustralian,
        reason: formData.value.reason,
        gender: formData.value.gender,
        age: formData.value.age,
        userType: formData.value.userType
      };

      await setDoc(doc(db, "users", formData.value.username), newUser);
      console.log("User data saved to Firestore!");

      clearForm();
      router.push('/SuccessRegister');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        errors.value.email = 'This email is already registered. Please use another email.';
      } else {
        errors.value.email = 'Failed to register. Please check your input.';
      }
    }
  }
};

const clearForm = () => {
  formData.value = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    isAustralian: false,
    reason: '',
    gender: '',
    age: '',
    userType: 'user'
  };
};
</script>

<style scoped>
.container {
  max-width: 700px;
  margin: 20px auto; /* 调整外边距，将顶部和底部外边距设置得更小一些 */
}
.card {
  border-radius: 15px;
}

.btn-info {
  background-color: #17a2b8;
  color: #fff;
}

.btn-success {
  background-color: #28a745;
  color: #fff;
}

.btn-outline-danger {
  border-color: #dc3545;
  color: #dc3545;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: #fff;
}
</style>