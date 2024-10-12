<script setup>

import BHeader from './components/BHeader.vue'
</script>

<template>
  <div class="main -cotainer">
    <header>
      <BHeader />
    </header>

  <main class = "main-box">
    <router-view></router-view>

  </main>
  </div>
</template>

<style scoped>
.main-container {
  max-width: 100vw;
  margin: 0 auto;
  background-color: #f8f9fa; /* 设置主容器的背景颜色（例如浅灰色） */
}

.main-box {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  margin-top: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
