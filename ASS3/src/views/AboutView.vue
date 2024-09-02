<template>
  <div class="col-12 col-md-11">
    <h1>About Our internet</h1>
    <p>Welcome to our forum! Only authenticated users can see this page. And welcome to post here</p>
  </div>

  <div>
    <form @submit.prevent="createPost">
      <textarea v-model="newPostContent" placeholder="Write your post here..."></textarea>
      <button type="submit">Post</button>
    </form>

    <div v-for="post in posts" :key="post.id" class="post">
      <h4>{{ post.author }}</h4>
      <p>{{ post.content }}</p>
      <button @click="likePost(post.id)">👍 {{ post.likes }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';


const posts = ref([]);
const newPostContent = ref('');

const createPost = () => {
  const user = localStorage.getItem('currentUser'); 
  if (!user) {
    alert('No user logged in');
    return;
  }

  if (newPostContent.value.trim() === '') {
    alert('Post content cannot be empty');
    return;
  }

  const newPost = {
    id: posts.value.length + 1,
    author: user,
    content: newPostContent.value,
    likes: 0,
    likedBy: [], 
  };

  posts.value.push(newPost);
  newPostContent.value = ''; 
  console.log('Post created:', newPost);
};

const likePost = (postId) => {
  const post = posts.value.find(post => post.id === postId);
  const user = localStorage.getItem('currentUser'); 

  console.log('LikedBy:', post.likedBy); 
  console.log('Current User:', user); 

  if (post && user && !post.likedBy.includes(user)) { 
    post.likes += 1;
    post.likedBy.push(user); 
    console.log('User liked the post:', user);
  } else {
    alert("You have already liked this post!");
  }
};

const savePosts = () => {
  localStorage.setItem('posts', JSON.stringify(posts.value));
};

const loadPosts = () => {
  const savedPosts = localStorage.getItem('posts');
  if (savedPosts) {
    posts.value = JSON.parse(savedPosts);
  } else {
    posts.value = []; 
  }
};

onMounted(loadPosts);
watch(posts, savePosts, { deep: true });
</script>

<style scoped>
textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
}

.post {
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
  padding-bottom: 10px;
}
</style>

  
  