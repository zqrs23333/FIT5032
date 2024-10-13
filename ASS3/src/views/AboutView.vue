<template>
  <div class="col-12 col-md-11">
    <h1 tabindex="0">About Our Internet</h1>
    <p tabindex="0">Welcome to our forum! Only authenticated users can see this page. And welcome to post here.</p>
  </div>

  <div>
    <form @submit.prevent="createPost">
      <label for="postContent" class="sr-only">Post Content</label>
      <textarea 
        id="postContent" 
        v-model="newPostContent" 
        placeholder="Write your post here..." 
        aria-required="true"
        aria-label="Write your post here"
      ></textarea>
      <button type="submit" aria-label="Submit your post">Post</button>
    </form>

    <div v-for="post in posts" :key="post.id" class="post" tabindex="0">
      <h4 tabindex="0">{{ post.author }}</h4>
      <p tabindex="0">{{ post.content }}</p>
      <button 
        @click="likePost(post.id)" 
        :aria-label="'Like post by ' + post.author" 
        aria-live="polite"
      >
        👍 {{ post.likes }}
      </button>
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
};

const likePost = (postId) => {
  const post = posts.value.find(post => post.id === postId);
  const user = localStorage.getItem('currentUser'); 

  if (post && user && !post.likedBy.includes(user)) { 
    post.likes += 1;
    post.likedBy.push(user); 
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
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
}

button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 1rem;
}

button:focus, textarea:focus {
  outline: 3px solid #0056b3;
}

.post {
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
  padding-bottom: 10px;
}
</style>

  