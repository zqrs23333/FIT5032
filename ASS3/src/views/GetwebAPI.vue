<template>
  <div class="api-access-container">
    <h2>API Access Page</h2>
    <p>Welcome to the API Access Page. Here you can view and manage the available API endpoints for the web application.</p>

    <div class="api-section">
      <h3>Available APIs</h3>
      <table class="api-table">
        <thead>
          <tr>
            <th>API Endpoint</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>/api/articles</td>
            <td>Fetch a list of all articles available on the platform.</td>
            <td><button @click="fetchArticlesAPI">Test API</button></td>
          </tr>
          <tr>
            <td>/api/appointments</td>
            <td>Fetch a list of all appointments available on the platform.</td>
            <td><button @click="fetchAppointmentsAPI">Test API</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="api-results">
      <h3>API Response</h3>
      <pre>{{ apiResponse }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const apiResponse = ref('');

const fetchArticlesAPI = async () => {
  try {
    const response = await axios.get('https://firestore.googleapis.com/v1/projects/week7-qiruizhang/databases/(default)/documents/articles');
    apiResponse.value = JSON.stringify(response.data, null, 2);
  } catch (error) {
    apiResponse.value = `Error: ${error.message}`;
  }
};

const fetchAppointmentsAPI = async () => {
  try {
    const response = await axios.get('https://firestore.googleapis.com/v1/projects/week7-qiruizhang/databases/(default)/documents/appointments');
    apiResponse.value = JSON.stringify(response.data, null, 2);
  } catch (error) {
    apiResponse.value = `Error: ${error.message}`;
  }
};
</script>

<style scoped>
.api-access-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.api-section {
  margin-top: 20px;
}

.api-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.api-table th,
.api-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.api-table th {
  background-color: #f9f9f9;
}

.api-results {
  margin-top: 20px;
  background: #f4f4f4;
  padding: 10px;
  border-radius: 5px;
}

.api-results pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>