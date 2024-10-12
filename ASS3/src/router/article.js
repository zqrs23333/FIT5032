import { createRouter, createWebHistory } from 'vue-router';
import NewsGalleryPage from '@/components/NewsGalleryPage.vue';
import NewsArticlePage from '@/components/NewsArticlePage.vue';

const routes = [
  { path: '/', component: NewsGalleryPage },
  { path: '/article/:id', component: NewsArticlePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
