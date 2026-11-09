/* ============================================================
   CONTACT-OVERLAY.JS - the "get in touch" popup.
   - Any element with  data-open-contact  opens it (the "get in touch" buttons and the "contact me" links).
   - It opens right where you are on the page (it is pinned to the window), dims the page behind it,
     and keeps keyboard focus inside until you close it.
   - The X button, the Esc key, or a click on the dimmed area close it. Focus returns to the button you used.
   - The popup's HTML is built here, and your details (phone, email, links)
     come from js/config.js -> PORTFOLIO_CONFIG.contact. Edit them THERE.
   - Without JavaScript the buttons still work: they are plain mailto:/anchor links.
   Called from main.js (homepage) and project-page.js (project pages).
============================================================ */
function initContactOverlay() {
  // Details come from js/config.js -> contact. These fallbacks keep the popup working even if that block is missing.
  const C = Object.assign({
    phone: "7356192843", email: "aleenaashk@gmail.com",
    behance: "https://www.behance.net/aleenask", linkedin: "https://www.linkedin.com/in/aleena-khalid-86309b361",
    resume: "assets/resume.pdf",
  }, window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.contact);
  const openers = document.querySelectorAll("[data-open-contact]");
  if (!openers.length) return;

  // Project pages live one folder down, so file paths need "../" in front
  const base = document.body.classList.contains("project-page") ? "../" : "";
  // "https://www.behance.net/aleenask/" -> "behance.net/aleenask" (the text shown in the popup)
  const nice = (url) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

  // ---------- 1. BUILD THE POPUP (once) ----------
  // Remove any leftover popup from an older version (e.g. an old <dialog> pasted into the page by hand)
  document.querySelectorAll("dialog#contact-dialog, dialog.contact, #contact-overlay").forEach((old) => old.remove());
  const holder = document.createElement("div");
  holder.innerHTML = `
<div class="contact-overlay" id="contact-overlay" role="dialog" aria-modal="true" aria-labelledby="contact-overlay-title" hidden>
  <div class="contact-overlay__card">

    <h2 class="contact-overlay__sr-only" id="contact-overlay-title">Contact details</h2>

    <button type="button" class="contact-overlay__close" data-close-contact aria-label="Close contact details">
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
        <path d="M1 1l10 10M11 1L1 11" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
    </button>

    <ul class="contact-overlay__list">

      <li class="contact-overlay__row">
        <span class="contact-overlay__icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" focusable="false">
            <path fill="#E8858E" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"/>
          </svg>
        </span>
        <div class="contact-overlay__text">
          <p class="contact-overlay__label">Phone Number</p>
          <p class="contact-overlay__value">${C.phone}</p>
        </div>
      </li>

      <li class="contact-overlay__row">
        <span class="contact-overlay__icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 48 48" focusable="false">
            <path fill="#4caf50" d="M45 16.2l-5 2.75-5 4.75L35 40h7c1.657 0 3-1.343 3-3V16.2z"/>
            <path fill="#1e88e5" d="M3 16.2l3.614 1.71L13 23.7V40H6c-1.657 0-3-1.343-3-3V16.2z"/>
            <polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"/>
            <path fill="#c62828" d="M3 12.298V16.2l10 7.5V11.2L9.876 8.859C9.132 8.301 8.228 8 7.298 8 4.924 8 3 9.924 3 12.298z"/>
            <path fill="#fbc02d" d="M45 12.298V16.2l-10 7.5V11.2l3.124-2.341C38.868 8.301 39.772 8 40.702 8 43.076 8 45 9.924 45 12.298z"/>
          </svg>
        </span>
        <div class="contact-overlay__text">
          <p class="contact-overlay__label">Email</p>
          <p class="contact-overlay__value">${C.email}</p>
        </div>
      </li>

      <li class="contact-overlay__row">
        <span class="contact-overlay__icon" aria-hidden="true">
          <svg width="30" height="30" viewBox="0 0 30 30" focusable="false">
            <rect width="30" height="30" rx="7" fill="#1769ff"/>
            <text x="15" y="20.5" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="15" fill="#fff">Bē</text>
          </svg>
        </span>
        <div class="contact-overlay__text">
          <p class="contact-overlay__label">Behance</p>
          <p class="contact-overlay__value">
            <a href="${C.behance}" target="_blank" rel="noopener noreferrer">${nice(C.behance)}<span class="contact-overlay__sr-only"> (opens in a new tab)</span></a>
          </p>
        </div>
      </li>

      <li class="contact-overlay__row">
        <span class="contact-overlay__icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" focusable="false">
            <path fill="#2D78B6" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/>
          </svg>
        </span>
        <div class="contact-overlay__text">
          <p class="contact-overlay__label">LinkedIn</p>
          <p class="contact-overlay__value">
            <a href="${C.linkedin}" target="_blank" rel="noopener noreferrer">${nice(C.linkedin)}<span class="contact-overlay__sr-only"> (opens in a new tab)</span></a>
          </p>
        </div>
      </li>
    </ul>

    <a class="contact-overlay__resume" href="${base}${C.resume}" aria-label="Resume (PDF)">resume</a>

  </div>
</div>`;
  const overlay = holder.firstElementChild;
  const card = overlay.querySelector(".contact-overlay__card");
  card.setAttribute("tabindex", "-1");
  document.body.appendChild(overlay);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const canAnimate = () => window.gsap && !reduceMotion.matches;
  let isOpen = false, closing = false, lastOpener = null;
  let inerted = [];   // page parts switched off while the popup is open

  // ---------- 2. OPEN ----------
  function openContact(opener) {
    if (isOpen) return;
    isOpen = true; closing = false; lastOpener = opener || document.activeElement;
    overlay.hidden = false;
    // Switch off everything else on the page so Tab and clicks can't reach it
    inerted = [...document.body.children].filter((el) => el !== overlay && el.tagName !== "SCRIPT" && !el.inert);
    inerted.forEach((el) => { el.inert = true; });
    if (canAnimate()) {
      // soft fade, small rise and tiny scale-up (change the durations to speed up / slow down)
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.fromTo(card, { y: 16, scale: 0.96 }, { y: 0, scale: 1, duration: 0.35, ease: "power3.out" });
    }
    card.focus({ preventScroll: true });   // focus starts on the card itself (no visible ring); Tab then moves to the X, links and resume
  }

  // ---------- 3. CLOSE ----------
  function closeContact() {
    if (!isOpen || closing) return;
    closing = true;
    const finish = () => {
      overlay.hidden = true;
      if (window.gsap) gsap.set([overlay, card], { clearProps: "all" });   // reset so it can animate next time
      inerted.forEach((el) => { el.inert = false; });
      inerted = [];
      isOpen = false; closing = false;
      if (lastOpener && lastOpener.focus) lastOpener.focus({ preventScroll: true });   // back to the button you used
    };
    if (canAnimate()) {
      gsap.to(card, { y: 8, scale: 0.98, duration: 0.2, ease: "power2.in" });
      gsap.to(overlay, { opacity: 0, duration: 0.2, ease: "power2.in", onComplete: finish });
    } else finish();
  }

  // ---------- 4. WIRE UP ----------
  openers.forEach((btn) => {
    btn.setAttribute("aria-haspopup", "dialog");
    btn.addEventListener("click", (e) => { e.preventDefault(); openContact(btn); });   // stops the mailto: / #contact fallback
  });
  overlay.querySelectorAll("[data-close-contact]").forEach((btn) => btn.addEventListener("click", closeContact));

  // Click on the dimmed area closes it. Both the press AND the release must be on the dimmed area,
  // so dragging to select text inside the card and letting go outside does not close it.
  let pressedBackdrop = false;
  overlay.addEventListener("pointerdown", (e) => { pressedBackdrop = e.target === overlay; });
  overlay.addEventListener("click", (e) => { if (e.target === overlay && pressedBackdrop) closeContact(); });

  // Keyboard: Esc closes; Tab stays inside the popup
  document.addEventListener("keydown", (e) => {
    if (!isOpen) return;
    if (e.key === "Escape") { e.preventDefault(); closeContact(); return; }
    if (e.key !== "Tab") return;
    const items = [...overlay.querySelectorAll("a[href], button")];
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Stop the page scrolling behind the popup. The page itself is never touched, so it stays exactly
  // where it was and the scroll-snapping is not disturbed.
  const blockScroll = (e) => { if (overlay.scrollHeight <= overlay.clientHeight) e.preventDefault(); };
  overlay.addEventListener("wheel", blockScroll, { passive: false });
  overlay.addEventListener("touchmove", blockScroll, { passive: false });
}
