// script.js

const sentences = [
  "The quick brown fox jumps over the lazy dog.",
  "Typing fast requires practice and precision.",
  "Artificial intelligence is transforming the world.",
  "Every sentence you type helps you improve.",
  "Discipline and consistency beat motivation every time.",
  "A well-crafted sentence builds great typing skills."
];

const input = document.getElementById("input");
const sentenceElement = document.getElementById("sentence");
const shadowElement = document.getElementById("shadow");
const timerElement = document.getElementById("timer");
const resultElement = document.getElementById("result");
const startBtn = document.getElementById("startBtn");
const timeSelector = document.getElementById("timeSelector");

let currentSentence = "";
let correctChars = 0;
let totalTyped = 0;
let timer = null;
let timeLeft = 120;
let isRunning = false;
let liveWPM = 0;

// Sound
const typeSound = new Audio("https://www.soundjay.com/mechanical/keyboard-1.mp3");
typeSound.volume = 0.2;

// Dark mode toggle
const themeBtn = document.createElement("button");
themeBtn.innerText = "🌙 Toggle Theme";
themeBtn.style.marginTop = "10px";
themeBtn.style.padding = "6px 12px";
themeBtn.style.cursor = "pointer";
document.querySelector(".container").appendChild(themeBtn);

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Load new sentence
function loadNewSentence() {
  currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
  sentenceElement.textContent = currentSentence;
  shadowElement.innerHTML = "";
  input.value = "";
  updateShadow();
}

// Update visual feedback
function updateShadow() {
  const typed = input.value;
  shadowElement.innerHTML = "";

  for (let i = 0; i < currentSentence.length; i++) {
    const expectedChar = currentSentence[i];
    const typedChar = typed[i];
    const span = document.createElement("span");
    span.textContent = expectedChar;

    if (typedChar == null) {
      span.style.opacity = "0.4";
    } else if (typedChar === expectedChar) {
      span.style.color = "#4caf50";
      span.style.fontWeight = "bold";
    } else {
      span.style.borderBottom = "2px solid #e53935";
      span.style.color = "#e53935";
    }

    shadowElement.appendChild(span);
  }
}

// Start the test
function startTest() {
  isRunning = true;
  correctChars = 0;
  totalTyped = 0;
  timeLeft = parseInt(timeSelector.value);
  timerElement.textContent = `Time: ${timeLeft}s`;
  resultElement.innerHTML = "";
  input.disabled = false;
  input.focus();
  loadNewSentence();

  if (timer) clearInterval(timer);

  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Time: ${timeLeft}s`;
  
    const elapsedTime = (parseInt(timeSelector.value) - timeLeft) / 60; // minutes elapsed
  
    if (elapsedTime > 0) {
      liveWPM = Math.round((correctChars / 5) / elapsedTime);
    } else {
      liveWPM = 0;
    }
  
    if (timeLeft <= 0) {
      clearInterval(timer);
      isRunning = false;
      input.disabled = true;
      const accuracy = totalTyped === 0 ? 100 : Math.round((correctChars / totalTyped) * 100);
      resultElement.innerHTML = `<h2>Test Complete!</h2><p>WPM: ${liveWPM}</p><p>Accuracy: ${accuracy}%</p>`;
    } else {
      resultElement.innerHTML = `<p>Live WPM: ${liveWPM}</p>`;
    }
  }, 1000);
}

// Track input
let startTime = null; // to track when typing started

input.addEventListener("input", () => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevents default newline behavior
  
      // Skip to next sentence
      input.value = "";
      loadNewSentence();
      startTime = new Date(); // restart timing for new sentence
      correctChars = 0;
      totalTyped = 0;
      updateShadow();
    }
  });
  if (!isRunning) return;

  if (!startTime) startTime = new Date(); // set start time on first key press

  const typed = input.value;
  totalTyped++;

  // Play typing sound
  typeSound.currentTime = 0;
  typeSound.play();

  // Calculate correct chars so far
  correctChars = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === currentSentence[i]) {
      correctChars++;
    }
  }

  // If full sentence typed (correct or incorrect)
  if (typed.length === currentSentence.length) {
    // Move to next sentence after Enter (or auto)
    if (typed === currentSentence) {
      // perfect match
      input.value = "";
      loadNewSentence();
      startTime = new Date(); // reset timer for new sentence start
      totalTyped = 0;
      correctChars = 0;
    } else {
      // not correct full sentence: you can require Enter to continue (optional)
      // For now, allow continue on enter key (handled separately)
    }
  }

  updateShadow();

  // Calculate live WPM
  const now = new Date();
  const elapsedMinutes = (now - startTime) / 1000 / 60;

  if (elapsedMinutes > 0) {
    liveWPM = Math.round((correctChars / 5) / elapsedMinutes);
  } else {
    liveWPM = 0;
  }

  resultElement.innerHTML = `<p>Live WPM: ${liveWPM}</p>`;
});

// Timer still counts down as before, but no WPM update inside timer anymore:
startBtn.addEventListener("click", () => {
  isRunning = true;
  correctChars = 0;
  totalTyped = 0;
  timeLeft = parseInt(timeSelector.value);
  timerElement.textContent = `Time: ${timeLeft}s`;
  resultElement.innerHTML = "";
  input.disabled = false;
  input.value = "";
  input.focus();
  loadNewSentence();
  startTime = null;

  if (timer) clearInterval(timer);

  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Time: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      isRunning = false;
      input.disabled = true;
      const accuracy = totalTyped === 0 ? 100 : Math.round((correctChars / totalTyped) * 100);
      resultElement.innerHTML = `<h2>Test Complete!</h2><p>WPM: ${liveWPM}</p><p>Accuracy: ${accuracy}%</p>`;
    }
  }, 1000);
});