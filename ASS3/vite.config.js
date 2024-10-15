import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'primevue': fileURLToPath(new URL('./node_modules/primevue', import.meta.url))
    }
  },
  base: process.env.NODE_ENV === 'production'
    ? '/FIT5032/ass3/'  
    : '/'               
});