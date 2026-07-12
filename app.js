// 1. Import the Firebase tools we need straight from the web
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 2. 🛑 PASTE YOUR CONFIG HERE 🛑
// Replace this entire block with the code you copied from Firebase in Step 2!
const firebaseConfig = {
  apiKey: "AIzaSyDvwoCAS8hHMW0KRyM2toaoFZNnP-cuOTE",
  authDomain: "between-us-79b5b.firebaseapp.com",
  databaseURL: "https://between-us-79b5b-default-rtdb.firebaseio.com",
  projectId: "between-us-79b5b",
  storageBucket: "between-us-79b5b.firebasestorage.app",
  messagingSenderId: "944752928890",
  appId: "1:944752928890:web:8a16b700cedfc0abc7b3c3"
};
// 3. Turn on Firebase and connect to the database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Quick test to make sure it works
console.log("Firebase is locked and loaded!");
