<template>
    <div class="genai-container">
      <h1>GenAI Integration Example</h1>
      <label for="userPrompt">Enter a prompt:</label>
      <textarea v-model="userPrompt" rows="4" style="width: 100%;"></textarea>
      <br /><br />
      <button @click="getGeminiResponse">Generate Response</button>
      <h3>AI Response:</h3>
      <p>{{ response }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const userPrompt = ref('');
  const response = ref('');
  
  const getGeminiResponse = async () => {
    response.value = 'Loading...';
  
    try {
      const res = await fetch('https://generatetext-3wyv3d3kia-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer YOUR_BACKEND_API_KEY',
        },
        body: JSON.stringify({ prompt: userPrompt.value }),
      });
  
      if (!res.ok) {
        throw new Error('Network response was not ok: ' + res.statusText);
      }
  
      const data = await res.json();
      response.value = data.generated_text;
    } catch (error) {
      response.value = 'Error: ' + error.message;
    }
  };
  </script>
  
  <style scoped>
  .genai-container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
  }
  
  button {
    margin-top: 10px;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>