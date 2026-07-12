// 1. Import all the Firebase tools we need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, get, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 2. 🛑 PASTE YOUR CONFIG HERE 🛑
const firebaseConfig = {
  apiKey: "AIzaSyDvwoCAS8hHMW0KRyM2toaoFZNnP-cuOTE",
  authDomain: "between-us-79b5b.firebaseapp.com",
  databaseURL: "https://between-us-79b5b-default-rtdb.firebaseio.com",
  projectId: "between-us-79b5b",
  storageBucket: "between-us-79b5b.firebasestorage.app",
  messagingSenderId: "944752928890",
  appId: "1:944752928890:web:8a16b700cedfc0abc7b3c3"
};

// 3. Connect to Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- GAME LOGIC ---

// Get our HTML elements
const createBtn = document.getElementById('create-room-btn');
const joinBtn = document.getElementById('join-room-btn');
const roomInput = document.getElementById('room-code-input');
const setupSection = document.getElementById('setup-section');
const gameSection = document.getElementById('game-section');
const roomDisplay = document.getElementById('current-room-code');
const questionText = document.getElementById('question-text');
const myAnswerInput = document.getElementById('my-answer');
const submitBtn = document.getElementById('submit-btn');
const partnerAnswerDisplay = document.getElementById('partner-answer-text');

// State variables
let currentRoom = null;
let isPlayer1 = false; 

// A starter pack of questions!
const questionsPool = [
    "What's your favorite memory of us?",
    "If you could relive one day with me, which day would it be?",
    "What is one thing I do that makes you smile?",
    "What's a secret dream you haven't told many people about?",
    "What was your exact first impression of me?"
];

// CREATE ROOM
createBtn.addEventListener('click', () => {
    const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
    currentRoom = roomCode;
    isPlayer1 = true; // The creator is Player 1

    const randomQuestion = questionsPool[Math.floor(Math.random() * questionsPool.length)];

    // Save to database
    set(ref(db, 'rooms/' + roomCode), {
        question: randomQuestion,
        p1Answer: "",
        p2Answer: ""
    }).then(() => {
        enterGameUI(roomCode);
        listenToRoom(roomCode);
    }).catch(err => alert("Error: " + err.message));
});

// JOIN ROOM
joinBtn.addEventListener('click', () => {
    const code = roomInput.value.trim();
    if(!code) return alert("Please enter a room code!");

    get(ref(db, 'rooms/' + code)).then((snapshot) => {
        if(snapshot.exists()) {
            currentRoom = code;
            isPlayer1 = false; // The joiner is Player 2
            enterGameUI(code);
            listenToRoom(code);
        } else {
            alert("Room not found! Check the code.");
        }
    });
});

// SUBMIT ANSWER
submitBtn.addEventListener('click', () => {
    const answer = myAnswerInput.value.trim();
    if(!answer || !currentRoom) return;

    const updateData = {};
    if(isPlayer1) updateData.p1Answer = answer;
    else updateData.p2Answer = answer;

    update(ref(db, 'rooms/' + currentRoom), updateData);
    
    submitBtn.innerText = "Sent!";
    submitBtn.disabled = true; // Prevent spamming
});

// REAL-TIME SYNC MAGIC
function listenToRoom(roomCode) {
    onValue(ref(db, 'rooms/' + roomCode), (snapshot) => {
        const data = snapshot.val();
        if(!data) return;

        // Show the question
        questionText.innerText = data.question;

        // Figure out whose answer is whose
        const myAnswer = isPlayer1 ? data.p1Answer : data.p2Answer;
        const partnerAnswer = isPlayer1 ? data.p2Answer : data.p1Answer;

        // Only reveal the partner's answer IF you have also answered (No cheating!)
        if (partnerAnswer) {
            if (myAnswer) {
                partnerAnswerDisplay.innerText = partnerAnswer;
            } else {
                partnerAnswerDisplay.innerText = "Partner answered! Waiting for you...";
            }
        } else {
            partnerAnswerDisplay.innerText = "Waiting...";
        }
    });
}

function enterGameUI(code) {
    setupSection.classList.add('hidden');
    gameSection.classList.remove('hidden');
    roomDisplay.innerText = code;
}
