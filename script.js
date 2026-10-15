const $ = (s) => document.querySelector(s);

// Reveal each section gently as it enters the viewport.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

$("#beginBtn").addEventListener("click", () => {
  $("#garden").scrollIntoView({ behavior: "smooth" });
  burstPetals(35);
});

const modal = $("#wishModal");
const modalWish = $("#modalWish");
function closeWish() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}
document.querySelectorAll(".wish-star").forEach((star) => {
  star.addEventListener("click", () => {
    modalWish.textContent = star.dataset.wish;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    $("#wishResult").textContent = "A little wish has found its way into the universe. ✧";
    burstPetals(45);
  });
});
$("#modalClose").addEventListener("click", closeWish);
$("#modalDone").addEventListener("click", closeWish);
modal.addEventListener("click", (e) => { if (e.target === modal) closeWish(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeWish(); });

$("#replayBtn").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  burstPetals(100);
});

// Lightweight falling-petal canvas animation, with no external images required.
const canvas = $("#petals");
const ctx = canvas.getContext("2d");
let petals = [];
let raf = null;
let width = 0, height = 0;
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth; height = window.innerHeight;
  canvas.width = width * dpr; canvas.height = height * dpr;
  canvas.style.width = width + "px"; canvas.style.height = height + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

function makePetal(fromTop = true) {
  return {
    x: Math.random() * width,
    y: fromTop ? -15 - Math.random() * height : Math.random() * height,
    size: 4 + Math.random() * 8,
    speed: .45 + Math.random() * 1.25,
    drift: (Math.random() - .5) * .9,
    sway: Math.random() * Math.PI * 2,
    rotation: Math.random() * Math.PI * 2,
    rotateSpeed: (Math.random() - .5) * .025,
    alpha: .25 + Math.random() * .5,
    hue: Math.random() > .72 ? 35 : 338 + Math.random() * 20
  };
}
for (let i = 0; i < 38; i++) petals.push(makePetal(false));

function drawPetal(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.globalAlpha = p.alpha;
  ctx.fillStyle = `hsl(${p.hue} 55% ${p.hue === 35 ? 75 : 78}%)`;
  ctx.beginPath();
  ctx.moveTo(0, -p.size);
  ctx.bezierCurveTo(p.size * 1.1, -p.size * .6, p.size * .8, p.size * .7, 0, p.size);
  ctx.bezierCurveTo(-p.size * .8, p.size * .7, -p.size * 1.1, -p.size * .6, 0, -p.size);
  ctx.fill();
  ctx.restore();
}
function animate() {
  ctx.clearRect(0, 0, width, height);
  petals.forEach((p, i) => {
    p.sway += .018;
    p.x += p.drift + Math.sin(p.sway) * .55;
    p.y += p.speed;
    p.rotation += p.rotateSpeed;
    drawPetal(p);
    if (p.y > height + 25 || p.x < -40 || p.x > width + 40) petals[i] = makePetal(true);
  });
  raf = requestAnimationFrame(animate);
}
animate();

function burstPetals(count) {
  for (let i = 0; i < count; i++) {
    const p = makePetal(false);
    p.x = width * (.25 + Math.random() * .5);
    p.y = height * (.25 + Math.random() * .35);
    p.speed = -2.5 + Math.random() * 5;
    p.drift = (Math.random() - .5) * 7;
    p.alpha = .8;
    p.size = 5 + Math.random() * 9;
    petals.push(p);
  }
  if (petals.length > 180) petals.splice(0, petals.length - 180);
}
