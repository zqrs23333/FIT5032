<template>
  <div class="articles-table-container">
    <h2>Articles List</h2>
    <div class="table-controls">
      <input type="text" v-model="searchQuery" placeholder="Search title..." />
      <div class="pagination-controls">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
    <table class="articles-table">
      <thead>
        <tr>
          <th @click="sortTable('title')">Article Title</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(article, index) in paginatedArticles" :key="index">
          <td>{{ article.title }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const db = getFirestore();
const articles = ref([]);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const sortAscending = ref(true);

const fetchArticles = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'articles'));
    articles.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching articles:', error);
  }
};

onMounted(fetchArticles);

const filteredArticles = computed(() => {
  if (!searchQuery.value) {
    return articles.value;
  }
  return articles.value.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredArticles.value.length / itemsPerPage);
});

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredArticles.value.slice(start, end);
});

const changePage = (pageNumber) => {
  if (pageNumber > 0 && pageNumber <= totalPages.value) {
    currentPage.value = pageNumber;
  }
};

const sortTable = (column) => {
  articles.value.sort((a, b) => {
    if (sortAscending.value) {
      if (a[column] < b[column]) return -1;
      if (a[column] > b[column]) return 1;
    } else {
      if (a[column] < b[column]) return 1;
      if (a[column] > b[column]) return -1;
    }
    return 0;
  });
  sortAscending.value = !sortAscending.value;
};
</script>

<style scoped>
.articles-table-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.table-controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.articles-table {
  width: 100%;
  border-collapse: collapse;
}

.articles-table th, .articles-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.articles-table th {
  cursor: pointer;
  background-color: #f9f9f9;
}

.pagination-controls {
  display: flex;
  align-items: center;
}

.pagination-controls button {
  margin: 0 5px;
}
</style>