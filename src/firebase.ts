import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDYCorsjGjOu1SjDH0KRskhkyjC6ap5jfY",
    authDomain: "credit-tracker-db.firebaseapp.com",
    projectId: "credit-tracker-db",
    storageBucket: "credit-tracker-db.firebasestorage.app",
    messagingSenderId: "12433797652",
    appId: "1:12433797652:web:e140e6c24a7779ed052d01"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
