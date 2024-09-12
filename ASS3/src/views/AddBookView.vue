<template>
  <div>
      <h1>Add book</h1>
      <form @submit.prevent="addBook">
          <div>
              <label for="isbn">ISBN:</label>
              <input type="text" v-model="isbn" id="isbn" required />
          </div>
          <div>
              <label for="name">NAME:</label>
              <input type="text" v-model="name" id="name" required />
          </div>
          <button type="submit">Add book</button>
      </form>

      <!-- Update, Delete, Fetch buttons -->
      <button @click="updateBook">Update book</button>
      <button @click="deleteBook">Delete book</button>
      <button @click="fetchBooks">Fetch books</button>
  </div>
</template>

<script>
import { ref } from 'vue';
import db from '../firebase/init.js';
import { collection, addDoc, doc, updateDoc, deleteDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

export default {
setup() {
  const isbn = ref('');
  const name = ref('');

  const addBook = async () => {
    try {
      const isbnNumber = Number(isbn.value);
      if (isNaN(isbnNumber)) {
        alert('ISBN must be a valid number');
        return;
      }

      await addDoc(collection(db, 'books'), {
        isbn: isbnNumber,
        name: name.value
      });

      isbn.value = '';
      name.value = '';
      alert('Book added successfully!');
    } catch (error) {
      console.error('Error adding book: ', error);
    }
  };

  const updateBook = async () => {
    try {
      const bookId = prompt("Enter the book ID to update:");
      const newName = prompt("Enter the new name of the book:");
      const newIsbn = Number(prompt("Enter the new ISBN of the book:"));

      if (isNaN(newIsbn)) {
        alert('ISBN must be a valid number');
        return;
      }

      const bookRef = doc(db, 'books', bookId);
      await updateDoc(bookRef, {
        name: newName,
        isbn: newIsbn
      });

      alert('Book updated successfully!');
    } catch (error) {
      console.error('Error updating book: ', error);
    }
  };

  const deleteBook = async () => {
    try {
      const bookId = prompt("Enter the book ID to delete:");
      const bookRef = doc(db, 'books', bookId);
      await deleteDoc(bookRef);

      alert('Book deleted successfully!');
    } catch (error) {
      console.error('Error deleting book: ', error);
    }
  };

  const fetchBooks = async () => {
    try {
      const q = query(
        collection(db, 'books'),
        where('isbn', '>', 1000),
        orderBy('isbn', 'desc'),
        limit(5)
      );
      
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().name}, ISBN: ${doc.data().isbn}`);
      });

      alert('Books fetched successfully! Check console for details.');
    } catch (error) {
      console.error('Error fetching books: ', error);
    }
  };

  return {
    isbn,
    name,
    addBook,
    updateBook,
    deleteBook,
    fetchBooks
  };
}
};
</script>
