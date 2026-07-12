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

// --- ALL YOUR EXISTING FIREBASE CONFIG STAYS ABOVE THIS LINE ---

// 4. Grab the HTML elements we want to control
const createRoomBtn = document.getElementById('create-room-btn');
const setupSection = document.getElementById('setup-section');
const gameSection = document.getElementById('game-section');
const currentRoomCodeDisplay = document.getElementById('current-room-code');

// 5. Make the Create Room button work
createRoomBtn.addEventListener('click', () => {
    
    // Generate a random 4-digit number (e.g., "4827")
    const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Tell Firebase to create this room in the database
    set(ref(db, 'rooms/' + roomCode), {
        createdAt: Date.now(),
        status: 'waiting_for_partner'
    }).then(() => {
        // If successful, hide the setup buttons and show the game board
        setupSection.classList.add('hidden');
        gameSection.classList.remove('hidden');
        
        // Show the code on the screen so you can send it to Ashley
        currentRoomCodeDisplay.innerText = roomCode;
        console.log("Room created successfully: " + roomCode);
        
    }).catch((error) => {
        alert("Oops, couldn't create room: " + error.message);
    });
});
