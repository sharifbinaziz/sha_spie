const frames = [
  { src: "assets/harbor-sun.jpg", title: "Harbor, almost dark", place: "Sunset", cat: "harbor", text: "Sun was almost gone. Big boats already black, water still bright. A small one crossed the bright part." },
  { src: "assets/maersk.jpg", title: "Maersk in the fog", place: "Harbor", cat: "harbor", text: "Fog was thick. I could still read the name." },
  { src: "assets/breakwater.jpg", title: "Rocks first", place: "Breakwater", cat: "harbor", text: "I pointed at the stones. The ship is just back there." },
  { src: "assets/bridge.jpg", title: "Bridge, early", place: "River", cat: "river", text: "Early. Kites over the bridge, a boat waiting under it." },
  { src: "assets/framed-boat.jpg", title: "Boat through leaves", place: "Riverbank", cat: "river", text: "Didn’t move the leaves. They did the framing." },
  { src: "assets/haze.jpg", title: "Soft day", place: "River", cat: "river", text: "Grey day. The small boat was still going." },
  { src: "assets/bank-birds.jpg", title: "Birds on the bank", place: "Morning", cat: "river", text: "They were still there. Light was low." },
  { src: "assets/leaf-sunset.jpg", title: "Leaves, last light", place: "Sunset", cat: "green", text: "Didn’t need the whole sun. The leaves were doing enough." },
  { src: "assets/green-corridor.jpg", title: "Green edge", place: "Riverbank", cat: "green", text: "Sun coming through the plants on the bank." },
  { src: "assets/canopy.jpg", title: "Under the palms", place: "Evening", cat: "green", text: "Stood under the palms for a bit. Light was low through the fronds." },
  { src: "assets/bird-dark.jpg", title: "Bird in the dark", place: "Shade", cat: "green", text: "Mostly a shape. Leaves behind it were brighter." },
  { src: "assets/culvert.jpg", title: "Drain under the plants", place: "Ashuganj · 24 Sept 2026", cat: "green", text: "Concrete is almost gone under the green." },
  { src: "assets/moon-glow.jpg", title: "Just the moon", place: "Night", cat: "night", text: "Nothing else in the frame. Left it like that." },
  { src: "assets/half-moon.jpg", title: "Half covered", place: "Night", cat: "night", text: "Half of it was in shadow. The edge looked warm." },
  { src: "assets/moon-trees.jpg", title: "Moon in the trees", place: "Blue hour", cat: "night", text: "Small, kind of lost in the branches." },
  { src: "assets/palm-slit.jpg", title: "Palm and a slit of sun", place: "Evening", cat: "night", text: "Rest of the frame is black. That’s fine." },
  { src: "assets/palm-moon.jpg", title: "Palm over the moon", place: "Night", cat: "night", text: "Leaves in the way on purpose." },
  { src: "assets/leaf-glow.jpg", title: "Leaf against the glow", place: "Backlight", cat: "night", text: "Pointed at the light and let the leaf go dark." },
  { src: "assets/bird-wire.jpg", title: "Bird on a wire", place: "Shade", cat: "green", text: "It stayed. Background went soft." },
  { src: "assets/parked-cars.jpg", title: "Cars packed in", place: "Street", cat: "street", text: "White hood in front. I liked how tight it was." },
  { src: "assets/grille-leaves.jpg", title: "Grille through leaves", place: "Street", cat: "street", text: "Didn’t clear the leaves. They were the picture." },
  { src: "assets/mirror-camera.jpg", title: "Elevator mirror", place: "Indoors", cat: "street", text: "Quick one in the mirror before the doors opened." },
  { src: "assets/kit-canon.jpg", title: "Cap on", place: "Rooftop", cat: "street", text: "Cap still on. Radio next to it." }
];


let active = "all";
let searchTerm = "";
let index = 0;
const $ = (s) => document.querySelector(s);
const gallery = $("#gallery");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const catLabel = { harbor: "Harbor", river: "River", green: "Green", night: "Night", street: "Street" };

/* ---------- gallery ---------- */
function render() {
  const list = frames.filter((f) => (active === "all" || f.cat === active) && `${f.title} ${f.place} ${f.text} ${f.cat}`.toLowerCase().includes(searchTerm));
  $("#galleryCount").textContent = String(list.length).padStart(2, "0");
  $("#galleryEmpty").hidden = list.length !== 0;
  gallery.innerHTML = list.map((f, i) => `
    <button class="photo reveal" type="button" data-i="${frames.indexOf(f)}" style="--i:${i}" aria-label="Open ${f.title}">
      <span class="card-media">
        <img src="${f.src}" alt="${f.title}" loading="lazy" decoding="async">
        <span class="card-badge">${catLabel[f.cat]}</span>
        <span class="card-num">${String(frames.indexOf(f) + 1).padStart(2, "0")}</span>
        <span class="card-zoom">+</span>
      </span>
      <span class="card-body">
        <span class="photo-place">${f.place}</span>
        <strong>${f.title}</strong>
        <p>${f.text}</p>
        <span class="card-foot"><i style="font-style:normal">View frame</i><b>→</b></span>
      </span>
    </button>`).join("");
  gallery.querySelectorAll(".photo").forEach((el) => {
    el.addEventListener("click", () => openLightbox(Number(el.dataset.i)));
    bindTilt(el);
  });
  observeReveals();
}

function bindTilt(el) {
  if (reduced || !fine) return;
  el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.transform = `rotateX(${(0.5 - py) * 8}deg) rotateY(${(px - 0.5) * 10}deg) translateY(-6px)`;
  }, { passive: true });
  el.addEventListener("pointerleave", () => { el.style.transform = ""; });
}

/* ---------- lightbox ---------- */
function openLightbox(i) {
  index = i;
  const f = frames[index];
  const img = $("#lbImg");
  img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
  img.src = f.src; img.alt = f.title;
  $("#lbCap").textContent = `${f.title} — ${f.text}`;
  $("#lbCounter").textContent = `${String(index + 1).padStart(2, "0")} / ${String(frames.length).padStart(2, "0")}`;
  $("#lightbox").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeLightbox() { $("#lightbox").classList.remove("open"); document.body.style.overflow = ""; }
function step(n) { openLightbox((index + n + frames.length) % frames.length); }

document.querySelectorAll(".filters button").forEach((btn) => btn.addEventListener("click", () => {
  document.querySelectorAll(".filters button").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  active = btn.dataset.filter;
  render();
}));
$("#gallerySearch").addEventListener("input", (e) => { searchTerm = e.target.value.trim().toLowerCase(); render(); });
$("#lbClose").addEventListener("click", closeLightbox);
$("#lbPrev").addEventListener("click", () => step(-1));
$("#lbNext").addEventListener("click", () => step(1));
$("#lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (!$("#lightbox").classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") step(1);
  if (e.key === "ArrowLeft") step(-1);
});
let touchX = 0;
const lb = $("#lightbox");
lb.addEventListener("touchstart", (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", (e) => {
  if (!lb.classList.contains("open")) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
}, { passive: true });

/* ---------- reveal + counters ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add("visible");
    if (en.target.classList.contains("stat-card")) countUp(en.target.querySelector(".stat-num"));
    io.unobserve(en.target);
  });
}, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
function observeReveals() { document.querySelectorAll(".reveal:not(.visible)").forEach((el) => io.observe(el)); }

function countUp(el) {
  const to = Number(el.dataset.count || 0);
  if (reduced) { el.textContent = to; return; }
  const t0 = performance.now(), dur = 1600;
  (function tick(t) {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4)));
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}

/* ---------- hero title: letter-by-letter mask reveal ---------- */
(function splitTitle() {
  const h = $("#heroTitle"); if (!h) return;
  let n = 0;
  h.querySelectorAll(".line").forEach((line) => {
    const text = line.textContent;
    line.textContent = "";
    [...text].forEach((c) => {
      const s = document.createElement("span");
      s.className = "ch"; s.style.setProperty("--d", n++);
      s.textContent = c === " " ? "\u00A0" : c;
      line.appendChild(s);
    });
  });
})();

/* ---------- marquee ---------- */
(function marquee() {
  const m = $("#marquee"); if (!m) return;
  const words = ["Harbor", "River", "Green", "Night", "Street", "Ashuganj", "Moons", "Ships", "Leaves"];
  const set = words.map((w) => `<span>${w}</span>`).join("");
  m.innerHTML = set + set;
})();

/* ---------- scroll: progress + parallax ---------- */
const parallaxEls = document.querySelectorAll(".parallax");
const heroVisual = $(".hero-visual");
let ticking = false;
function onScroll() {
  const h = document.documentElement.scrollHeight - innerHeight;
  $("#progress").style.width = `${h > 0 ? (scrollY / h) * 100 : 0}%`;
  if (!reduced) {
    parallaxEls.forEach((el) => {
      const box = el.parentElement.getBoundingClientRect();
      if (box.bottom < 0 || box.top > innerHeight) return;
      el.style.setProperty("--py", `${((box.top + box.height / 2 - innerHeight / 2) / innerHeight) * -60}px`);
    });
    if (heroVisual) heroVisual.style.setProperty("--sy", `${Math.min(scrollY, 700) * 0.12}px`);
  }
  ticking = false;
}
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

/* ---------- pointer effects ---------- */
if (!reduced && fine) {
  const glow = $("#pointerGlow");
  addEventListener("pointermove", (e) => { glow.style.left = e.clientX + "px"; glow.style.top = e.clientY + "px"; }, { passive: true });

  const hero = $(".hero");
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    hero.querySelector(".hero-visual").style.setProperty("--hx", `${((e.clientX - r.left) / r.width - .5) * -26}px`);
    hero.querySelector(".hero-visual").style.setProperty("--hy", `${((e.clientY - r.top) / r.height - .5) * -20}px`);
  }, { passive: true });

  document.querySelectorAll(".band").forEach((el) => el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  }, { passive: true }));

  // magnetic buttons
  document.querySelectorAll(".btn, .ping-me").forEach((b) => {
    b.addEventListener("pointermove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px, ${(e.clientY - r.top - r.height / 2) * .28 - 3}px)`;
    }, { passive: true });
    b.addEventListener("pointerleave", () => { b.style.transform = ""; });
  });
}

document.addEventListener("pointerdown", (e) => {
  if (reduced) return;
  const t = e.target.closest(".photo, .btn, .filters button");
  if (!t) return;
  const r = t.getBoundingClientRect();
  t.style.setProperty("--tap-x", `${e.clientX - r.left}px`);
  t.style.setProperty("--tap-y", `${e.clientY - r.top}px`);
  t.classList.remove("tap-pop"); void t.offsetWidth; t.classList.add("tap-pop");
  setTimeout(() => t.classList.remove("tap-pop"), 560);
}, { passive: true });

/* ---------- rotating role word ---------- */
const roleWord = $("#roleWord");
if (roleWord && !reduced) {
  const roles = ["always observing.", "collecting small moments.", "finding light in ordinary places."];
  let r = 0;
  setInterval(() => {
    roleWord.style.opacity = "0"; roleWord.style.transform = "translateY(8px)";
    setTimeout(() => { r = (r + 1) % roles.length; roleWord.textContent = roles[r]; roleWord.style.opacity = "1"; roleWord.style.transform = "none"; }, 260);
  }, 3200);
}

/* ---------- init ---------- */
$("#yearNow").textContent = new Date().getFullYear();
$("#heroCount").textContent = frames.length;
document.querySelectorAll(".band, .about, .note, .section-head, .stat-card, .support-cta").forEach((el) => el.classList.add("reveal"));
render();
onScroll();
