/* ============================================================
   PROJECT-PAGE.JS - behaviour shared by every project page.
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  // The "get in touch" popup (contact-overlay.js). Runs first and is wrapped so a problem here can never stop the rest of the site.
  try { initContactOverlay(); } catch (err) { console.warn("Contact popup could not start:", err); }
  gsap.registerPlugin(ScrollTrigger);
  initRepulsion();   // footer letters (from interactions.js)

  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const wait = playArrivalTransition();

    // Title, description, tags rise in
    gsap.timeline({ defaults: { ease: "expo.out" }, delay: wait })
      .from(".project-title", { yPercent: 40, opacity: 0, duration: 1.1 })
      .from(".project-desc", { yPercent: 25, opacity: 0, duration: 0.9, stagger: 0.1 }, "-=0.8")
      .from(".project-tags .pill", { yPercent: 60, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.6");

    // Each image rises in once as it scrolls into view
    gsap.utils.toArray(".project-img").forEach((fig) => {
      gsap.from(fig, { yPercent: 6, opacity: 0, duration: 1, ease: "expo.out",
        scrollTrigger: { trigger: fig, start: "top 88%", toggleActions: "play none none none" } });
    });

    initContactEntrance();   // from scroll-animations.js
    initFooterEntrance();
  });
  // Images have different heights, so re-measure the page each time one finishes loading
  document.querySelectorAll(".project-img img").forEach((img) => {
    if (!img.complete) img.addEventListener("load", () => ScrollTrigger.refresh());
  });
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener("load", () => ScrollTrigger.refresh());
});
