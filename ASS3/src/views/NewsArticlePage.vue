<template>
  <div class="article-container" v-if="article">
    <h2>{{ article.title }}</h2>
    <p>{{ article.content }}</p>
    <div class="export-buttons">
      <button @click="exportToPDF">Export to PDF</button>
      <button @click="exportToWord">Export to Word</button>
      <button @click="exportToTxt">Export to TXT</button>
    </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';

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

const exportToPDF = () => {
  const doc = new jsPDF();
  doc.text(20, 20, `Title: ${article.value.title}`);
  doc.text(20, 30, `Content: ${article.value.content}`);
  doc.save(`${article.value.title}.pdf`);
};

const exportToWord = () => {
  const content = `Title: ${article.value.title}\n\nContent: ${article.value.content}`;
  const blob = new Blob([content], { type: 'application/msword' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${article.value.title}.doc`;
  a.click();
  window.URL.revokeObjectURL(url);
};

const exportToTxt = () => {
  const content = `Title: ${article.value.title}\n\nContent: ${article.value.content}`;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${article.value.title}.txt`;
  a.click();
  window.URL.revokeObjectURL(url);
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