<template>
  <div class="add-article-container">
    <h2 tabindex="0">Add New News</h2>
    <form @submit.prevent="addArticle">
      <div class="form-group">
        <label for="title">Title</label>
        <input 
          type="text" 
          id="title" 
          v-model="title" 
          required 
          aria-required="true" 
          aria-label="Title of the news article"
        />
      </div>
      <div class="form-group">
        <label for="content">Content</label>
        <textarea 
          id="content" 
          v-model="content" 
          required 
          aria-required="true" 
          aria-label="Content of the news article"
        ></textarea>
      </div>
      <button 
        type="submit" 
        class="submit-button" 
        aria-label="Submit new article"
      >
        Add Article
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

const db = getFirestore();
const title = ref('');
const content = ref('');
const router = useRouter();

const addArticle = async () => {
  try {
    await addDoc(collection(db, 'articles'), {
      title: title.value,
      content: content.value,
    });
    alert('Article added successfully');
    router.push({ name: 'NewsGalleryView' });
  } catch (error) {
    console.error('Error adding article:', error);
    alert('Error adding article');
  }
};
</script>

<style scoped>
.add-article-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

input[type="text"]:focus,
textarea:focus {
  outline: 3px solid #007bff;
}

textarea {
  height: 150px;
}

.submit-button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #0056b3;
}

.submit-button:focus {
  outline: 3px solid #0056b3;
}
</style>
