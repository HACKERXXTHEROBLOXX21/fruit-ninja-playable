const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const menu = document.getElementById("menu");
const gameOverScreen = document.getElementById("gameOver");
const playBtn = document.getElementById("playBtn");
const replayBtn = document.getElementById("replayBtn");

let state = "MENU";
let score = 0;
let lives = 3;
let fruits = [];

playBtn.onclick = startGame;
replayBtn.onclick = startGame;

function startGame() {
  state = "PLAYING";
  score = 0;
  lives = 3;
  fruits = [];
  menu.style.display = "none";
  gameOverScreen.style.display = "none";
  canvas.style.display = "block";
}

class Fruit {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 30;
    this.r = 25;
    this.speed = Math.random() * 3 + 4;
  }

  update() {
    this.y -= this.speed;
    if (this.y < -50) {
      lives--;
      this.remove();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
  }

  remove() {
    fruits = fruits.filter(f => f !== this);
  }
}

canvas.addEventListener("mousemove", e => {
  fruits.forEach(f => {
    const dx = e.clientX - f.x;
    const dy = e.clientY - f.y;
    if (Math.sqrt(dx*dx + dy*dy) < f.r) {
      score++;
      f.remove();
    }
  });
});

function drawHUD() {
  ctx.fillStyle = "cyan";
  ctx.font = "28px GangOfThree";
  ctx.fillText(`SCORE ${score}`, 30, 50);

  ctx.fillStyle = "red";
  ctx.fillText("X ".repeat(lives), 30, 90);
}

function gameLoop() {
  if (state !== "PLAYING") return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (Math.random() < 0.02) {
    fruits.push(new Fruit());
  }

  fruits.forEach(f => {
    f.update();
    f.draw();
  });

  drawHUD();

  if (lives <= 0) {
    state = "GAME_OVER";
    canvas.style.display = "none";
    gameOverScreen.style.display = "flex";
    return;
  }

  requestAnimationFrame(gameLoop);
}

setInterval(() => {
  if (state === "PLAYING") gameLoop();
}, 1000 / 60);
