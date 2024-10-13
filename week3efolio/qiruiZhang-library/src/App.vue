<template>
  <div class="email-form">
    <h2>Send Email</h2>
    <form @submit.prevent="sendEmail">
      <div>
        <label for="recipient">To:</label>
        <input type="email" id="recipient" v-model="emailData.recipient" required />
      </div>
      
      <div>
        <label for="subject">Subject:</label>
        <input type="text" id="subject" v-model="emailData.subject" required />
      </div>

      <div>
        <label for="body">Body:</label>
        <textarea id="body" v-model="emailData.body" required></textarea>
      </div>

      <div>
        <label for="attachment">Attachment:</label>
        <input type="file" id="attachment" @change="handleFileUpload" />
      </div>

      <button type="submit">Send Email</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      emailData: {
        recipient: '',
        subject: '',
        body: '',
      },
      attachment: null,
    };
  },
  methods: {
    handleFileUpload(event) {
      this.attachment = event.target.files[0];
    },
    async sendEmail() {
      const formData = new FormData();
      formData.append('recipient', this.emailData.recipient);
      formData.append('subject', this.emailData.subject);
      formData.append('body', this.emailData.body);
      if (this.attachment) {
        formData.append('attachment', this.attachment);
      }

      try {
        const response = await fetch('http://localhost:3000/send-email', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        alert(result.message);
      } catch (error) {
        console.error('Error sending email:', error);
        alert('Failed to send email');
      }
    },
  },
};
</script>

<style scoped>
.email-form {
  max-width: 600px;
  margin: 0 auto;
}

.email-form div {
  margin-bottom: 10px;
}

.email-form label {
  display: block;
  margin-bottom: 5px;
}

.email-form input,
.email-form textarea {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}

button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
