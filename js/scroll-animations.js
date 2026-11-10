/* ============================================================
   SCROLL-ANIMATIONS.JS - scene transitions.
   Each section "arrives" with a timed motion-graphics entrance
   (it plays on its own once you scroll to the section, so you
   never have to scroll far to see it). Words/pills move with
   yPercent/xPercent so they never clash with the cursor push.
============================================================ */

// One design width unit in pixels (matches --vw in the CSS: fits the 16:10 design inside the window)
function unit() { return Math.min(window.innerWidth / 100, (window.innerHeight * 1.6) / 100); }

// Plays `tl` when `trigger` scrolls into view; plays backwards when you scroll back above it
function playWhenVisible(trigger, tl, start) {
  return ScrollTrigger.create({
    trigger, animation: tl, start: start || window.PORTFOLIO_CONFIG.transitions.start,
    toggleActions: "play none none reverse",
  });
}

/* HERO: letters rise in one by one on page load, then the pills */
function initHeroEntrance() {
  gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.1 })
    .from(".hero .wm-letter", { yPercent: 110, opacity: 0, duration: 1.2, stagger: 0.07 })
    .from(".hero-role", { yPercent: 40, opacity: 0, duration: 0.8 }, "-=0.6")
    .from(".hero .pill", { yPercent: 60, opacity: 0, duration: 0.9, stagger: 0.12 }, "-=0.6");
}

/* FIND: "find", "what", "you're", "looking", "for" rise in one after another, then pills slide in from the sides */
function initFindEntrance() {
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  tl.from(".fw", { yPercent: 120, opacity: 0, duration: 1.1, stagger: 0.14 })
    .from(".p1, .p2", { xPercent: -120, opacity: 0, duration: 1, stagger: 0.1 }, "-=0.5")
    .from(".p3, .p4", { xPercent: 120, opacity: 0, duration: 1, stagger: 0.1 }, "<");
  playWhenVisible(".find", tl);
}

/* PROJECTS entrance: heading slides in, projects float up one after another (the gallery scroll itself is in projects-gallery.js) */
function initProjectsEntrance() {
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  tl.from(".projects-title", { xPercent: 25, opacity: 0, duration: 1.1 })
    .from(".proj a", { yPercent: 20, opacity: 0, duration: 1, stagger: 0.1 }, "-=0.7");
  playWhenVisible(".projects", tl);
}

/* ABOUT: entrance, then ONE pinned section where the three cards stack as you scroll */
function initAboutCards(opts) {
  // opts (phones) can override settings such as back1 / back2 (see config.js -> about.portrait)
  const A = Object.assign({}, window.PORTFOLIO_CONFIG.about, opts);
  const intro = document.querySelector(".card-intro");
  const edu = document.querySelector(".card-education");
  const exp = document.querySelector(".card-experience");
  const px = (percent) => () => unit() * percent;   // design units -> pixels (recalculated on resize)

  gsap.set([edu, exp], { opacity: 0, yPercent: A.enterFromPercent }); // hidden until their turn

  const tl = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    scrollTrigger: {
      trigger: ".about", start: "top top", pin: true, scrub: 1, anticipatePin: 1,
      end: () => "+=" + A.scrollLength * window.innerHeight, invalidateOnRefresh: true,
    },
  });
  const back = (b) => ({ x: px(b.x), y: px(b.y), rotation: b.rot, duration: 0.8 });
  tl.to(edu, { opacity: 1, yPercent: 0, duration: 0.8 }, 0.2)       // Education slides on top...
    .to(intro, back(A.back1), 0.3)                                 // ...Introduction eases back
    .to(exp, { opacity: 1, yPercent: 0, duration: 0.8 }, 1.6)      // Experience slides on top...
    .to(edu, back(A.back1), 1.7)                                   // ...Education eases back one step
    .to(intro, back(A.back2), 1.7)                                 // ...Introduction goes back two
    .to(".about-title", { y: () => -unit() * 0.6, ease: "none", duration: 3 }, 0)
    .to({}, { duration: 0.5 }, 2.5);                               // hold so the last card can be read

  // Entrance (timed, plays when the section arrives)
  const enter = gsap.timeline({ defaults: { ease: "expo.out" } });
  enter.from(".about-title span", { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.15 })
       .from(".card-intro", { yPercent: 25, opacity: 0, duration: 1.1 }, "-=0.8");
  playWhenVisible(".about", enter);
  return tl.scrollTrigger;
}

/* CONTACT: heading rises in, then the button */
function initContactEntrance() {
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  tl.from(".contact-title", { yPercent: 60, opacity: 0, duration: 1.1 })
    .from(".contact .pill", { yPercent: 120, opacity: 0, duration: 0.9 }, "-=0.3");
  playWhenVisible(".contact", tl);
}

/* FOOTER: the big name rises in letter by letter */
function initFooterEntrance() {
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  tl.from(".footer-top", { opacity: 0, duration: 0.8 })
    .from(".footer-wordmark .wm-letter", { yPercent: 80, opacity: 0, duration: 1.1, stagger: 0.06 }, "-=0.5");
  playWhenVisible(".site-footer", tl, "top 85%");
}

/* SNAPPING: when you stop scrolling, glide to the next "scene" in the direction you were going,
   so every section (and every gallery project / About card) sits firmly in place. */
function initSceneSnapping(projectsST, aboutST, projectCount) {
  const C = window.PORTFOLIO_CONFIG;
  const top = (sel) => document.querySelector(sel).getBoundingClientRect().top + window.scrollY;
  function stops() {
    const max = ScrollTrigger.maxScroll(window);
    const pts = [0, top(".find")];
    for (let k = 0; k < projectCount; k++) pts.push(projectsST.start + (k * (projectsST.end - projectsST.start)) / (projectCount - 1));
    C.about.snapAt.forEach((f) => pts.push(aboutST.start + f * (aboutST.end - aboutST.start)));
    pts.push(top(".contact"), max);
    return [...new Set(pts.map((v) => Math.min(1, Math.max(0, v / max))))].sort((a, b) => a - b);
  }
  ScrollTrigger.create({
    start: 0, end: "max",
    snap: {
      snapTo: (progress, self) => {
        const pts = stops(), eps = 0.0005;
        const next = self.direction > 0 ? pts.find((p) => p >= progress - eps) : [...pts].reverse().find((p) => p <= progress + eps);
        return next !== undefined ? next : self.direction > 0 ? pts[pts.length - 1] : pts[0];
      },
      duration: C.transitions.snapDuration, delay: C.transitions.snapDelay, ease: "power2.inOut",
    },
  });
}
