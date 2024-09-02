import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/Register.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import AccessDenied from '../views/AccessDenied.vue'
import HomeView from '../views/HomeView.vue'
import ManageView from '../views/ManageView.vue'
import SuccessRegisterView from '../views/SuccessRegisterView.vue'

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
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const isAdmin= localStorage.getItem('isAdmin') === 'true'

  const publicPages = ['Login', 'Register','Home','SuccessRegister']
  const managerPages = ['Manager']

  if (managerPages.includes(to.name)) {
    if (isAdmin) {
      next(); 
    } else {
      next('/'); 
    }
    return;
  }
  
  if (!isAuthenticated && !publicPages.includes(to.name)) {
    
    next('/')
  } else {
    
    next()
  }
})
export default router