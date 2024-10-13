<template>
  <div class="articles-table-container">
    <h2 tabindex="0">Articles List</h2>
    <div class="table-controls">
      <label for="search" class="sr-only">Search by title</label>
      <input 
        type="text" 
        id="search" 
        v-model="searchQuery" 
        placeholder="Search title..." 
        aria-label="Search by article title"
      />
      <div class="pagination-controls">
        <button 
          @click="changePage(currentPage - 1)" 
          :disabled="currentPage === 1" 
          aria-label="Previous page"
        >
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button 
          @click="changePage(currentPage + 1)" 
          :disabled="currentPage === totalPages" 
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
    <table class="articles-table" aria-label="List of articles">
      <thead>
        <tr>
          <th @click="sortTable('title')" role="button" tabindex="0" :aria-label="'Sort articles by title'">
            Article Title
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(article, index) in paginatedArticles" :key="article.id" tabindex="0">
          <td>{{ article.title }}</td>
          <td>
            <button @click="startEditing(article)">Edit</button>
            <button @click="deleteArticle(article.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 编辑表单 -->
    <div v-if="isEditing" class="edit-form">
      <h3>Edit Article</h3>
      <form @submit.prevent="updateArticle">
        <label for="editTitle">Title:</label>
        <input type="text" id="editTitle" v-model="editableArticle.title" required />

        <label for="editContent">Content:</label>
        <textarea id="editContent" v-model="editableArticle.content" required></textarea>

        <button type="submit">Save Changes</button>
        <button type="button" @click="cancelEditing">Cancel</button>
      </form>
    </div>

    <div class="export-buttons">
      <button @click="exportToCSV">Export to CSV</button>
      <button @click="exportToPDF">Export to PDF</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';

const db = getFirestore();
const articles = ref([]);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const sortAscending = ref(true);
const isEditing = ref(false);
const editableArticle = ref(null);

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
      return a[column].localeCompare(b[column]);
    } else {
      return b[column].localeCompare(a[column]);
    }
  });
  sortAscending.value = !sortAscending.value;
};

const deleteArticle = async (articleId) => {
  try {
    await deleteDoc(doc(db, 'articles', articleId));
    articles.value = articles.value.filter(article => article.id !== articleId);
    alert('Article deleted successfully');
  } catch (error) {
    console.error('Error deleting article:', error);
    alert('Failed to delete article');
  }
};

const startEditing = (article) => {
  editableArticle.value = { ...article }; // 克隆以防止直接修改原始对象
  isEditing.value = true;
};

const updateArticle = async () => {
  try {
    const articleRef = doc(db, 'articles', editableArticle.value.id);
    await updateDoc(articleRef, {
      title: editableArticle.value.title,
      content: editableArticle.value.content,
    });
    const articleIndex = articles.value.findIndex(article => article.id === editableArticle.value.id);
    articles.value[articleIndex] = { ...editableArticle.value }; // 更新本地数据
    isEditing.value = false;
    editableArticle.value = null;
    alert('Article updated successfully');
  } catch (error) {
    console.error('Error updating article:', error);
    alert('Failed to update article');
  }
};

const cancelEditing = () => {
  isEditing.value = false;
  editableArticle.value = null;
};

const exportToCSV = () => {
  const csvRows = [];
  const headers = Object.keys(articles.value[0]).filter(key => key !== 'id');
  csvRows.push(headers.join(',')); // 添加表头

  articles.value.forEach(article => {
    const values = headers.map(header => `"${article[header]}"`);
    csvRows.push(values.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'articles.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const exportToPDF = () => {
  const doc = new jsPDF();
  let y = 10;

  articles.value.forEach((article, index) => {
    doc.text(10, y, `Article ${index + 1}:`);
    y += 10;
    Object.keys(article).forEach(key => {
      if (key !== 'id') {
        doc.text(10, y, `${key}: ${article[key]}`);
        y += 10;
      }
    });
    y += 10; // 添加一些间距
  });

  doc.save('articles.pdf');
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

.edit-form {
  margin-top: 20px;
}

.edit-form label {
  display: block;
  margin-top: 10px;
}

.edit-form input, .edit-form textarea {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}

.edit-form button {
  margin-top: 10px;
  padding: 8px 12px;
  cursor: pointer;
}

.edit-form textarea {
  width: 100%;
  height: 300px; /* 增加高度 */
  padding: 8px;
  margin-top: 5px;
}

.export-buttons {
  margin-top: 20px;
}

.export-buttons button {
  margin-right: 10px;
  padding: 10px;
  background: #28a745;
  color: white;
  border: none;
  cursor: pointer;
}

.export-buttons button:hover {
  background: #218838;
}
</style>