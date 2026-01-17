// ======================
// CANVAS SETUP
// ======================
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// ======================
// AUDIO
// ======================
const sliceSound = document.getElementById("sliceSound");
const throwSound = document.getElementById("throwSound");

// ======================
// INPUT & SLICE TRAIL
// ======================
let trail = [];
let lastPoint = null;

function addPoint(x, y) {
  const now = performance.now();
  const point = { x, y, time: now };

  if (lastPoint) {
    const dx = x - lastPoint.x;
    const dy = y - lastPoint.y;
    const dt = now - lastPoint.time;
    const velocity = Math.sqrt(dx * dx + dy * dy) / dt;

    if (velocity > 0.5) {
      sliceSound.currentTime = 0;
      sliceSound.play();
    }
  }

  trail.push(point);
  if (trail.length > 12) trail.shift();
  lastPoint = point;
}

canvas.addEventListener("touchmove", e => {
  const t = e.touches[0];
  addPoint(t.clientX, t.clientY);
});

canvas.addEventListener("mousemove", e => {
  if (e.buttons === 1) {
    addPoint(e.clientX, e.clientY);
  }
});

canvas.addEventListener("touchend", () => {
  trail = [];
  lastPoint = null;
});

// ======================
// DRAW SLICE TRAIL
// ======================
function drawTrail() {
  if (trail.length < 2) return;

  ctx.strokeStyle = "rgba(0,255,255,0.7)";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(trail[0].x, trail[0].y);
  for (let p of trail) ctx.lineTo(p.x, p.y);
  ctx.stroke();
}

// ======================
// FRUIT CLASS
// ======================
class Fruit {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 60;
    this.vx = (Math.random() - 0.5) * 6;
    this.vy = -Math.random() * 14 - 12;
    this.radius = 40;
    this.sliced = false;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.4;
  }

  draw() {
    ctx.fillStyle = "#ff4d4d";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  checkSlice() {
    for (let p of trail) {
      const dx = this.x - p.x;
      const dy = this.y - p.y;
      if (Math.sqrt(dx * dx + dy * dy) < this.radius) {
        this.sliced = true;
        score++;
        break;
      }
    }
  }
}

// ======================
// GAME STATE
// ======================
let fruits = [];
let score = 0;

// ======================
// SPAWN FRUITS
// ======================
function spawnFruit() {
  fruits.push(new Fruit());
  throwSound.currentTime = 0;
  throwSound.play();
}

setInterval(spawnFruit, 800);

// ======================
// DRAW UI
// ======================
function drawScore() {
  ctx.fillStyle = "#00ffff";
  ctx.font = "48px GangOfThree";
  ctx.fillText(`SCORE ${score}`, 30, 60);
}

// ======================
// MAIN LOOP
// ======================
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawTrail();
  drawScore();

  fruits.forEach(fruit => {
    fruit.update();
    fruit.checkSlice();
    if (!fruit.sliced) fruit.draw();
  });

  fruits = fruits.filter(f => f.y < canvas.height + 100 && !f.sliced);

  requestAnimationFrame(gameLoop);
}

gameLoop();
