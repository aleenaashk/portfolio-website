/* ============================================================
   PROJECTS-GALLERY.JS - one pinned timeline. Scrolling down moves
   through the projects; every project's position and size is worked
   out from how far it is from the "focused" one (see config.js),
   so adding a project to the HTML needs NO changes here.
============================================================ */
function initProjectsGallery() {
  const G = window.PORTFOLIO_CONFIG.gallery;
  const section = document.querySelector(".projects");
  const gallery = section.querySelector(".gallery");
  const items = gsap.utils.toArray(".proj");
  const n = items.length;
  if (n < 2) return;

  // Where project number i sits when project number `focus` is the focused one
  function stateFor(i, focus) {
    const d = i - focus, L = G.layout;
    const slot = L.positions[d] || (d > 0 ? L.farRight : L.farLeft);
    const y = d === 0 ? L.yFocused : (i % 2 ? L.yHigh : L.yLow); // odd = high, even = low
    return { x: slot.x, y, scale: slot.w / L.focusedWidth };
  }
  const px = (percent, size) => () => (percent / 100) * (size === "w" ? gallery.offsetWidth : gallery.offsetHeight);

  gsap.set(items, { xPercent: -50, transformOrigin: "50% 0%" }); // x = centre of the project

  const tl = gsap.timeline({
    defaults: { ease: "sine.inOut" },
    scrollTrigger: {
      trigger: section, start: "top top", pin: true, scrub: G.scrub, anticipatePin: 1,
      end: () => "+=" + (n - 1) * G.scrollPerProject * window.innerHeight,
      invalidateOnRefresh: true,   // recalculate pixel positions on resize
    },
  });

  // Each project glides from its position in frame k to its position in frame k+1
  items.forEach((el, i) => {
    for (let k = 0; k < n - 1; k++) {
      const from = stateFor(i, k), to = stateFor(i, k + 1);
      tl.fromTo(el,
        { x: px(from.x, "w"), y: px(from.y, "h"), scale: from.scale },
        { x: px(to.x, "w"), y: px(to.y, "h"), scale: to.scale, duration: 1, immediateRender: k === 0 },
        k);
    }
  });
  // KEYBOARD: tabbing to a project that is off-screen scrolls the page to the moment that project is in focus
  // (and stops the browser from scrolling the clipped gallery sideways, which would break the layout)
  const st = tl.scrollTrigger;
  section.addEventListener("scroll", () => { section.scrollLeft = 0; });
  items.forEach((el, i) => el.addEventListener("focusin", () => {
    window.scrollTo({ top: st.start + (i * (st.end - st.start)) / (n - 1) });
  }));

  // "my projects" drifts slightly left over the whole scroll
  tl.to(".projects-title", { x: () => -unit() * 100 * G.titleDrift, ease: "none", duration: n - 1 }, 0);
  return tl.scrollTrigger; // main.js uses this to snap to each project
}
