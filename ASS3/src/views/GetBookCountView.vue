<template>
  <div id="app">
    <h1>Book Counter</h1>
    <button @click="getBookCount">Get Book Count</button>
    <p v-if="count !== null">Total number of books: {{ count }}</p>
    <p v-if="error">{{ error }}</p>

    <!-- Add new book form -->
    <h2>Add New Book</h2>
    <input v-model="newBookName" placeholder="Enter book name" />
    <button @click="addBook">Add Book</button>
    <p v-if="addError">{{ addError }}</p>
    <p v-if="successMessage">{{ successMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      count: null,
      error: null,
      newBookName: '', // Model for book name input
      addError: null,
      successMessage: null,
    };
  },
  methods: {
    async getBookCount() {
      try {
        const response = await axios.get("https://countbooks-3wyv3d3kia-uc.a.run.app");
        this.count = response.data.count;
        this.error = null;
      } catch (error) {
        console.error('Error fetching book count:', error);
        this.error = 'Error fetching book count';
        this.count = null;
      }
    },

    // Function to add a new book entry to Firestore
    async addBook() {
      if (this.newBookName === '') {
        this.addError = 'Book name cannot be empty!';
        return;
      }

      try {
        const db = getFirestore();
        const docRef = await addDoc(collection(db, 'books'), {
          name: this.newBookName
        });

        // Clear the input field and display success message
        this.newBookName = '';
        this.successMessage = 'Book added successfully with ID: ' + docRef.id;
        this.addError = null;
      } catch (error) {
        console.error('Error adding book:', error);
        this.addError = 'Error adding book';
        this.successMessage = null;
      }
    }
  }
};
</script>
