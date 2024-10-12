import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/Register.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import AccessDenied from '../views/AccessDenied.vue'
import HomeView from '../views/HomeView.vue'
import ManageView from '../views/ManageView.vue'
import SuccessRegisterView from '../views/SuccessRegisterView.vue'
import AddBookView from '../views/AddBookView.vue'
import GetBookCountView from '../views/GetBookCountView.vue'
import WeatherView from '../views/WeatherView.vue';
import CountBookAPI from '../views/CountBookAPI.vue'
import NewsGalleryView from '../views/NewsGalleryPage.vue';
import NewsArticlePage from '../views/NewsArticlePage.vue';
import AddArticle from '../views/AddArticle.vue'
import Articlemanage from '../views/Articlemanage.vue'

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
    path: '/AddBook',
    name: 'AddBook',
    component: AddBookView
  }
  ,
  {
    path: '/GetBookCount',
    name: 'GetBookCount',
    component: GetBookCountView
  }
  ,
  {
    path: '/WeatherCheck',
    name: 'WeatherCheck',
    component: WeatherView
  },
  {
    path: '/CountBookAPI',
    name: 'CountBookAPI',
    component: CountBookAPI
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

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