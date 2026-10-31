# Ammar Yasser — Portfolio

Live address: https://ammaryasser455.github.io/

React, TypeScript and Vite. Dark Geist/purple theme, animated character, scroll-linked Moon, GIS project atlas, and local chess opponent.

## Edit content
- Identity, email, social links: src/data/site.ts
- About biography: src/data/about.ts
- Project titles, descriptions, tags and features: src/data/projects.ts
- Project screenshots: src/data/projectMedia.ts and public/images/projects/
- Experience entries and section order: src/App.tsx
- Tech stack: src/TechStack.tsx
- Chess rating and player header: src/ChessPage.tsx
- Theme and responsive adjustments: src/additions.css
- Experience appearance: src/experience.css
- Animated project artwork: src/ProjectVisual.tsx and src/project-visual.css

To add a project, add its data, then add its marker and short label in src/ProjectMap.tsx. The atlas currently contains five projects.

## Develop and publish
Use Node 24. In PowerShell run npm.cmd ci, then npm.cmd run dev.
Open the localhost address; do not open index.html directly.
Before publishing, run npm.cmd run build and node scripts/check-chess.mjs.
Commit and push changes to main. GitHub Actions builds and deploys to GitHub Pages; check the Actions tab for progress.
Do not add a CNAME unless intentionally switching domains.

## Maintenance
Home and About are scrolling sections; Work and Chess are separate hash views.
Motion can be paused and reduced-motion preferences are respected.
The Moon loads near its section, 3D and chess code load separately, and project images load lazily.
Chess runs locally in a worker with a short thinking delay. Displayed ratings are manually maintained and do not calibrate the bot.
No analytics or paid services are required. Never commit credentials or private CV contact details.
Reference attribution is retained in public/reference-LICENSE.txt and docs/reference-adaptation.md.
