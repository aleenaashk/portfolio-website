/* ============================================================
   PAGE-TRANSITIONS.JS - homepage -> project page.
   1. Click a project: its image grows to fill the screen, then the page changes.
   2. The project page starts covered by that same image, which slides away.
   Normal links still work everywhere (new tab, back/forward, direct URLs, no JS).
============================================================ */

// Remove leftover overlays if the browser restores a page from its back/forward cache
window.addEventListener("pageshow", (e) => {
  if (e.persisted) document.querySelectorAll(".transition-overlay").forEach((o) => o.remove());
});

/* HOMEPAGE: runs only when the animated layout is on */
function initProjectLinkTransition() {
  document.querySelectorAll(".proj a").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return; // let "open in new tab" work
      e.preventDefault();
      const href = link.href;
      const box = link.querySelector(".proj-img").getBoundingClientRect(); // where the image is right now
      const img = link.querySelector("img");

      const overlay = document.createElement("div");
      overlay.className = "transition-overlay";
      if (img) overlay.innerHTML = '<img alt="" src="' + img.currentSrc + '">';
      gsap.set(overlay, { top: box.top, left: box.left, width: box.width, height: box.height });
      document.body.appendChild(overlay);
      sessionStorage.setItem("projectTransition", JSON.stringify({ src: img ? img.currentSrc : "" }));

      let gone = false;
      const go = () => { if (!gone) { gone = true; window.location.href = href; } };
      gsap.to(overlay, { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight, borderRadius: 0,
        duration: 0.8, ease: "expo.inOut", onComplete: go });
      setTimeout(go, 1500); // safety: never get stuck on the homepage
    });
  });
}

/* PROJECT PAGE: if we arrived from a click, cover the page with the image, then slide it away.
   Returns how many seconds to wait before the page's own entrance animations start. */
function playArrivalTransition() {
  const saved = sessionStorage.getItem("projectTransition");
  sessionStorage.removeItem("projectTransition");
  if (!saved) return 0;                                   // direct visit, refresh, back button: no overlay
  const overlay = document.createElement("div");
  overlay.className = "transition-overlay";
  const src = JSON.parse(saved).src;
  if (src) overlay.innerHTML = '<img alt="" src="' + src + '">';
  gsap.set(overlay, { top: 0, left: 0, width: "100vw", height: "100vh", borderRadius: 0 });
  document.body.appendChild(overlay);
  gsap.to(overlay, { yPercent: -100, duration: 0.9, delay: 0.15, ease: "expo.inOut", onComplete: () => overlay.remove() });
  return 0.5;
}
