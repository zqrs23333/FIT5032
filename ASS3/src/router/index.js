import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/Register.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import AccessDenied from '../views/AccessDenied.vue'
import HomeView from '../views/HomeView.vue'
import ManageView from '../views/ManageView.vue'
import SuccessRegisterView from '../views/SuccessRegisterView.vue'
import FirebaseRegister from '../views/FirebaseRegister.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import AddBookView from '../views/AddBookView.vue'
import GetBookCountView from '../views/GetBookCountView.vue'

const routes = [
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDenied
  },
  {
    path: '/manager',
    name: 'Manager',
    component: ManageView
  },
  {
    path: '/SuccessRegister',
    name: 'SuccessRegister',
    component: SuccessRegisterView
  },
  {
    path: '/FireRegister',
    name: 'FireRegister',
    component: FirebaseRegister
  },
  {
    path: '/Firelogin',
    name: 'Firelogin',
    component: FirebaseSigninView
  },
  {
    path: '/AddBook',
    name: 'AddBook',
    component: AddBookView
  },
  {
    path: '/GetBookCount',
    name: 'GetBookCount',
    component: GetBookCountView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
// const { onRequest } = require('firebase-functions/v2/https')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })
admin.initializeApp()

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  const publicPages = ['Login', 'Register', 'Home', 'SuccessRegister']
  const managerPages = ['Manager']

  if (managerPages.includes(to.name)) {
    if (isAdmin) {
      next()
    } else {
      next('/')
    }
    return
  }

  if (!isAuthenticated && !publicPages.includes(to.name)) {
    next('/')
  } else {
    next()
  }
})
export default router

exports.countBooks = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const booksCollection = admin.firestore().collection('books')
      const snapshot = await booksCollection.get()
      const count = snapshot.size

      res.status(200).send({ count })
    } catch (error) {
      console.error('Error counting books:', error.message)
      res.status(500).send('Error counting books')
    }
  })
})
