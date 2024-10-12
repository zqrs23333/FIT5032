<template>
    <div class="news-container">
      <h3>Articles</h3>
      <div class="news-gallery">
        <div
          v-for="(news, index) in paginatedNews"
          :key="index"
          class="news-card"
          @click="goToArticle(news.id)"
        >

          <h5 class="news-title">{{ news.title  }}</h5>
        </div>
      </div>
      <div class="pagination-container">
        <button
          v-for="(page, idx) in totalPages"
          :key="idx"
          @click="changePage(idx + 1)"
          class="pagination-button"
        >
          {{ idx + 1 }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { getFirestore, collection, getDocs } from 'firebase/firestore';
  
  const db = getFirestore();
  const newsItems = ref([]);  
  const paginatedNews = ref([]); 
  const totalPages = ref(1); 
  const currentPage = ref(1); 
  const router = useRouter();
  
  // 定义 fetchArticles 函数
  const fetchArticles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'articles'));
      newsItems.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      totalPages.value = Math.ceil(newsItems.value.length / 4);
      updatePaginatedNews();
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };
  
  
  const updatePaginatedNews = () => {
    const startIndex = (currentPage.value - 1) * 4;
    paginatedNews.value = newsItems.value.slice(startIndex, startIndex + 4);
  };
  
  
  onMounted(fetchArticles);
  
  const goToArticle = (id) => {
    router.push({ name: 'NewsArticle', params: { id } });
  };
  
  const changePage = (pageNumber) => {
    currentPage.value = pageNumber;
    updatePaginatedNews();
  };
  </script>
  
  <style scoped>
  .news-container {
    padding: 20px;
  }
  
  .news-gallery {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .news-card {
    cursor: pointer;
    border: 1px solid #ccc;
    padding: 80px;
    transition: transform 0.3s;
  }
  
  .news-card:hover {
    transform: translateY(-5px);
  }
  

  .news-title {
    font-size: 24px;
    text-align: center;
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  
  .pagination-button {
    background-color: #007bff;
    border: none;
    color: white;
    padding: 10px;
    margin: 5px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s;
  }
  
  .pagination-button:hover {
    background-color: #0056b3;
  }
  </style>