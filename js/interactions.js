/* ============================================================
   INTERACTIONS.JS - repulsion for the big letters (hero + footer)
   and the floating pills (hero + find section).
   - Mouse: things slide away from the cursor and ease back.
   - Touch: the same effect follows your FINGER while you drag
     (page scrolling is never blocked). Lift your finger and
     everything eases home.
   Not used when the visitor has reduced motion switched on.
============================================================ */
function initRepulsion() {
  const cfg = window.PORTFOLIO_CONFIG.repulsion;
  const mm = gsap.matchMedia();

  // Build one record per element, with "quickTo" setters (fast, smooth x/y movers).
  function buildItems(lettersCfg, pillsCfg) {
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
    add(".wm-letter", lettersCfg);
    add(".hero .pill, .find .pill", pillsCfg);
    return items;
  }

  // Push every element away from the point (px, py). `skip(el)` can exempt an element.
  function pushAway(items, px, py, skip) {
    items.forEach((item) => {
      const box = item.el.getBoundingClientRect();
      // Skip (and settle) anything far off-screen
      if (box.bottom < -item.radius || box.top > window.innerHeight + item.radius || (skip && skip(item.el))) {
        item.moveX(0); item.moveY(0); return;
      }
      // Centre of the element when it is NOT pushed (subtract its current push)
      const cx = box.left + box.width / 2 - gsap.getProperty(item.el, "x");
      const cy = box.top + box.height / 2 - gsap.getProperty(item.el, "y");
      const dx = cx - px, dy = cy - py;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < item.radius) {
        const force = 1 - dist / item.radius;           // 1 at the pointer, 0 at the edge of the radius
        item.moveX((dx / dist) * item.strength * force); // push directly away from the pointer
        item.moveY((dy / dist) * item.strength * force);
      } else { item.moveX(0); item.moveY(0); }          // out of range: glide home
    });
  }
  const settle = (items) => items.forEach((i) => { i.moveX(0); i.moveY(0); });

  // ---------- MOUSE (desktop, laptop) ----------
  mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
    const items = buildItems(cfg.letters, cfg.pills);
    const onPointerMove = (e) => pushAway(items, e.clientX, e.clientY);
    const reset = () => settle(items);
    window.addEventListener("pointermove", onPointerMove);
    document.documentElement.addEventListener("mouseleave", reset);
    return () => { // cleanup if the media query stops matching
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", reset);
      items.forEach((i) => gsap.set(i.el, { x: 0, y: 0 }));
    };
  });

  // ---------- TOUCH (phones, tablets) ----------
  mm.add("((hover: none) or (pointer: coarse)) and (prefers-reduced-motion: no-preference)", () => {
    const T = cfg.touch;
    const items = buildItems(T.letters, T.pills);
    let startX = 0, startY = 0, startTarget = null, dragging = false;

    const onStart = (e) => {
      const t = e.touches[0];
      startX = t.clientX; startY = t.clientY; startTarget = e.target; dragging = false;
    };
    const onMove = (e) => {
      const t = e.touches[0];
      // Only treat it as a "drag" once the finger has really moved (a tap never pushes anything)
      if (!dragging && Math.hypot(t.clientX - startX, t.clientY - startY) < T.dragStart) return;
      dragging = true;
      // The pill/link you touched down on stays put, so it can still be tapped
      pushAway(items, t.clientX, t.clientY, (el) => startTarget && el.contains(startTarget));
    };
    const onEnd = () => { dragging = false; startTarget = null; settle(items); };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });     // passive: never blocks scrolling
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
      items.forEach((i) => gsap.set(i.el, { x: 0, y: 0 }));
    };
  });
}
