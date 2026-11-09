# aleenask-portfolio

```
aleenask-portfolio/
├── index.html                 homepage
├── robots.txt, sitemap.xml    search engines (replace USERNAME/REPO)
├── css/
│   ├── style.css              shared styling (homepage + project pages)
│   ├── responsive.css         phone / tablet layouts
│   ├── project-pages.css      project pages only
│   ├── project-carousel.css   "More projects" strip (project pages only)
│   └── contact-overlay.css    "get in touch" popup (every page)
├── js/
│   ├── config.js              ALL settings: animation numbers, contact details, project list
│   ├── main.js                starts the homepage
│   ├── project-page.js        starts each project page
│   ├── interactions.js        cursor repulsion
│   ├── scroll-animations.js   section entrances, snapping, phone reveals
│   ├── projects-gallery.js    pinned projects gallery
│   ├── page-transitions.js    homepage -> project page transition
│   ├── project-carousel.js    "More projects" strip
│   └── contact-overlay.js     "get in touch" popup (builds its own HTML)
├── projects/                  one html page per project
└── assets/                    fonts/, icons/, images/, videos/, resume.pdf (yours)
```

## Where do I edit...?
- Phone, email, Behance, LinkedIn, resume path: `js/config.js` -> `contact`
- The project list used by the "More projects" strip: `js/config.js` -> `projects`
- Adding a project: a line in `config.js` `projects`, a card in `index.html` (gallery), a copy of any file in `projects/`, a `<url>` in `sitemap.xml`
- Your website address: find/replace `https://USERNAME.github.io/REPO` across all files

## Naming rules used everywhere
- Popup: block name `contact-overlay` (classes `contact-overlay__x`, ids `contact-overlay`, `contact-overlay-title`, function `initContactOverlay()`, attribute `data-open-contact` on any button that should open it).
- `contact` (no suffix) is ONLY the "have any projects in mind?" section.
- Each `js/` file exposes `initSomething()` functions, started from `main.js` or `project-page.js`.
- Script order on every page: gsap, ScrollTrigger, config.js, contact-overlay.js, then the rest.
