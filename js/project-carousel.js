/* ============================================================
   PROJECT-CAROUSEL.JS - the small "More projects" strip on project pages.
   - The project you are viewing sits in the MIDDLE, biggest; the others
     are smaller and tucked behind it on both sides.
   - Move along it with the arrows, the dots, the keyboard arrow keys,
     a sideways trackpad/mouse scroll, or a swipe. The next project grows
     and slides to the middle.
   - Click the middle card to open that project. Click a side card to bring it to the middle.
   - It slides up after the first slide of the page has scrolled out of view.
============================================================ */
(function () {
  /* ---------- PROJECT LIST: lives in js/config.js (PORTFOLIO_CONFIG.projects). Add new projects THERE. ---------- */
  const PROJECTS = window.PORTFOLIO_CONFIG.projects.map((p) => ({ ...p, image: "../" + p.image }));   // "../" because project pages sit one folder down


  /* ---------- EDIT HERE: how the cards are arranged ----------
     How far from the middle each card sits (distance 0 = middle, 1 = next to it, ...).
     x = sideways shift as a multiple of the middle card's width, s = size, o = opacity. */
  const SLOTS = {
    0: { x: 0,    s: 1,     o: 1 },
    1: { x: 0.68, s: 0.744, o: 0.95 },
    2: { x: 1.0,  s: 0.595, o: 0.85 },
    3: { x: 1.35, s: 0.5,   o: 0.7 },
  };
  /* ----------------------------------------------------------------------- */

  const firstSlide = document.querySelector(".project-img");   // first image / video / flipbook on the page
  const contact = document.querySelector(".contact");
  if (!firstSlide) return;

  const currentSlug = location.pathname.split("/").pop().replace(".html", "");
  let index = Math.max(0, PROJECTS.findIndex((p) => p.slug === currentSlug));   // which project is in the middle
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const chevron = (d) => '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="' + d + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // ---- Build the strip ----
  const dock = document.createElement("section");
  dock.className = "project-carousel";
  dock.setAttribute("aria-label", "More projects");
  dock.setAttribute("aria-roledescription", "carousel");
  dock.inert = true;   // hidden strips must not be reachable with the Tab key
  dock.innerHTML =
    '<div class="pc-inner">' +
      '<button class="pc-arrow pc-prev" type="button" aria-label="Previous project">' + chevron("M15 5l-7 7 7 7") + "</button>" +
      '<ul class="pc-list">' +
        PROJECTS.map((p) =>
          '<li class="pc-card"><a href="' + p.slug + '.html">' +
          '<span class="pc-label">' + p.title + "  |  " + p.category + "</span>" +
          '<span class="pc-img"><img src="' + p.image + '" alt="" loading="lazy" onerror="this.remove()"></span></a></li>'
        ).join("") +
      "</ul>" +
      '<button class="pc-arrow pc-next" type="button" aria-label="Next project">' + chevron("M9 5l7 7-7 7") + "</button>" +
    "</div>" +
    '<div class="pc-dots">' +
      PROJECTS.map((p, i) => '<button class="pc-dot" type="button" data-i="' + i + '" aria-label="Show ' + p.title + '"></button>').join("") +
    "</div>" +
    '<p class="pc-status" aria-live="polite"></p>';
  document.body.appendChild(dock);

  const cards = [...dock.querySelectorAll(".pc-card")];
  const links = cards.map((c) => c.querySelector("a"));
  const dots = [...dock.querySelectorAll(".pc-dot")];
  const prev = dock.querySelector(".pc-prev");
  const next = dock.querySelector(".pc-next");
  const status = dock.querySelector(".pc-status");

  // ---- Put every card in its place for the current middle project ----
  function render(announce) {
    cards.forEach((card, i) => {
      const d = i - index, abs = Math.abs(d), sign = d < 0 ? -1 : 1;
      const slot = SLOTS[abs];
      card.classList.toggle("is-far", !slot);
      card.classList.toggle("is-middle", d === 0);
      const x = slot ? slot.x : 1.7, s = slot ? slot.s : 0.4;
      card.style.transform = "translateX(calc(var(--pc-w) * " + sign * x + ")) scale(" + s + ")";
      card.style.opacity = slot ? slot.o : 0;
      card.style.zIndex = 10 - abs;
      const p = PROJECTS[i];
      links[i].setAttribute("aria-label", p.title + ", " + p.category + (d !== 0 ? ": bring to the middle" : p.slug === currentSlug ? ": the project you are viewing, back to top" : ": open project"));
    });
    dots.forEach((dot, i) => { if (i === index) dot.setAttribute("aria-current", "true"); else dot.removeAttribute("aria-current"); });
    prev.disabled = index === 0;
    next.disabled = index === PROJECTS.length - 1;
    if (announce) status.textContent = PROJECTS[index].title + ", " + (index + 1) + " of " + PROJECTS.length;
  }
  function go(newIndex) {
    const clamped = Math.min(PROJECTS.length - 1, Math.max(0, newIndex));
    if (clamped === index) return;
    index = clamped;
    render(true);
  }

  // ---- Arrows and dots ----
  prev.addEventListener("click", () => go(index - 1));
  next.addEventListener("click", () => go(index + 1));
  dots.forEach((dot) => dot.addEventListener("click", () => go(Number(dot.dataset.i))));

  // ---- Cards: side card -> bring to the middle; middle card -> open it (or scroll to top if it is this page) ----
  let justSwiped = false;
  links.forEach((link, i) => link.addEventListener("click", (e) => {
    if (justSwiped) { e.preventDefault(); return; }
    if (i !== index) { e.preventDefault(); go(i); return; }
    if (PROJECTS[i].slug === currentSlug) { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" }); }
  }));

  // ---- Keyboard: left/right arrow keys when focus is inside the strip ----
  dock.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { go(index - 1); e.preventDefault(); }
    if (e.key === "ArrowRight") { go(index + 1); e.preventDefault(); }
  });

  // ---- Sideways scrolling (trackpad swipe / shift + wheel): one project per gesture ----
  let wheelSum = 0, wheelLock = false;
  dock.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;   // up/down scrolling still scrolls the page
    e.preventDefault();
    if (wheelLock) return;
    wheelSum += e.deltaX;
    if (Math.abs(wheelSum) > 40) {
      go(index + (wheelSum > 0 ? 1 : -1));
      wheelSum = 0; wheelLock = true;
      setTimeout(() => { wheelLock = false; }, 450);
    }
  }, { passive: false });

  // ---- Touch / pen swipe ----
  let startX = 0, startY = 0;
  const inner = dock.querySelector(".pc-inner");
  inner.addEventListener("pointerdown", (e) => { startX = e.clientX; startY = e.clientY; });
  inner.addEventListener("pointerup", (e) => {
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if (e.pointerType !== "mouse" && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      go(index + (dx < 0 ? 1 : -1));
      justSwiped = true; setTimeout(() => { justSwiped = false; }, 60);
    }
  });

  // ---- Show once the first slide has scrolled out of view; hide near the contact section ----
  function updateVisibility() {
    const firstGone = firstSlide.getBoundingClientRect().bottom < 0;
    const contactNear = contact && contact.getBoundingClientRect().top < window.innerHeight * 0.9;
    const show = firstGone && !contactNear;
    dock.classList.toggle("is-visible", show);
    dock.inert = !show;
  }
  let waiting = false;
  window.addEventListener("scroll", () => {
    if (waiting) return;
    waiting = true;
    requestAnimationFrame(() => { updateVisibility(); waiting = false; });
  }, { passive: true });
  window.addEventListener("resize", updateVisibility);
  window.addEventListener("load", updateVisibility);

  render(false);
  updateVisibility();
})();
