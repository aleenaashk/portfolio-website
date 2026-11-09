/* ============================================================
   INTERACTIONS.JS - cursor repulsion for the big letters
   (hero + footer) and the floating pills (hero + find section).
   Only runs on devices with a mouse, and not with reduced motion.
============================================================ */
function initRepulsion() {
  const cfg = window.PORTFOLIO_CONFIG.repulsion;
  const mm = gsap.matchMedia();

  mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
    // Build one record per element, with "quickTo" setters (fast, smooth x/y movers).
    const items = [];
    const add = (selector, settings) => {
      gsap.utils.toArray(selector).forEach((el) => {
        items.push({
          el, ...settings,
          moveX: gsap.quickTo(el, "x", { duration: settings.duration, ease: "power3.out" }),
          moveY: gsap.quickTo(el, "y", { duration: settings.duration, ease: "power3.out" }),
        });
      });
    };
    add(".wm-letter", cfg.letters);
    add(".hero .pill, .find .pill", cfg.pills);

    function onPointerMove(e) {
      items.forEach((item) => {
        const box = item.el.getBoundingClientRect();
        // Skip (and settle) anything far off-screen
        if (box.bottom < -item.radius || box.top > window.innerHeight + item.radius) {
          item.moveX(0); item.moveY(0); return;
        }
        // Centre of the element when it is NOT pushed (subtract its current push)
        const cx = box.left + box.width / 2 - gsap.getProperty(item.el, "x");
        const cy = box.top + box.height / 2 - gsap.getProperty(item.el, "y");
        const dx = cx - e.clientX, dy = cy - e.clientY;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < item.radius) {
          const force = 1 - dist / item.radius;           // 1 at the cursor, 0 at the edge of the radius
          item.moveX((dx / dist) * item.strength * force); // push directly away from the cursor
          item.moveY((dy / dist) * item.strength * force);
        } else { item.moveX(0); item.moveY(0); }          // out of range: glide home
      });
    }
    const reset = () => items.forEach((i) => { i.moveX(0); i.moveY(0); });

    window.addEventListener("pointermove", onPointerMove);
    document.documentElement.addEventListener("mouseleave", reset);

    return () => { // cleanup if the media query stops matching
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", reset);
      items.forEach((i) => gsap.set(i.el, { x: 0, y: 0 }));
    };
  });
}
