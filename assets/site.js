const pages = [
  ["index.html", "Home"],
  ["life-in-2045.html", "Life in 2045"],
  ["family.html", "Family"],
  ["earth.html", "Earth"],
  ["subterranean-cities.html", "Cities of Light"],
  ["intelligence.html", "Intelligence"],
  ["timeline.html", "Timeline"],
  ["network.html", "Project network"]
];

const currentPage = window.location.pathname.split("/").pop() || "index.html";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const header = document.querySelector("[data-site-header]");
if (header) {
  const currentLink = header.querySelector(`.site-nav a[href="${currentPage}"]`);
  if (currentLink) currentLink.setAttribute("aria-current", "page");
}

const footer = document.querySelector("[data-site-footer]");
if (footer) {
  footer.innerHTML = `
    <footer class="site-footer">
      <div class="wrap footer-grid">
        <div>
          <a class="footer-title" href="index.html">Future of Life 2045</a>
          <p>A future plan developed by Luke Nathan Hayes since 2010 and expressed through connected public projects.</p>
        </div>
        <div>
          <h2>Explore</h2>
          ${pages.slice(1).map(([href, label]) => `<a href="${href}">${label}</a>`).join("")}
        </div>
        <div>
          <h2>Connected worlds</h2>
          <a href="https://auraofintelligence.github.io/global-group-marriages/">Global Group Marriages</a>
          <a href="https://auraofintelligence.github.io/subterranean-cities.html">Subterranean Eco-Cities</a>
          <a href="https://auraofintelligence.github.io/gajra-earth-claude-build/">GAJRA Earth Claude build</a>
          <a href="https://auraofintelligence.github.io/GAJRA-earth-infinity/">GAJRA Earth Infinity</a>
          <a href="https://auraofintelligence.github.io/">Aura of Intelligence</a>
        </div>
      </div>
      <div class="wrap footer-bottom">
        <p>&copy; ${new Date().getFullYear()} Luke Nathan Hayes / Strange But True / Aura of Intelligence.</p>
        <a href="LICENSE">Strange But True Public Source Licence</a>
        <a class="back-to-top" href="#top">Back to top</a>
      </div>
    </footer>`;
}

const menuButton = document.querySelector(".menu-button");
const siteNav = document.querySelector(".site-nav");
if (menuButton && siteNav) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    siteNav.classList.toggle("is-open", !open);
    document.body.classList.toggle("menu-open", !open);
  });
  siteNav.addEventListener("click", event => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });
  document.documentElement.classList.add("nav-ready");
}

const revealItems = document.querySelectorAll("[data-reveal]");
if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach(item => item.classList.add("is-visible"));
} else {
  try {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -4%" });
    revealItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.08 && rect.bottom > 0) item.classList.add("is-visible");
      else revealObserver.observe(item);
    });
    document.documentElement.classList.add("reveal-ready");
  } catch {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }
}

document.querySelectorAll("[data-motion-card]").forEach(card => {
  if (prefersReducedMotion) return;
  card.addEventListener("pointermove", event => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -5;
    const ry = ((x / rect.width) - 0.5) * 5;
    card.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
    card.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
  });
  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  });
});

function fitCanvas(canvas) {
  const ratio = Math.min(window.devicePixelRatio || 1, 1.6);
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width * ratio));
  const height = Math.max(1, Math.round(rect.height * ratio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  return { width, height, ratio };
}

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

const ambientCanvas = document.querySelector("[data-ambient-field]");
if (ambientCanvas) {
  const context = ambientCanvas.getContext("2d");
  const random = seededRandom(2045);
  const points = Array.from({ length: 46 }, () => ({
    x: random(),
    y: random(),
    radius: 0.7 + random() * 1.5,
    phase: random() * Math.PI * 2,
    colour: random() > 0.52 ? "99,242,223" : "101,168,255"
  }));

  const drawAmbient = time => {
    const { width, height } = fitCanvas(ambientCanvas);
    context.clearRect(0, 0, width, height);
    const seconds = time * 0.00018;
    points.forEach((point, index) => {
      const x = point.x * width + Math.sin(seconds + point.phase) * 11;
      const y = point.y * height + Math.cos(seconds * 0.8 + point.phase) * 8;
      context.beginPath();
      context.fillStyle = `rgba(${point.colour},0.42)`;
      context.arc(x, y, point.radius, 0, Math.PI * 2);
      context.fill();
      for (let next = index + 1; next < points.length; next += 1) {
        const other = points[next];
        const ox = other.x * width + Math.sin(seconds + other.phase) * 11;
        const oy = other.y * height + Math.cos(seconds * 0.8 + other.phase) * 8;
        const distance = Math.hypot(ox - x, oy - y);
        const limit = Math.min(width, height) * 0.16;
        if (distance < limit) {
          context.beginPath();
          context.strokeStyle = `rgba(101,168,255,${0.055 * (1 - distance / limit)})`;
          context.lineWidth = 1;
          context.moveTo(x, y);
          context.lineTo(ox, oy);
          context.stroke();
        }
      }
    });
    if (!prefersReducedMotion) requestAnimationFrame(drawAmbient);
  };
  requestAnimationFrame(drawAmbient);
}

const networkCanvas = document.querySelector("[data-network-canvas]");
if (networkCanvas) {
  const context = networkCanvas.getContext("2d");
  const nodes = [
    [0.18, 0.24, "#ff637d"],
    [0.72, 0.2, "#63f2df"],
    [0.5, 0.5, "#65a8ff"],
    [0.22, 0.76, "#a77bff"],
    [0.78, 0.79, "#ffc85b"],
    [0.37, 0.18, "#63f2df"],
    [0.7, 0.58, "#ff637d"],
    [0.36, 0.65, "#65a8ff"]
  ];
  const links = [[0,2],[0,3],[0,5],[1,2],[1,6],[2,3],[2,4],[2,5],[2,6],[2,7],[3,7],[4,6],[4,7],[5,6]];
  const drawNetwork = time => {
    const { width, height } = fitCanvas(networkCanvas);
    context.clearRect(0, 0, width, height);
    links.forEach(([a, b], index) => {
      const start = nodes[a];
      const end = nodes[b];
      const pulse = 0.16 + (Math.sin(time * 0.0015 + index) + 1) * 0.08;
      context.beginPath();
      context.strokeStyle = `rgba(101,168,255,${pulse})`;
      context.lineWidth = Math.max(1, width / 900);
      context.moveTo(start[0] * width, start[1] * height);
      const cx = ((start[0] + end[0]) / 2) * width;
      const cy = ((start[1] + end[1]) / 2) * height - Math.abs(end[0] - start[0]) * height * 0.13;
      context.quadraticCurveTo(cx, cy, end[0] * width, end[1] * height);
      context.stroke();
    });
    nodes.forEach((node, index) => {
      const x = node[0] * width;
      const y = node[1] * height;
      const radius = Math.max(4, width / 95) + Math.sin(time * 0.002 + index) * 2;
      const glow = context.createRadialGradient(x, y, 0, x, y, radius * 4);
      glow.addColorStop(0, node[2]);
      glow.addColorStop(0.25, `${node[2]}88`);
      glow.addColorStop(1, `${node[2]}00`);
      context.fillStyle = glow;
      context.beginPath();
      context.arc(x, y, radius * 4, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = node[2];
      context.beginPath();
      context.arc(x, y, radius * 0.55, 0, Math.PI * 2);
      context.fill();
    });
    if (!prefersReducedMotion) requestAnimationFrame(drawNetwork);
  };
  requestAnimationFrame(drawNetwork);
}
