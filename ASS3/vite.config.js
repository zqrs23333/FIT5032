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
  }
})

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/FIT5032/ass3/' // 仓库名和子文件夹名
    : '/'
}