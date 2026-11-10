/* ============================================================
   MAIN.JS - starts everything. Scroll scenes are created in the
   order they appear on the page so pinning is calculated right.
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  // The "get in touch" popup (contact-overlay.js). Runs first and is wrapped so a problem here can never stop the rest of the site.
  try { initContactOverlay(); } catch (err) { console.warn("Contact popup could not start:", err); }
  gsap.registerPlugin(ScrollTrigger);

  initRepulsion();

  // Scene transitions only on wider screens without reduced-motion.
  // Otherwise everything stays a plain, fully visible page (see css).
  const mm = gsap.matchMedia();
  mm.add("(min-width: 701px) and (min-aspect-ratio: 5/4) and (prefers-reduced-motion: no-preference)", () => {
    document.documentElement.classList.add("motion"); // CSS switches to the animated layout
    initHeroEntrance();
    initFindEntrance();
    const projectsST = initProjectsGallery();
    initProjectsEntrance();
    const aboutST = initAboutCards();
    initContactEntrance();
    initFooterEntrance();
    initProjectLinkTransition();
    initSceneSnapping(projectsST, aboutST, document.querySelectorAll(".proj").length);
    return () => document.documentElement.classList.remove("motion");
  });

  // Phones and upright tablets: a natural page (see css/responsive.css) with simple rise-in reveals.
  // KEEP this query in step with the "compact" media query in css/responsive.css.
  mm.add("(max-width: 700px) and (prefers-reduced-motion: no-preference), (max-aspect-ratio: 5/4) and (prefers-reduced-motion: no-preference)", () => {
    initHeroEntrance();
    initFindEntrance();   // same word-by-word rise as desktop
    initSimpleReveals();
  });

  // Re-measure once fonts and images have loaded
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener("load", () => ScrollTrigger.refresh());
});
