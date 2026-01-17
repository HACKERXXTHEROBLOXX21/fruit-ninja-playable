const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let fruits = [];
let trails = [];
let score = 0;
let lives = 3;
let gameRunning = true;

const sliceSound = new Audio("assets/sounds/slice.wav");
const bombSound = new Audio("assets/sounds/bomb.wav");
const gameOverSound = new Audio("assets/sounds/gameover.wav");

const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const gameOverEl = document.getElementById("gameOver");

let lastX = 0;
let lastY = 0;
let slicing = false;

// ---------------- FRUIT CLASS ----------------
class Fruit {
  constructor(isBomb = false) {
    this.isBomb = isBomb;
    this.radius = 30;
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 50;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = - (Math.random() * 12 + 15);
    this.hit = false;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.5;

    if (this.y > canvas.height + 60 && !this.hit && !this.isBomb) {
      loseLife();
      this.hit = true;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.isBomb ? "#ff3333" : "#00ff88";
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ---------------- SPAWN ----------------
function spawnFruit() {
  if (!gameRunning) return;

  const bombExists = fruits.some(f => f.isBomb);
  let isBomb = false;

  if (!bombExists && Math.random() < 0.15) {
    isBomb = true;
  }

  fruits.push(new Fruit(isBomb));
}

// ---------------- SLICE ----------------
function slice(x, y) {
  trails.push({ x, y, life: 15 });

  for (let fruit of fruits) {
    const dx = x - fruit.x;
    const dy = y - fruit.y;
    const dist = Math.hypot(dx, dy);

    if (dist < fruit.radius && !fruit.hit) {
      fruit.hit = true;

      if (fruit.isBomb) {
        bombSound.play();
        loseLife();
      } else {
        sliceSound.play();
        score++;
        scoreEl.textContent = `SCORE ${score}`;
      }
    }
  }
}

// ---------------- LIVES ----------------
function loseLife() {
  lives--;
  livesEl.textContent = "X".repeat(lives);

  if (lives <= 0) {
    endGame();
  }
}

// ---------------- GAME OVER ----------------
function endGame() {
  gameRunning = false;
  gameOverSound.play();
  gameOverEl.style.display = "flex";
}

// ---------------- RESTART ----------------
function restartGame() {
  fruits = [];
  trails = [];
  score = 0;
  lives = 3;
  gameRunning = true;

  scoreEl.textContent = "SCORE 0";
  livesEl.textContent = "XXX";
  gameOverEl.style.display = "none";
}

// ---------------- INPUT ----------------
function startSlice(x, y) {
  slicing = true;
  lastX = x;
  lastY = y;
}

function moveSlice(x, y) {
  if (!slicing) return;
  slice(x, y);
  lastX = x;
  lastY = y;
}

function endSlice() {
  slicing = false;
}

canvas.addEventListener("mousedown", e => startSlice(e.clientX, e.clientY));
canvas.addEventListener("mousemove", e => moveSlice(e.clientX, e.clientY));
canvas.addEventListener("mouseup", endSlice);

canvas.addEventListener("touchstart", e => {
  const t = e.touches[0];
  startSlice(t.clientX, t.clientY);
});

canvas.addEventListener("touchmove", e => {
  const t = e.touches[0];
  moveSlice(t.clientX, t.clientY);
});

canvas.addEventListener("touchend", endSlice);

// ---------------- LOOP ----------------
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // trails
  for (let i = trails.length - 1; i >= 0; i--) {
    const t = trails[i];
    ctx.fillSt
