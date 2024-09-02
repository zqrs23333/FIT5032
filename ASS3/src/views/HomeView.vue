<template>
    <div class="container mt-5 text-center col-12 col-md-11">
      <div class="content-box text-center p-4">
        <h1>Welcome to Dusk Senior Network!</h1>
        <p class="lead">Discover how your peers are rating their teachers and share your own experiences to help others make informed decisions.</p>
        <button @click="handleButtonClick" class="btn btn-primary btn-lg mt-4">Start Right Now...</button>
      </div>
      <div class="mt-5 col-12 col-md-11">
            <p>Dusk Senior Network - Helping the elder people and give the help with them and their family member.</p>
            <p>Built with <a href="https://getbootstrap.com/" target="_blank">Bootstrap</a> by the qirui Zhang.</p>
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
  </style>
  