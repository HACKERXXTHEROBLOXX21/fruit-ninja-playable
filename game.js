const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let fruits = [];
let trails = [];
let score = 0;
let lives = 3;
let gameRunning = false;
let gameStarted = false;

const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const gameOverEl = document.getElementById("gameOver");
const startScreen = document.getElementById("startScreen");

let slicing = false;

// ---------------- FRUIT ----------------
class Fruit {
  constructor(isBomb = false) {
    this.isBomb = isBomb;
    this.radius = 30;
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 60;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = -(Math.random() * 12 + 18);
    this.hit = false;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.5;

    if (this.y > canvas.height + 80 && !this.hit && !this.isBomb) {
      this.hit = true;
      loseLife();
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
  if (!gameRunning || !gameStarted) return;

  let isBomb = Math.random() < 0.2;
  fruits.push(new Fruit(isBomb));
}

// ---------------- SLICE ----------------
function slice(x, y) {
  trails.push({ x, y, life: 15 });

  fruits.forEach(fruit => {
    const dx = x - fruit.x;
    const dy = y - fruit.y;
    if (Math.hypot(dx, dy) < fruit.radius && !fruit.hit) {
      fruit.hit = true;

      if (fruit.isBomb) {
        loseLife();
      } else {
        score++;
        scoreEl.textContent = `SCORE ${score}`;
      }
    }
  });
}

// ---------------- LIVES ----------------
function loseLife() {
  lives--;
  livesEl.textContent = "X".repeat(lives);

  if (lives <= 0) endGame();
}

// ---------------- GAME FLOW ----------------
function startGame() {
  gameStarted = true;
  gameRunning = true;
  startScreen.style.display = "none";
}

function endGame() {
  gameRunning = false;
  gameStarted = false;
  gameOverEl.style.display = "flex";
}

function restartGame() {
  fruits = [];
  trails = [];
  score = 0;
  lives = 3;

  scoreEl.textContent = "SCORE 0";
  livesEl.textContent = "XXX";
  gameOverEl.style.display = "none";

  gameStarted = true;
  gameRunning = true;
}

// ---------------- INPUT ----------------
canvas.addEventListener("mousedown", e => slicing = true);
canvas.addEventListener("mouseup", () => slicing = false);
canvas.addEventListener("mousemove", e => slicing && slice(e.clientX, e.clientY));

canvas.addEventListener("touchstart", e => slicing = true);
canvas.addEventListener("touchend", () => slicing = false);
canvas.addEventListener("touchmove", e => {
  if (slicing) {
    const t = e.touches[0];
    slice(t.clientX, t.clientY);
  }
});

// ---------------- LOOP ----------------
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // trails
  trails.forEach((t, i) => {
    ctx.fillStyle = `rgba(0,255,255,${t.life / 15})`;
    ctx.beginPath();
    ctx.arc(t.x, t.y, 5, 0, Math.PI * 2);
    ctx.fill();
    t.life--;
    if (t.life <= 0) trails.splice(i, 1);
  });

  // fruits
  fruits.forEach((f, i) => {
    f.update();
    f.draw();
    if (f.hit) fruits.splice(i, 1);
  });

  requestAnimationFrame(animate);
}

setInterval(spawnFruit, 900);
animate();

  for (let i = trails.length - 1; i >= 0; i--) {
    const t = trails[i];
    ctx.fillSt
