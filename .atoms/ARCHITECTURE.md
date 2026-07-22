last_updated: 2026-07-14T19:42:19Z
Architecture Design
System Overview
Static corporate website for Empresa San Luis with PWA capabilities. Pure HTML/CSS/JS architecture with Vite as build tool.

Tech Stack
HTML5 (semantic markup)
CSS3 (custom properties, Grid, Flexbox, animations)
Vanilla JavaScript (ES modules)
Vite (build/dev server)
Service Worker (offline caching)
Module Design
Module	Responsibility	Key Files
Structure	Semantic HTML layout with all sections	index.html
Styling	Material You + San Luis brand theming	style.css
Interactivity	Carousel, menu, animations, form	script.js
PWA	Offline support, asset caching	sw.js, manifest.json
Tech Decisions
Decision	Choice	Rationale
Framework	None (vanilla JS)	Requirement specifies no dependencies
CSS Architecture	Custom properties + BEM naming	Maintainable, themeable
Build Tool	Vite	Fast dev server, simple config
PWA Strategy	Stale-while-revalidate	Best UX for content sites
File Tree Plan
app/frontend/
├── index.html          # Main page with all sections
├── style.css           # Complete stylesheet
├── script.js           # All interactivity
├── sw.js               # Service worker
├── manifest.json       # PWA manifest
└── package.json        # Build config
Implementation Guide
index.html contains header, hero carousel, business units grid, about section, sustainability, contact form, and footer
style.css implements Material You design tokens (radius, shadows, semantic colors) with San Luis brand colors as primary palette
script.js handles carousel auto-play, mobile hamburger menu, scroll animations, counter animation, and contact form
sw.js implements stale-while-revalidate caching strategy
manifest.json enables PWA installation with San Luis branding