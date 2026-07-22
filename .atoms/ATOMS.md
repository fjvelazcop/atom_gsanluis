last_updated: 2026-07-14T19:42:19Z status: active
Project Context
Project Overview
Corporate website for Empresa San Luis - a multi-division company (Hidrocarburos, Lubricantes, Suministros, Transporte). Static site with PWA capabilities, inspired by eltunal.com structure, using Material You design system with San Luis brand identity.

Key Decisions
Date	Decision	By	Rationale
2026-07-14	Use HTML template (vanilla JS)	Alex	Requirement specifies no framework, pure HTML/CSS/JS
2026-07-14	Brand colors override Material You semantic colors	Alex	San Luis identity is primary, Material You provides structure
Constraints
Active theme: Material You (structural system: radius 1.75rem, shadows, semantic vars)
Primary brand colors: #003366 (Azul Oscuro), #95c800 (Verde Limón)
Typography: Rubik family (ExtraBold Italic for headings, Light/Regular/Medium for body)
Inter font imported for Material You system elements
Mobile-first responsive (320px to UltraWide)
PWA with service worker and manifest
No external JS dependencies (vanilla JS only)