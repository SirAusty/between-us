import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, get, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 🛑 PASTE YOUR CONFIG HERE 🛑
const firebaseConfig = {
  apiKey: "AIzaSyDvwoCAS8hHMW0KRyM2toaoFZNnP-cuOTE",
  authDomain: "between-us-79b5b.firebaseapp.com",
  databaseURL: "https://between-us-79b5b-default-rtdb.firebaseio.com",
  projectId: "between-us-79b5b",
  storageBucket: "between-us-79b5b.firebasestorage.app",
  messagingSenderId: "944752928890",
  appId: "1:944752928890:web:8a16b700cedfc0abc7b3c3"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

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
const nextBtn = document.getElementById('next-question-btn'); 
const categorySelect = document.getElementById('category-select'); // NEW: The Category Dropdown

let currentRoom = null;
let isPlayer1 = false; 

// RESTRUCTURED: The Question Bank
const questionBank = {
    mixed: [
        "What's a secret dream you haven't told many people about?",
        "If you could teleport anywhere right now, where would we go?",
        "What is the most embarrassing thing you've ever done?"
    ],
    couples: [
        "What's your favorite memory of us?",
        "If you could relive one day with me, which day would it be?",
        "What is one thing I do that makes you smile?",
        "What is your biggest relationship fear?",
        "What was your exact first impression of me?"
    ],
    funny: [
        "Which celebrity would definitely survive a zombie apocalypse?",
        "What is your weirdest habit?",
        "If animals could talk, which one would be the rudest?"
    ]
};

// CREATE ROOM
createBtn.addEventListener('click', () => {
    const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
    currentRoom = roomCode;
    isPlayer1 = true; 
    
    // Grab the chosen category and pick a question from it
    const chosenCategory = categorySelect.value;
    const selectedPool = questionBank[chosenCategory];
    const randomQuestion = selectedPool[Math.floor(Math.random() * selectedPool.length)];

    set(ref(db, 'rooms/' + roomCode), {
        category: chosenCategory, // Save the category to the database!
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
            isPlayer1 = false; 
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
    submitBtn.disabled = true; 
});

// NEXT QUESTION LOGIC
nextBtn.addEventListener('click', () => {
    // Ask Firebase what category this room is playing
    get(ref(db, 'rooms/' + currentRoom + '/category')).then((snapshot) => {
        const roomCategory = snapshot.val() || 'mixed'; 
        const selectedPool = questionBank[roomCategory];
        const randomQuestion = selectedPool[Math.floor(Math.random() * selectedPool.length)];
        
        update(ref(db, 'rooms/' + currentRoom), {
            question: randomQuestion,
            p1Answer: "",
            p2Answer: ""
        });
    });
});

// REAL-TIME SYNC MAGIC
function listenToRoom(roomCode) {
    onValue(ref(db, 'rooms/' + roomCode), (snapshot) => {
        const data = snapshot.val();
        if(!data) return;

        questionText.innerText = data.question;
        const myAnswer = isPlayer1 ? data.p1Answer : data.p2Answer;
        const partnerAnswer = isPlayer1 ? data.p2Answer : data.p1Answer;

        // RESET UI IF IT'S A NEW QUESTION
        if (myAnswer === "" && partnerAnswer === "") {
            myAnswerInput.value = "";
            submitBtn.innerText = "Submit";
            submitBtn.disabled = false;
            partnerAnswerDisplay.innerText = "Waiting...";
            nextBtn.classList.add('hidden'); // Hide the Next button again
        }
        // IF BOTH HAVE ANSWERED
        else if (partnerAnswer) {
            if (myAnswer) {
                partnerAnswerDisplay.innerText = partnerAnswer;
                nextBtn.classList.remove('hidden'); // Reveal the Next button!
            } else {
                partnerAnswerDisplay.innerText = "Partner answered! Waiting for you...";
            }
        } 
        // WAITING ON PARTNER
        else {
            partnerAnswerDisplay.innerText = "Waiting...";
        }
    });
}

function enterGameUI(code) {
    setupSection.classList.add('hidden');
    gameSection.classList.remove('hidden');
    roomDisplay.innerText = code;
}

