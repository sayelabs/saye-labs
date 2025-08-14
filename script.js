const canvas = document.getElementById('particle-bg');
const ctx = canvas.getContext('2d');

function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
setCanvasSize();

let particlesArray = [];
let shootingStars = [];
const colors = ['#0A84FF', '#BF5AF2', '#FF9F0A', '#30D158', '#FFD60A', '#64D2FF'];

class Particle {
  constructor(x, y, dx, dy, size, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.size = size;
    this.color = color;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  update() {
    if (this.x > canvas.width || this.x < 0) this.dx *= -1;
    if (this.y > canvas.height || this.y < 0) this.dy *= -1;
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }
}

class ShootingStar {
  constructor() {
    this.reset();
  }
  reset() {
    const side = Math.floor(Math.random() * 4);
    const speed = (Math.random() * 5) + 4;
    if (side === 0) { // left
      this.x = 0; this.y = Math.random() * canvas.height;
      this.vx = speed; this.vy = (Math.random() - 0.5) * speed;
    } else if (side === 1) { // right
      this.x = canvas.width; this.y = Math.random() * canvas.height;
      this.vx = -speed; this.vy = (Math.random() - 0.5) * speed;
    } else if (side === 2) { // top
      this.x = Math.random() * canvas.width; this.y = 0;
      this.vx = (Math.random() - 0.5) * speed; this.vy = speed;
    } else { // bottom
      this.x = Math.random() * canvas.width; this.y = canvas.height;
      this.vx = (Math.random() - 0.5) * speed; this.vy = -speed;
    }
    this.len = (Math.random() * 120) + 20;
    this.size = (Math.random() * 1.5) + 0.2;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  draw() {
    const endX = this.x - this.vx * (this.len / 10);
    const endY = this.y - this.vy * (this.len / 10);
    const gradient = ctx.createLinearGradient(this.x, this.y, endX, endY);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.strokeStyle = gradient;
    ctx.lineWidth = this.size;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x > canvas.width + this.len || this.x < -this.len || this.y > canvas.height + this.len || this.y < -this.len) {
      this.reset();
    }
    this.draw();
  }
}

function init() {
  particlesArray = [];
  const numParticles = (canvas.height * canvas.width) / 9000;
  for (let i = 0; i < numParticles; i++) {
    const size = (Math.random() * 2) + 1;
    const x = (Math.random() * (window.innerWidth - size * 2)) + size * 2;
    const y = (Math.random() * (window.innerHeight - size * 2)) + size * 2;
    const dx = (Math.random() * 0.4) - 0.2;
    const dy = (Math.random() * 0.4) - 0.2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    particlesArray.push(new Particle(x, y, dx, dy, size, color));
  }
  shootingStars = [new ShootingStar(), new ShootingStar()];
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (const particle of particlesArray) particle.update();
  for (const star of shootingStars) star.update();
}

init();
animate();

window.addEventListener('resize', () => {
  setCanvasSize();
  init();
});

// Disable the right-click context menu
document.addEventListener('contextmenu', event => event.preventDefault());