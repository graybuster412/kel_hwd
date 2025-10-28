(function () {
  // === THIẾT LẬP MẬT ĐỘ & TỐC ĐỘ ===
  const DENSITY = 0.000022; // thấp = thưa hơn
  const MIN_COUNT = 30;
  const MAX_COUNT = 70;
  const SPAWN_INTERVAL = [80, 220]; // ms, tạo “nhỏ giọt”

  const area = window.innerWidth * window.innerHeight;
  const COUNT = Math.max(
    MIN_COUNT,
    Math.min(MAX_COUNT, Math.round(area * DENSITY))
  );

  const root = document.querySelector(".sparkle-overlay");
  if (!root) return; // không có overlay thì khỏi chạy

  function make() {
    const d = document.createElement("div");
    d.className = "spark";

    // rơi CHẬM & lắc NHẸ
    const fall = 14 + Math.random() * 12; // 14–26s
    const sway = 2.8 + Math.random() * 1.6; // 2.8–4.4s
    const blink = 1.0 + Math.random() * 0.9; // 1.0–1.9s
    const size = 3 + Math.random() * 5; // 3–8px
    const delay = Math.random() * blink;

    d.style.left = Math.random() * 100 + "%";
    d.style.top = -10 - Math.random() * 120 + "%";
    d.style.setProperty("--size", size + "px");
    d.style.setProperty("--fall", fall + "s");
    d.style.setProperty("--sway", sway + "s");
    d.style.setProperty("--blink", blink + "s");
    d.style.setProperty("--delay", delay + "s");

    root.appendChild(d);
  }

  // tạo “nhỏ giọt” cho tới COUNT
  let made = 0;
  (function spawnLoop() {
    if (made >= COUNT) return;
    make();
    made++;
    const [a, b] = SPAWN_INTERVAL;
    setTimeout(spawnLoop, a + Math.random() * (b - a));
  })();
})();

(function () {
  const els = document.querySelectorAll(".reveal-ribbon");
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  els.forEach((el) => io.observe(el));
})();

(function fireflies() {
  const wrap = document.getElementById("fireflies");
  if (!wrap) return;
  const COUNT = Math.min(28, Math.max(14, Math.floor(window.innerWidth / 50)));
  for (let i = 0; i < COUNT; i++) {
    const f = document.createElement("span");
    f.className = "firefly";
    const x0 = Math.random() * 100,
      y0 = Math.random() * 100;
    const x1 = x0 + (Math.random() * 40 - 20);
    const y1 = y0 + (Math.random() * 30 - 15);
    f.style.left = x0 + "vw";
    f.style.top = y0 + "vh";
    f.style.setProperty("--x0", "0");
    f.style.setProperty("--y0", "0");
    f.style.setProperty("--x1", x1 - x0 + "vw");
    f.style.setProperty("--y1", y1 - y0 + "vh");
    f.style.setProperty("--t", 10 + Math.random() * 8 + "s");
    wrap.appendChild(f);
  }
})();

// <!-- Romantic Animations: Petal Rain + Reveal-on-Scroll -->
// ========== Petal Rain ==========
(function () {
  const field = document.getElementById("petal-field");
  if (!field) return;
  const PETALS = Math.min(24, Math.max(12, Math.floor(window.innerWidth / 80)));

  function spawnPetal() {
    const p = document.createElement("span");
    p.className = "petal";
    const startX = Math.random() * 100;
    const fall = 10 + Math.random() * 2; // seconds
    const sway = 3 + Math.random() * 3.5; // seconds
    const spin = 6 + Math.random() * 6; // seconds
    p.style.left = startX + "vw";
    p.style.animationDuration = `${fall}s, ${sway}s, ${spin}s`;
    p.style.animationDelay = `0s, ${Math.random() * 2}s, 0s`;
    p.style.opacity = 0.65 + Math.random() * 0.25;
    field.appendChild(p);
    setTimeout(() => p.remove(), fall * 1000 * 2);
  }

  // Initial sprinkle
  for (let i = 0; i < PETALS; i++) setTimeout(spawnPetal, i * 300);

  // Continuous but gentle
  setInterval(() => {
    if (!document.hidden) spawnPetal();
  }, 800);
})();
