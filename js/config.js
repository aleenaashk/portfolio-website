/* ============================================================
   CONFIG.JS - every setting you might want to tweak lives here.
   (Plain script, not a module, so the site also works when you
   double-click index.html. Vite/modules come in the deploy stage.)
============================================================ */
window.PORTFOLIO_CONFIG = {

  /* Cursor repulsion: things slide away from the mouse and ease back.
     radius   = how close (in pixels) the cursor must be to push
     strength = the furthest it slides (in pixels). Bigger = stronger.
     duration = seconds it takes to follow (bigger = softer/laggier) */
  repulsion: {
    letters: { radius: 260, strength: 34, duration: 0.8 },  // aleena sk (hero + footer)
    pills:   { radius: 160, strength: 22, duration: 0.7 },  // hero + "find" pills
    /* On phones/tablets (finger instead of mouse): same idea, tuned for a small screen.
       Dragging a finger near a letter or pill pushes it away; it eases home when you lift your finger.
       A pill you touch DOWN on is never pushed, so tapping a button always works. */
    touch: {
      letters: { radius: 120, strength: 28, duration: 0.8 },
      pills:   { radius: 95,  strength: 20, duration: 0.7 },
      dragStart: 8,    // pixels the finger must move before anything is pushed (so a tap is never a push)
    },
  },

  /* Projects gallery */
  gallery: {
    scrollPerProject: 0.9,   // how many screen-heights of scrolling between one project and the next
    scrub: 1,                // seconds the animation "catches up" to the scrollbar (0 = instant)
    titleDrift: 0.022,       // how far "my projects" slides left over the whole scroll (fraction of screen width)
    /* Where a project sits depending on its distance `d` from the focused one
       (d = 0 focused, 1 = next one, -1 = previous one ...).
       x = centre (% of gallery width), w = width (% of gallery width). From your 5 frames. */
    layout: {
      focusedWidth: 37,
      positions: {
        "0":  { x: 50,  w: 37 },
        "1":  { x: 85,  w: 19 },
        "2":  { x: 97,  w: 15 },
        "-1": { x: 20,  w: 20 },
        "-2": { x: -1,  w: 15 },
      },
      farRight: { x: 125, w: 15 },  // anything further away waits off-screen right
      farLeft:  { x: -25, w: 15 },  // ...or off-screen left
      /* Vertical position (% of gallery height). Odd/even projects alternate high/low like your frames. */
      yFocused: 34, yHigh: 6, yLow: 52,
    },
    /* PHONES: the same idea in portrait. The focused project is wide; neighbours peek in from the edges.
       focusedWidth must equal the width of "html.motion .proj" inside the phone block of css/responsive.css. */
    portrait: {
      scrollPerProject: 0.8,
      layout: {
        focusedWidth: 74,
        positions: {
          "0":  { x: 50,  w: 74 },
          "1":  { x: 104, w: 34 },
          "2":  { x: 128, w: 28 },
          "-1": { x: -4,  w: 34 },
          "-2": { x: -28, w: 28 },
        },
        farRight: { x: 140, w: 28 },
        farLeft:  { x: -40, w: 28 },
        yFocused: 27, yHigh: 4, yLow: 66,
      },
    },
  },

  /* About cards: how the stack looks behind the front card (from your screenshots).
     x / y are in % of screen width, rot is degrees. */
  about: {
    scrollLength: 2.6,                    // screen-heights of scrolling to get through all three cards
    snapAt: [0, 0.433, 1],                // scroll progress where each card is settled (Intro, Education, Experience)
    enterFromPercent: 40,                 // new cards slide up from this far below (% of card height)
    back1: { x: 4.4, y: -4.8, rot: 3 },   // card one step behind the front
    back2: { x: 9.0, y: -9.9, rot: 6 },   // card two steps behind the front
  },

  /* Scene transitions: each section "arrives" with a timed animation (not tied to scroll distance),
     and scrolling snaps from scene to scene so each section sits centred before anything else happens. */
  transitions: {
    start: "top 65%",                    // an entrance starts when its section's top reaches 65% down the screen
    snapDuration: { min: 0.35, max: 0.8 }, // seconds the page takes to glide to the next scene (smaller = snappier)
    snapDelay: 0.06,                     // pause after you stop scrolling before it snaps
  },

  /* "Get in touch" popup (js/contact-overlay.js). Edit your details here, once.
     Phone and email show as plain text; behance, linkedin and resume are links.
     resume = path from the site's main folder (the code adds "../" on project pages). */
  contact: {
    phone: "7356192843",
    email: "aleenaashk@gmail.com",
    behance: "https://www.behance.net/aleenask",
    linkedin: "https://www.linkedin.com/in/aleena-khalid-86309b361",
    resume: "assets/resume.pdf",
  },

  /* Every project, in gallery order. The "More projects" strip on project pages (js/project-carousel.js)
     reads this list. image = the homepage cover (path from the main folder).
     To add a project: add a line here + a card in index.html + a page in projects/ + a line in sitemap.xml. */
  projects: [
    { slug: "graduation-showcase", title: "Graduation Showcase", category: "Identity Design",   image: "assets/images/graduation-showcase-cover.png" },
    { slug: "apple-health",        title: "Apple Health",        category: "UI/UX Design",       image: "assets/images/apple-health-cover.png" },
    { slug: "manglish-keyboard",   title: "Manglish Keyboard",   category: "UI/UX Design",       image: "assets/images/manglish-keyboard-cover.png" },
    { slug: "ezhakal",             title: "Ezhakal",             category: "Publication Design", image: "assets/images/ezhakal-cover.png" },
    { slug: "punk-decoded",        title: "Punk Decoded",        category: "Publication Design", image: "assets/images/punk-decoded-cover.png" },
  ],
};
