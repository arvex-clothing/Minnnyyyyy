// ✿ PERSONALIZE THIS LITTLE UNIVERSE ✿
const FRIEND_NAME = "Minnyyyyyyyyyy"; // Change this to her nickname.
document.getElementById("friendName").textContent = FRIEND_NAME;

const screens = [...document.querySelectorAll(".screen")];
const progressBar = document.getElementById("progressBar");
let currentScreen = 0;

function showScreen(id) {
  const target = document.getElementById(id);
  if (!target) return;
  screens.forEach(s => s.classList.remove("active"));
  target.classList.add("active");
  currentScreen = screens.indexOf(target);
  progressBar.style.width = `${((currentScreen + 1) / screens.length) * 100}%`;
  window.scrollTo({ top: 0, behavior: "smooth" });
  burst(window.innerWidth / 2, Math.min(window.innerHeight * .45, 420), ["✦", "♡", "✿", "✧", "❀"]);
}
document.querySelectorAll("[data-next]").forEach(btn => {
  btn.addEventListener("click", () => showScreen(btn.dataset.next));
});

// The answer buttons are intentionally dramatic.
const reaction = document.getElementById("answerReaction");
const noIdea = document.getElementById("noIdeaBtn");
let dodgeCount = 0;
noIdea.addEventListener("click", () => {
  dodgeCount++;
  const replies = [
    "That answer has been rejected by the Council of Besties. 😭",
    "Girl, the evidence folder is THICK.",
    "Your lawyer has advised you to stop clicking.",
    "Fine. You're innocent. (the flowers disagree.)"
  ];
  reaction.textContent = replies[Math.min(dodgeCount - 1, replies.length - 1)];
  burst(window.innerWidth / 2, window.innerHeight * .58, ["😭", "♡", "✿"]);
});
document.getElementById("obviouslyBtn").addEventListener("click", () => {
  reaction.textContent = "At least you're self-aware. We love character development. ✨";
  burst(window.innerWidth / 2, window.innerHeight * .58, ["✦", "♡", "✿", "★"]);
});

// Interactive flower wisdom.
document.querySelectorAll(".garden-flower").forEach(flower => {
  flower.addEventListener("click", () => {
    document.getElementById("flowerMessage").textContent = flower.dataset.message;
    flower.animate([{ transform: "translateY(0) scale(1)" }, { transform: "translateY(-13px) scale(1.2) rotate(-8deg)" }, { transform: "translateY(0) scale(1)" }], { duration: 450, easing: "ease-out" });
    burst(window.innerWidth / 2, window.innerHeight * .67, ["✿", "♡", "✧"]);
  });
});

// Final reveal.
document.getElementById("finalSurprise").addEventListener("click", () => {
  document.getElementById("finalReveal").classList.add("show");
  document.getElementById("finalSurprise").textContent = "SURPRISE DELIVERED 💌";
  burst(window.innerWidth / 2, window.innerHeight * .55, ["♡", "✿", "✦", "🌷", "✨", "❀"]);
});
document.getElementById("replayBtn").addEventListener("click", () => {
  document.getElementById("finalReveal").classList.remove("show");
  document.getElementById("finalSurprise").innerHTML = 'One last surprise? <span>✨</span>';
  showScreen("welcome");
});

// Toasts and little celebratory bursts.
let toastTimer;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}
function burst(x, y, symbols = ["✦", "♡", "✿"]) {
  for (let i = 0; i < 13; i++) {
    const el = document.createElement("span");
    el.className = "burst";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = `${x}px`; el.style.top = `${y}px`;
    el.style.setProperty("--dx", `${(Math.random() - .5) * 250}px`);
    el.style.setProperty("--dy", `${(Math.random() - .7) * 220}px`);
    el.style.animationDelay = `${Math.random() * .16}s`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1600);
  }
}

// Gentle falling petals on a canvas.
const canvas = document.getElementById("petal-canvas");
const ctx = canvas.getContext("2d");
let width, height, petals = [];
function resizeCanvas() {
  width = canvas.width = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2);
  height = canvas.height = window.innerHeight * Math.min(window.devicePixelRatio || 1, 2);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(Math.min(window.devicePixelRatio || 1, 2), 0, 0, Math.min(window.devicePixelRatio || 1, 2), 0, 0);
  petals = Array.from({ length: window.innerWidth < 600 ? 18 : 32 }, () => makePetal(true));
}
function makePetal(initial = false) {
  return { x: Math.random() * window.innerWidth, y: initial ? Math.random() * window.innerHeight : -20,
    size: 3 + Math.random() * 5, speed: .35 + Math.random() * .85, drift: (Math.random() - .5) * .65,
    rotation: Math.random() * Math.PI, spin: (Math.random() - .5) * .025, alpha: .2 + Math.random() * .45 };
}
function drawPetals() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  petals.forEach((p, i) => {
    p.y += p.speed; p.x += Math.sin(p.y / 70) * .35 + p.drift; p.rotation += p.spin;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation); ctx.globalAlpha = p.alpha;
    ctx.fillStyle = i % 3 === 0 ? "#f7c7df" : (i % 3 === 1 ? "#dfc9f5" : "#fff0d4");
    ctx.beginPath(); ctx.ellipse(0, 0, p.size * .65, p.size * 1.35, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    if (p.y > window.innerHeight + 20) petals[i] = makePetal();
  });
  requestAnimationFrame(drawPetals);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); drawPetals();

// Optional soft ambient sound. Browsers require a click before sound can play.
// This synthesizes a quiet, simple chime; no audio file is needed.
let audioCtx = null, soundOn = false, chimeTimer = null;
const soundToggle = document.getElementById("soundToggle");
soundToggle.addEventListener("click", async () => {
  if (!soundOn) {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      await audioCtx.resume();
      soundOn = true;
      document.getElementById("soundIcon").textContent = "♫";
      document.getElementById("soundText").textContent = "sound on";
      playChime();
      chimeTimer = setInterval(playChime, 3800);
      showToast("A tiny bit of magic, now with sound ✨");
    } catch (e) {
      showToast("Sound isn't available in this browser — the magic still works ♡");
    }
  } else {
    soundOn = false;
    clearInterval(chimeTimer);
    document.getElementById("soundIcon").textContent = "♫";
    document.getElementById("soundText").textContent = "sound off";
    showToast("Quiet mode activated 🌙");
  }
});
function playChime() {
  if (!audioCtx || !soundOn) return;
  const now = audioCtx.currentTime;
  [523.25, 659.25, 783.99].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine"; osc.frequency.value = freq;
    gain.gain.setValueAtTime(.0001, now + i * .13);
    gain.gain.exponentialRampToValueAtTime(.035, now + i * .13 + .08);
    gain.gain.exponentialRampToValueAtTime(.0001, now + i * .13 + 1.1);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(now + i * .13); osc.stop(now + i * .13 + 1.15);
  });
}


// Extra enchanted-world interactions.
const magicMessage = document.getElementById("magicMessage");
const magicWorld = document.getElementById("magicWorld");
const carriageBtn = document.getElementById("carriageBtn");
if (carriageBtn) {
  carriageBtn.addEventListener("click", () => {
    const messages = [
      "Your royal carriage has arrived. The horse is a butterfly. Please do not question the budget. 🎠",
      "Welcome aboard, Your Majesty of Being Annoying. Next stop: the land of snacks. 🍓",
      "The carriage has a strict no-drama policy. It has already asked you to leave. 😭",
      "A tiny fairy says you look magical today. The fairy is legally required to be nice."
    ];
    magicMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
    carriageBtn.animate([{ transform: "translateX(-50%) rotate(0)" }, { transform: "translateX(-50%) rotate(-8deg)" }, { transform: "translateX(-50%) rotate(8deg)" }, { transform: "translateX(-50%) rotate(0)" }], { duration: 500 });
    burst(window.innerWidth / 2, window.innerHeight * .63, ["✦", "♡", "✨", "🌷"]);
  });
}
const summonBtn = document.getElementById("summonFairies");
if (summonBtn) {
  summonBtn.addEventListener("click", () => {
    for (let i = 0; i < 5; i++) {
      const fairy = document.createElement("span");
      fairy.className = "extra-fairy";
      fairy.textContent = ["🧚🏻‍♀️", "🧚🏽‍♀️", "🧚🏼‍♀️", "✨", "🦋"][i];
      fairy.style.left = `${8 + Math.random() * 82}%`;
      fairy.style.top = `${35 + Math.random() * 45}%`;
      fairy.style.setProperty("--fly", `${(Math.random() - .5) * 100}px`);
      magicWorld.appendChild(fairy);
      setTimeout(() => fairy.remove(), 2900);
    }
    magicMessage.textContent = "Oops. You summoned the entire fairy group chat. They're all typing at once. 🧚";
    burst(window.innerWidth / 2, window.innerHeight * .62, ["🧚", "✧", "♡", "🦋"]);
  });
}
const wishBtn = document.getElementById("makeWish");
if (wishBtn) {
  wishBtn.addEventListener("click", () => {
    magicMessage.textContent = "Wish sent to the universe. Delivery estimate: whenever the universe stops being dramatic. 🌠";
    const star = document.createElement("span");
    star.className = "wish-star";
    star.textContent = "✦";
    star.style.left = `${35 + Math.random() * 30}%`;
    star.style.top = `${window.innerHeight * .68}px`;
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 1800);
    burst(window.innerWidth / 2, window.innerHeight * .64, ["✦", "✨", "♡"]);
  });
}

// Mouse/touch sparkle trail. Kept subtle and disabled for reduced-motion users.
const sparkleLayer = document.getElementById("cursor-sparkles");
let lastGlint = 0;
function addGlint(x, y) {
  const now = Date.now();
  if (now - lastGlint < 65 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  lastGlint = now;
  const glint = document.createElement("span");
  glint.className = "cursor-glint";
  glint.textContent = ["✧", "·", "✦", "♡"][Math.floor(Math.random() * 4)];
  glint.style.left = `${x}px`; glint.style.top = `${y}px`;
  sparkleLayer.appendChild(glint);
  setTimeout(() => glint.remove(), 900);
}
window.addEventListener("pointermove", e => addGlint(e.clientX, e.clientY), { passive: true });
window.addEventListener("touchmove", e => {
  if (e.touches && e.touches[0]) addGlint(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });
