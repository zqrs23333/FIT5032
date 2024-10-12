<template>
    <div class="article-container" v-if="article">
      <h2>{{ article.title }}</h2>
      <p>{{ article.content }}</p>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { getFirestore, doc, getDoc } from 'firebase/firestore';
  
  const route = useRoute();
  const db = getFirestore();
  const article = ref(null);
  
  const fetchArticle = async (id) => {
    try {
      const docRef = doc(db, 'articles', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        article.value = docSnap.data();
      } else {
        console.error('No such document!');
      }
    } catch (error) {
      console.error('Error fetching article:', error);
    }
  };
  
  onMounted(() => {
    const articleId = route.params.id;
    fetchArticle(articleId);
  });
  </script>
  
  <style scoped>
  .article-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .article-container h2 {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .article-container p {
    font-size: 18px;
    line-height: 1.6;
  }
  </style>