<template>
  <div class="col-12">
    <h4>This is a manager's Datatable.</h4>
    <DataTable :value="users" tableStyle="min-width: 50rem" :paginator="true" :rows="10" :sortMode="'multiple'" :globalFilter="globalFilter" class="p-datatable-sm">
      <div class="p-input-icon-left mb-3">
        <i class="pi pi-search"></i>
        <input v-model="globalFilter" type="text" placeholder="Global Search" class="search-input" />
      </div>
      <Column field="username" header="Username" sortable></Column>
      <Column field="email" header="Email" sortable></Column>
      <Column field="password" header="Password" sortable></Column>
      <Column field="isAustralian" header="Australian Resident" sortable></Column>
      <Column field="gender" header="Gender" sortable></Column>
      <Column field="reason" header="Reason" sortable></Column>
      <Column field="age" header="Age" sortable></Column>
      <Column field="userType" header="User Type" sortable></Column>
      <Column header="Actions">
        <template #body="{ data }">
          <button @click="showModal(data)" class="email-button">Send Email</button>
        </template>
      </Column>
    </DataTable>

    <div v-if="emailDialog" class="email-dialog">
      <h4>Send Email</h4>
      <form @submit.prevent="sendEmailWithAttachments">
        <input v-model="emailData.to" type="text" placeholder="Recipient Email" />
        <textarea v-model="emailData.body" placeholder="Email Body" rows="5"></textarea>
        <input type="file" multiple @change="onFileChange" />
        <button type="submit">Send</button>
        <button type="button" @click="hideModal">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { ref, onMounted } from 'vue'
import CryptoJS from 'crypto-js';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import axios from 'axios';

const secretKey = 'secret';
const db = getFirestore(); 
const users = ref([]); 
const globalFilter = ref(''); 

const fetchUsersFromFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    users.value = querySnapshot.docs.map(doc => {
      const userData = doc.data();
      const decryptedPassword = CryptoJS.AES.decrypt(userData.password, secretKey).toString(CryptoJS.enc.Utf8);
      return {
        ...userData,
        password: decryptedPassword,
      };
    });
  } catch (error) {
    console.error('Error fetching users from Firestore:', error);
  }
};

const emailDialog = ref(false);
const emailData = ref({
  to: '',
  body: '',
  attachments: []
});

const showModal = (userData) => {
  emailData.value.to = userData.email; // Pre-fill the recipient email
  emailDialog.value = true;
};

const hideModal = () => {
  emailDialog.value = false;
};

const onFileChange = (event) => {
  emailData.value.attachments = Array.from(event.target.files);
};

const sendEmailWithAttachments = async () => {
  const formData = new FormData();
  formData.append('to', emailData.value.to);
  formData.append('body', emailData.value.body);
  emailData.value.attachments.forEach(file => {
    formData.append('attachments', file);
  });

  try {
    await axios.post('https://your-api-url/send-email-with-attachments', formData);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
  }
  hideModal();
};

onMounted(() => {
  fetchUsersFromFirestore();
});
</script>

<style scoped>
.col-12 {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-input {
  padding: 5px;
  margin-bottom: 20px;
}

.email-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.email-button:hover {
  background: #0056b3;
}

.email-dialog {
  background: white;
  border: 1px solid #ccc;
  padding: 20px;
  width: 400px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.email-dialog input,
.email-dialog textarea {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 5px;
}

.email-dialog button {
  margin-right: 10px;
  padding: 5px 10px;
}

.email-dialog button[type="submit"] {
  background: #007bff;
  color: white;
  border: none;
}

.email-dialog button[type="submit"]:hover {
  background: #0056b3;
}

.email-dialog button[type="button"] {
  background: #ccc;
  color: black;
  border: none;
}
</style>
