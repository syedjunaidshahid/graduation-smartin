/* Sarah’s Graduation Card — Interactions
   - Confetti on load
   - Flip-the-cap button + mini burst
*/

// Confetti engine (lightweight, no deps)
(function () {
  const canvas = document.getElementById("confetti");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let W, H, particles = [], running = true;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize, { passive: true });
  resize();

  const colors = [
    "#d4af37", // gold
    "#c8a02f", // gold deep
    "#ffffff",
    "#102450", // navy shade
  ];

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function spawnConfetti(count = 160, burstX = W / 2, burstY = H / 3) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x: burstX + rand(-60, 60),
        y: burstY + rand(-40, 40),
        r: rand(4, 8),
        w: rand(6, 14),
        h: rand(8, 16),
        tilt: rand(-1, 1),
        tiltAngle: 0,
        tiltAngleInc: rand(0.02, 0.08),
        speed: rand(2, 5),
        alpha: rand(0.75, 1),
        color: colors[(Math.random() * colors.length) | 0],
        shape: Math.random() < 0.6 ? "rect" : "circle",
        rotation: rand(0, Math.PI * 2),
        rotationSpeed: rand(-0.1, 0.1),
        vy: rand(2, 4),
        vx: rand(-2, 2),
      });
    }
  }

  function drawParticle(p) {
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    if (p.shape === "rect") {
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function updateParticle(p) {
    p.y += p.vy;
    p.x += p.vx + Math.sin(p.tiltAngle) * 0.6;
    p.rotation += p.rotationSpeed;
    p.tiltAngle += p.tiltAngleInc;

    // fade out near bottom
    if (p.y > H * 0.8) p.alpha *= 0.985;
  }

  function loop() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    particles = particles.filter((p) => p.alpha > 0.05 && p.y < H + 40);
    for (const p of particles) {
      updateParticle(p);
      drawParticle(p);
    }
    requestAnimationFrame(loop);
  }

  // Public mini-burst for the "Celebrate Again" button
  window.confettiBurst = function () {
    if (prefersReduced) return;
    const x = window.innerWidth / 2;
    const y = window.innerHeight * 0.25;
    spawnConfetti(80, x, y);
  };

  // On load: big celebration once
  if (!prefersReduced) {
    spawnConfetti(220, W / 2, H * 0.28);
    loop();
    // Stop the engine after 10s to save CPU; particles still fade out
    setTimeout(() => (running = false), 10000);
  }
})();

// Flip-the-cap button behavior
(function () {
  const btn = document.getElementById("flipCapBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    btn.classList.toggle("flipped");
    // tiny confetti pop on flip
    if (typeof window.confettiBurst === "function") {
      window.confettiBurst();
    }
  });
})();
