import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/Register.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import AccessDenied from '../views/AccessDenied.vue'
import HomeView from '../views/HomeView.vue'
import ManageView from '../views/ManageView.vue'
import SuccessRegisterView from '../views/SuccessRegisterView.vue'
import WeatherView from '../views/WeatherView.vue';
import NewsGalleryView from '../views/NewsGalleryPage.vue';
import NewsArticlePage from '../views/NewsArticlePage.vue';
import AddArticle from '../views/AddArticle.vue'
import Articlemanage from '../views/Articlemanage.vue'
import GeographyAPI from '../views/GeographyAPI.vue'
import AppointmentListComponent from '@/views/AppointmentList.vue';
import AppointmentComponent from '@/views/Appointment.vue';
import GetwebAPI from '../views/GetwebAPI.vue'
import GenAI from '../views/GenAI.vue'

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
  ,
  {
    path: '/WeatherCheck',
    name: 'WeatherCheck',
    component: WeatherView
  },
  {
    path: '/NewsGalleryView',
    name: 'NewsGalleryView',
    component: NewsGalleryView
  },
  {
    path: '/NewsGalleryView/article/:id',
    name: 'NewsArticle',
    component: NewsArticlePage,
  },
  {
    path: '/AddArticle',
    name: 'AddArticle',
    component: AddArticle,
  },
  {
    path: '/Articlemanage',
    name: 'Articlemanage',
    component: Articlemanage,
  },
  {
    path: '/GeographyAPI',
    name: 'GeographyAPI',
    component: GeographyAPI,
  },
  {
    path: '/appointment',
    name: 'AppointmentList',
    component: AppointmentListComponent, 
  },
  {
    path: '/appointment/detail/:id',
    name: 'AppointmentDetail',
    component: AppointmentComponent, 
  },
  {
    path: '/GetwebAPI',
    name: 'GetwebAPI',
    component: GetwebAPI, 
  },
  {
    path: '/GenAI',
    name: 'GenAI',
    component: GenAI, 
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  const publicPages = ['Login', 'Register', 'Home', 'SuccessRegister']
  const managerPages = ['Manager','Articlemanage','AddArticle']

  if (managerPages.includes(to.name)) {
    if (isAdmin) {
      next()
    } else {
      next('/access-denied')
    }
    return
  }

  if (!isAuthenticated && !publicPages.includes(to.name)) {
    next('/login')
  } else {
    next()
  }
})

export default router