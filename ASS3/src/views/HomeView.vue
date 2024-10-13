<template>
  <div class="container mt-5 text-center col-12 col-md-11">
    <div class="content-box text-center p-4">
      <h1 tabindex="0">Welcome to Dusk Senior Network!</h1>
      <p class="lead" tabindex="0">
        Discover how your peers are rating their teachers and share your own experiences to help others make informed decisions.
      </p>
      <button 
        @click="handleButtonClick" 
        class="btn btn-primary btn-lg mt-4" 
        aria-label="Start exploring Dusk Senior Network" 
      >
        Start Right Now...
      </button>
    </div>
    <div class="mt-5 col-12 col-md-11">
      <p tabindex="0">Dusk Senior Network - Helping the elder people and providing assistance to them and their family members.</p>
      <p tabindex="0">
        Built with 
        <a href="https://getbootstrap.com/" target="_blank" rel="noopener noreferrer" aria-label="Bootstrap official website">
          Bootstrap
        </a> 
        by Qirui Zhang.
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const handleButtonClick = async () => {
    if (localStorage.getItem('isAuthenticated')) {
      await router.push('/About')
    } else {
      await router.push('/login')
    }
}
</script>

<style scoped>
.container {
  max-width: 800px;
}

.content-box {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

p.lead {
  font-size: 1.25rem;
  margin-bottom: 2rem;
}

.btn-primary {
  font-size: 1.25rem;
}

.btn-primary:focus {
  outline: 3px solid #0056b3; 
}

a:focus {
  outline: 3px solid #0056b3; 
}
</style>
