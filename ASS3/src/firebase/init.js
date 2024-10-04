import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDkrBPTJfESsh0UP6nZtHAqUYW6bNowhPw',
  authDomain: 'week7-qiruizhang.firebaseapp.com',
  projectId: 'week7-qiruizhang',
  storageBucket: 'week7-qiruizhang.appspot.com',
  messagingSenderId: '63293350787',
  appId: '1:63293350787:web:ea97c7599bf62b193accb6',
  measurementId: 'G-9R295ZRYGJ'
}

const app = initializeApp(firebaseConfig)
console.log('Firebase app initialized:', app) // 确认是否成功初始化

const db = getFirestore(app)
console.log('Firestore initialized:', db) // 确认 Firestore 是否成功初始化

export default db
