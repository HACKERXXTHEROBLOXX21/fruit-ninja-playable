const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let lives = 3;
let gameRunning = true;

const fruits = [];
const trail = [];

const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const gameOverEl = document.getElementById("gameOver");
const replayBtn = document.getElementById("replayBtn");

class Fruit {
  constructor(isBomb = false) {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 40;
    this.radius = 30;
    this.speedY = -(Math.random() * 10 + 12);
    this.speedX = Math.random() * 6 - 3;
    this.isBomb = isBomb;
    this.hit = false;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += 0.3;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.isBomb ? "red" : "lime";
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function spawnFruit() {
  if (!gameRunning) return;
  const bombChance = Math.random() < 0.2;
  fruits.push(new Fruit(bombChance));
}

setInterval(spawnFruit, 800);

function drawTrail() {
  for (let i = 0; i < trail.length; i++) {
    ctx.strokeStyle = `rgba(0,255,255,${i / trail.length})`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(trail[i].x, trail[i].y);
    if (trail[i + 1]) ctx.lineTo(trail[i + 1].x, trail[i + 1].y);
    ctx.stroke();
  }
}

function loseLife() {
  lives--;
  livesEl.textContent = "✖ ".repeat(lives);

  if (lives <= 0) {
    gameOver();
  }
}

function gameOver() {
  gameRunning = false;
  gameOverEl.classList.remove("hidden");
}

function resetGame() {
  score = 0;
  lives = 3;
  fruits.length = 0;
  trail.length = 0;
  gameRunning = true;

  scoreEl.textContent = "SCORE 0";
  livesEl.textContent = "✖ ✖ ✖";
  gameOverEl.classList.add("hidden");
}

function slice(x, y) {
  if (!gameRunning) return;

  fruits.forEach(fruit => {
    const dx = x - fruit.x;
    const dy = y - fruit.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < fruit.radius && !fruit.hit) {
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

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  fruits.forEach((fruit, i) => {
