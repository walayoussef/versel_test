// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAwI7v4kWZTmqPX8IH0PGdgHO3k66OFksI",
  authDomain: "tri-dechets-pfe.firebaseapp.com",
  databaseURL: "https://tri-dechets-pfe-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tri-dechets-pfe",
  storageBucket: "tri-dechets-pfe.firebasestorage.app",
  messagingSenderId: "72975863015",
  appId: "1:72975863015:web:7f4f1448e5327b0e3b2642"
};

const app = initializeApp(firebaseConfig); // <-- une seule fois !

const db = getFirestore(app);          // Firestore
const database = getDatabase(app);     // Realtime Database

export { db, database };
