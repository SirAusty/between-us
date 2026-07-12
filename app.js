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
    loyalty: [ 
        // 🔥 PASTE YOUR ENTIRE 100-QUESTION ARRAY HERE 🔥
        "What's a secret dream you haven't told many people about?",
        "If you could teleport anywhere right now, where would we go?",
        "What is the most embarrassing thing you've ever done?",
        "What's a skill you wish you had but never learned?",
        "If you had a whole free day tomorrow, how would you spend it?",
        "What's a rule you think everyone should live by?",
        "What's the best decision you've ever made?",
        "What's something you believed as a kid that turned out to be wrong?",
        "If you could master any instrument overnight, which one?",
        "What's a place you've never been but feel drawn to?",
        "What's the most spontaneous thing you've ever done?",
        "What's a small thing that instantly makes your day better?",
        "If you could relive one year of your life, which one?",
        "What's something you're weirdly proud of?",
        "What's a habit you're trying to build right now?",
        "What's the last thing that made you laugh until it hurt?",
        "If you had to move to a new city tomorrow, where would you go?",
        "What's a food you were sure you hated but actually love?",
        "What's a piece of advice you'd give your younger self?",
        "If you could only keep five possessions, what would they be?",
        "What's something you've changed your mind about recently?",
        "What's the weirdest dream you remember having?",
        "What's a talent you wish was more socially useful?",
        "What's your go-to karaoke song?",
        "If you won a trophy for something totally random, what would it be for?",
        "What's a fear you've actually overcome?",
        "What's the best gift you've ever received?",
        "If you could time travel once, forward or backward?",
        "What's a tradition you hope never dies out?",
        "What's a book, show, or movie that changed how you think?",
        "What's a hill you'd die on in an argument?",
        "What's something you do that you think is completely normal but isn't?",
        "If you could have dinner with anyone, living or not, who?",
        "What's a compliment that stuck with you for years?",
        "What's your most unpopular opinion?",
        "What's a smell that instantly brings back a memory?",
        "What's something you've never told anyone in this room?",
        "If your life was a movie, what genre would it be?",
        "What's the last thing you Googled?",
        "What's a goal you're working toward right now?",
        "What's the bravest thing you've ever done?",
        "What's a moment you felt truly proud of yourself?",
        "What's something you learned the hard way?",
        "If you could instantly become an expert in one thing, what?",
        "What's a memory that still makes you emotional?",
        "What's something people always get wrong about you?",
        "What's the most spontaneous trip you've ever taken?",
        "What's a childhood toy or item you wish you still had?",
        "What's the best piece of advice anyone's given you?",
        "If today was your last day, what would you want to do?",
        "What's something you're currently overthinking?",
        "What's a place that feels like home even if you don't live there?",
        "What's a lesson your family taught you that stuck?",
        "What's a moment you wish you could freeze in time?",
        "What's the most useless fact you know?",
        "What's a risk that actually paid off for you?",
        "What's something you're better at than most people realize?",
        "What's a mistake that taught you something important?",
        "If you could ask a stranger one question, what would it be?",
        "What's a song lyric that describes you right now?",
        "What's something you've always wanted to try but haven't?",
        "What's the kindest thing a stranger has done for you?",
        "What's a habit from childhood you never grew out of?",
        "What's your idea of a perfect Sunday?",
        "What's something you're grateful for that people overlook?",
        "What's the last thing that genuinely surprised you?",
        "What's a piece of your personality you got from a parent?",
        "What's something you're curious about but never looked into?",
        "What's a moment you felt completely at peace?",
        "What's the best trade you've ever made?",
        "What's a decision you're still glad you made?",
        "What's something you wish more people asked you about?",
        "What's a memory you associate with a specific song?",
        "What's something you do differently than everyone else you know?",
        "What's a challenge that made you stronger?",
        "What's a place you'd love to live for just one year?",
        "What's the last thing you did that scared you a little?",
        "What's something you've gotten better at with age?",
        "What's a story you tell often but never get tired of?",
        "What's something small that always cheers you up?",
        "What's a version of yourself from the past you miss?",
        "What's the last thing you learned that blew your mind?",
        "What's your idea of true success?",
        "What's a question you wish people asked you more?",
        "What's a lesson you had to learn more than once?",
        "What's something you do to reset when you're stressed?",
        "What's a moment you felt completely understood?",
        "What's a small win from this week you're proud of?",
        "What's a topic you could listen to a podcast about for hours?",
        "What's something you used to be scared of but aren't anymore?",
        "What's a habit you picked up from a friend?",
        "What's the most memorable meal you've ever had?",
        "What's a goal you had as a kid that you actually achieved?",
        "What's something you think is underrated?",
        "What's something you think is overrated?",
        "What's a conversation that changed your perspective?",
        "What's a season of life you look back on fondly?",
        "What's something you hope people remember about you?",
        "What's a question you've never been asked but wish you were?",
        "If you had to describe your current mood as weather, what would it be?"
    ],
    couples: [
        "What's your favorite memory of us?",
        "If you could relive one day with me, which day would it be?",
        "What is one thing I do that makes you smile?",
        "What is your biggest relationship fear?",
        "What was your exact first impression of me?",
        "What's a small thing I do that you never get tired of?",
        "What's the moment you knew you were falling for me?",
        "What's a habit of mine you secretly love?",
        "What's the most romantic thing we've ever done together?",
        "What song feels like 'our song' even if it's unofficial?",
        "What's a fight we had that made us stronger?",
        "What's something about our relationship you never want to change?",
        "What's a future memory you're most looking forward to making?",
        "What's a nickname you'd never say out loud but think in your head?",
        "What's the first thing you noticed about me?",
        "What's a moment you felt the most loved by me?",
        "What's something you think I don't say enough?",
        "What's a trip we took that you think about often?",
        "What's a quality of mine you didn't expect to fall for?",
        "What's something you've learned about love from being with me?",
        "What's a way I show love without saying the words?",
        "What's the silliest reason you've ever been mad at me?",
        "What's a tradition you want us to start?",
        "What's something you想 changed your mind about after meeting me?",
        "What's a moment you felt proudest to call me yours?",
        "What's a food you'd want me to cook for you every week?",
        "What's the most 'us' inside joke we have?",
        "What's something I do that instantly calms you down?",
        "What's a compliment you wish you gave me more often?",
        "What's a dream vacation you picture us taking together?",
        "What's something you find effortlessly attractive about me?",
        "What's a moment early on when you knew this was different?",
        "What's a way we've grown closer over time?",
        "What's something you'd want future us to remember about right now?",
        "What's a way I've surprised you in this relationship?",
        "What's your favorite way for us to spend a lazy day?",
        "What's something you appreciate that I do but never mention?",
        "What's a moment you felt safest with me?",
        "What's a small gesture from me that meant more than I realized?",
        "What's something you hope never changes between us?",
        "What's a memory that always makes you laugh when you think of it?",
        "What's a goal you want us to work toward together?",
        "What's your favorite thing to do with me on a rainy day?",
        "What's a moment you were the most impressed by me?",
        "What's something about me you'd brag about to a friend?",
        "What's a way you think I've changed since we met?",
        "What's the most 'you and me against the world' moment we've had?",
        "What's a way I make hard days easier for you?",
        "What's something small I do that feels like home to you?",
        "What's a milestone coming up that you're excited about?",
        "What's a habit of yours that only I know about?",
        "What's the best advice you'd give a new couple?",
        "What's something you think we do better together than most couples?",
        "What's a fear you've felt safe enough to share only with me?",
        "What's a random memory of us that randomly makes you smile?",
        "What's something you've never told me but think about often?",
        "What's a way you show me you're thinking about me during the day?",
        "What's the most 'you' gift you've ever given me?",
        "What's a moment you felt butterflies again after being together a while?",
        "What's something you'd want to relive from our first few months?",
        "What's a way our relationship has surprised you compared to past ones?",
        "What's something small you do to make sure I feel appreciated?",
        "What's a quality of mine you hope our future kids inherit?",
        "What's a moment you felt like we were truly a team?",
        "What's something you think makes our relationship different?",
        "What's a place that would be perfect for us to grow old near?",
        "What's a way I've helped you become a better version of yourself?",
        "What's something you'd want to try together that we haven't yet?",
        "What's a moment you felt the most grateful to have me?",
        "What's your favorite thing about how we communicate?",
        "What's something you've never admitted you find cute about me?",
        "What's a way you picture us celebrating a big future milestone?",
        "What's the most spontaneous thing we've done together?",
        "What's something about me that made you trust me early on?",
        "What's a way you'd want to be comforted on a bad day?",
        "What's a moment you felt most proud to introduce me to someone?",
        "What's something that instantly reminds you of me when you're apart?",
        "What's a way you think we balance each other out?",
        "What's the best inside joke that started completely by accident?",
        "What's something you hope we still do together in twenty years?",
        "What's a way I've challenged you to grow?",
        "What's your favorite way I say 'I love you' without saying it?",
        "What's a memory from our early days you wish you could relive?",
        "What's something you think our friends would say makes us work?",
        "What's a small ritual we have that means a lot to you?",
        "What's a way you'd want to be surprised by me?",
        "What's something about our future you're most excited for?",
        "What's a moment you felt completely yourself around me?",
        "What's a way you think I've made your life easier?",
        "What's something you'd want to tell past-you about us?",
        "What's the most romantic place we've ever been together?",
        "What's a moment you felt like the luckiest person in the world?",
        "What's something you'd change about how we argue, if anything?",
        "What's a habit of mine that you low-key mimic now?",
        "What's your favorite thing to overhear me say about you?",
        "What's a way you'd want to grow together next year?",
        "What's something you never get tired of doing with me?",
        "What's a memory that instantly makes you feel closer to me?",
        "Sum up us in exactly one sentence."
    ],
    funny: [
        "Which celebrity would definitely survive a zombie apocalypse?",
        "What is your weirdest habit?",
        "If animals could talk, which one would be the rudest?",
        "What's the most ridiculous thing you've argued about?",
        "If you had a theme song that played whenever you walked in, what would it be?",
        "What's the weirdest thing you've ever eaten on a dare?",
        "If you had to be reincarnated as an object, what would you be?",
        "What's a food combo you love that grosses everyone else out?",
        "Which fictional villain has the best fashion sense?",
        "If you were a conspiracy theorist, what would your theory be?",
        "What's the most useless superpower you can think of?",
        "If your pet could talk for one day, what would it say about you?",
        "What's a dance move you're weirdly confident about?",
        "If you had to survive on one snack forever, what would it be?",
        "What's the worst fashion trend you actually loved at the time?",
        "If you woke up as a cartoon character, who would you want to be?",
        "What's the most dramatic reaction you've had to something small?",
        "If your life had a laugh track, when would it play the most?",
        "What's a totally irrational thing that annoys you?",
        "If you were a kitchen appliance, which one would you be and why?",
        "What's the weirdest talent you have that nobody asked for?",
        "If you had to enter a room with a dramatic entrance song, what's playing?",
        "What's the most chaotic thing you've done for a group photo?",
        "If your search history became a movie title, what would it be called?",
        "What's the silliest thing that's made you cry-laugh?",
        "If you were a flavor of chip, which one and why?",
        "What's your most unhinged 3am thought?",
        "If you had to give a TED talk on something ridiculous, what's the topic?",
        "What's the weirdest excuse you've ever used to leave somewhere?",
        "If animals had social media, which one would go viral the most?",
        "What's the most 'main character' thing you've ever done?",
        "If you had a warning label, what would it say?",
        "What's a food you refuse to share, no matter what?",
        "If you were a sound effect, what would you be?",
        "What's the weirdest compliment you've ever received?",
        "If your emotions had a theme park ride, what would it be called?",
        "What's the most ridiculous thing you've panic-bought?",
        "If you had to fight one household item, which would win?",
        "What's the most 'you' way to embarrass yourself in public?",
        "If you were a meme, which one would you be?",
        "What's your go-to fake laugh in an awkward situation?",
        "If you had to survive a horror movie, what's your fatal mistake?",
        "What's the weirdest thing you've Googled at 2am?",
        "If you were a font, which one matches your personality?",
        "What's the most chaotic thing that's happened at a family gathering?",
        "If your life narrated by a nature documentary voice, what would it say?",
        "What's the weirdest nickname you've ever had?",
        "If you had to pick a spirit vegetable, what would it be?",
        "What's your go-to move when you forget someone's name?",
        "If you were banned from one store forever, which would you choose?",
        "What's the most dramatic you've been over losing a game?",
        "If your snoring had a soundtrack, what genre would it be?",
        "What's the weirdest thing you've said in your sleep?",
        "If you had to describe your walk as a type of weather, what is it?",
        "What's the most 'grandma energy' thing you do?",
        "If you were the villain in a cartoon, what's your evil plan?",
        "What's the weirdest place you've fallen asleep?",
        "If you could only communicate in movie quotes for a day, would you survive?",
        "What's your most iconic clumsy moment?",
        "If you had a mascot, what animal would represent you?",
        "What's the weirdest gift you've ever given someone?",
        "If you were a text notification sound, which would you be?",
        "What's the most ridiculous fear you've ever had as a kid?",
        "If your life was a reality show, what would the tagline be?",
        "What's the weirdest thing that's ever scared you unnecessarily?",
        "If you could instantly win one dumb argument forever, which one?",
        "What's your go-to weird face in photos?",
        "If you were a type of chaos, which kind would you be?",
        "What's the most ridiculous thing you've done to avoid small talk?",
        "If you had a catchphrase, what would it be?",
        "What's the weirdest thing you collect without meaning to?",
        "If your stomach growling had subtitles, what would they say?",
        "What's the most unnecessary drama you've ever caused?",
        "If you were a Wi-Fi network name, what would you be called?",
        "What's the silliest superstition you actually believe?",
        "If your laugh was a sound effect, what would it be?",
        "What's the weirdest item you'd grab in a fire?",
        "If you had a theme park ride based on your mood swings, what's it called?",
        "What's the most dramatic exit you've made from a room?",
        "If you were a discontinued snack, which one and why?",
        "What's your go-to excuse for not answering the phone?",
        "If you had to be a mascot for a random object, what would it be?",
        "What's the weirdest 'talent' you'd put on a resume as a joke?",
        "If your inner monologue had a voice actor, who would it be?",
        "What's the most chaotic thing you've done while sleep-deprived?",
        "If you were a type of weather, which extreme would you be?",
        "What's the silliest thing you've ever been proud of?",
        "If your life had subtitles, what would they say right now?",
        "What's the weirdest thing you've said to a pet expecting a response?",
        "If you were a horror movie character, how would you die first?",
        "What's the most ridiculous item you've kept 'just in case'?",
        "If your energy today was a GIF, which one would it be?",
        "What's the weirdest reason you've ever laughed in a serious moment?",
        "If you had a slogan on a T-shirt, what would it say?",
        "What's the most 'unserious' thing you've said in a serious meeting?",
        "If you were a type of internet troll, what kind would you be?",
        "What's the weirdest thing you've ever high-fived by accident?",
        "If your life was one long blooper reel, what's the funniest clip?",
        "What's the most ridiculous nickname a friend has given you?",
        "Sum yourself up using only a snack food."
    ],
    loyalty: [ 
        "What am I 100% ordering without even opening the menu?",
        "Say the phrase I use way too much — you know the one.",
        "Which celebrity do I lowkey remind you of?",
        "What do I act like I hate but secretly love?",
        "What's my biggest green flag, be honest?",
        "What would I never, ever pay money for?",
        "First thing I'd buy if I won the lottery tonight?",
        "Who's starting drama by accident within the hour — me or you?",
        "What am I eating the second I've had a bad day?",
        "Which song makes you think 'this is so them'?",
        "What word do I say so much it's lost meaning?",
        "What's the one thing I'd turn the car around for?",
        "What's my pettiest pet peeve?",
        "What app do I open before I've even opened my eyes?",
        "Describe my go-to outfit when I want to look put together.",
        "Where am I going the second I have vacation days saved up?",
        "What food could I eat every single day and never get sick of?",
        "What's a talent I have that's completely useless in real life?",
        "What can I do that would actually impress people?",
        "Which fictional character would I 100% simp for?",
        "What do I always forget when I leave the house?",
        "How do I actually unwind after a rough week?",
        "First splurge if I suddenly had a million dollars?",
        "Which animal has my exact energy?",
        "What's a fear I have that makes zero logical sense?",
        "What's something I enjoy that I'd never admit out loud?",
        "Which emoji is basically my personality?",
        "What's my go-to excuse when I'm running late?",
        "What's the single funniest thing you've ever seen me do?",
        "What do I complain about on a weekly basis?",
        "Who actually wins when we argue?",
        "What's my biggest red flag — don't hold back.",
        "What am I raiding the fridge for at 1am?",
        "What's something I'll never spend a dollar on?",
        "Which season feels the most 'me' and why?",
        "If I got one superpower, what would I pick?",
        "Describe my perfect, do-nothing weekend.",
        "What did little-kid me want to be when I grew up?",
        "What have I been 'about to start' for way too long?",
        "What's the first thing I clock when I meet someone new?",
        "What movie could I rewatch on loop forever?",
        "How do I celebrate when something good happens?",
        "What instantly turns my mood around?",
        "What's a habit of mine that everyone notices immediately?",
        "Which emoji do I put in basically every text?",
        "What's my favorite kind of weather?",
        "What game am I always trying to get people to play?",
        "What's a habit I have that's a little embarrassing?",
        "Zombie apocalypse — what's the one item I'm grabbing?",
        "Who am I texting the second something big happens?",
        "What's my order at my go-to fast food spot?",
        "What topic could I talk about nonstop for an hour?",
        "What's the weirdest food combo I swear by?",
        "What compliment actually gets to me every time?",
        "What am I secretly bad at but will never admit it?",
        "What's a core memory from my childhood?",
        "Where do I go when I need to feel calm?",
        "What have I been putting off for way too long?",
        "What kind of gift actually gets me every time?",
        "Which holiday matches my vibe the most?",
        "What am I guaranteed to forget when I'm packing for a trip?",
        "What do I want to talk about at 2am and nowhere else?",
        "Who's more stubborn — me or you?",
        "Who's laughing at the worst possible moment — me or you?",
        "Who's getting lost with full confidence — me or you?",
        "Who's dancing first at a party — me or you?",
        "Who's crying at the movie neither of us admits to — me or you?",
        "Who'd actually survive longer without a phone — me or you?",
        "Who's more likely to have everyone in tears laughing — me or you?",
        "Who's forgetting a birthday this year — me or you?",
        "Who's got the bigger online shopping problem — me or you?",
        "Who can fall asleep literally anywhere — me or you?",
        "Who's coming home with a random pet someday — me or you?",
        "Who's more likely to end up famous — me or you?",
        "Who's sending a text to the wrong person first — me or you?",
        "Who's dragging the other into a random adventure — me or you?",
        "Who's cracking their phone screen next — me or you?",
        "What's our inside joke that nobody else gets?",
        "What's one memory of us you know I'll never let go of?",
        "What's the nicest thing I've ever done for you?",
        "What's the nicest thing you've ever done for me?",
        "What's something only the two of us would get?",
        "What's the funniest thing that's ever happened to us together?",
        "Which trip we took together do you think about the most?",
        "What's the most chaotic thing we've ever lived through together?",
        "What's something we still laugh about years later?",
        "What's a hard moment we actually handled well together?",
        "What's something you think I respect about you?",
        "What do you think I'd say I admire about you?",
        "What's something about you I bring up all the time?",
        "What's a habit of mine you've caught yourself doing?",
        "What's a habit of yours I've clearly picked up?",
        "What nickname actually fits me best?",
        "What would I go to war defending, no question asked?",
        "What am I always telling people to try?",
        "What opinion of mine is never, ever changing?",
        "What am I probably Googling right this second?",
        "What's something that's completely off-limits to joke about with me?",
        "What's my guilty pleasure I pretend isn't one?",
        "What's a challenge I'd actually be excited to take on?",
        "What would I say yes to without even thinking?",
        "What would I shut down immediately, no hesitation?",
        "Which photo of us do you think I have saved?",
        "Desert island — what's the one thing I'm bringing?",
        "What's the best advice I've ever given you?",
        "What's the best advice you've ever given me?",
        "Sum me up in exactly one sentence."
    ]
};

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

