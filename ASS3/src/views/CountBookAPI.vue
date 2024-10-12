<template>
  <div class="container">
    <h1>All Books</h1>
    <pre v-if="jsondata">{{ JSON.stringify(jsondata, null, 2) }}</pre>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      jsondata: null, 
      error: null     
    };
  },
  methods: {
    async getAllBooksAPI() {  
      try {
        
        const response = await axios.get('https://getallbooks-3wyv3d3kia-uc.a.run.app');
        console.log('API response:', response.data);
        this.jsondata = response.data;  
      } catch (error) {
        console.error('Error fetching book data:', error);
        this.error = 'Error fetching book data';
      }
    }
  },
  mounted() {
    this.getAllBooksAPI();  
  }
};
</script>