# Reference source adaptation

Source: https://github.com/red1-for-hek/portfolio-website

Revision: e1491d6d709d4fa6df2ca88277f0c31b5e4f6ea7

Copyright (c) 2025 Redoyanul Haque. MIT license retained in `public/reference-LICENSE.txt` and included in the deployed output.

Directly copied and personalized: Landing, About, HoverLinks, and their styles, Navbar styles, Loading styles, and base styles. IntroLoader uses the original Loading markup and visual effects with bounded, real asset loading progress and cleanup. App adapts the original Navbar Lenis setup and GsapScroll/initialFX timelines to a persistent Moon scene, responsive layouts, and reduced motion.

Preserved Ammar's biography, socials, project atlas and optimized Moon asset. Reference-only identity, portrait, project claims, analytics and backend services were not transferred. Existing GitHub Pages workflow remains the deployment method.

Previous local source is backed up under ignored `.research/pre-reference/src`. The reference checkout is under ignored `.research/reference-repo`.

The hero now uses the reference character rig with a separate warm brown skin material on its face, ears, neck and hands. `scripts/prepare-character.mjs` builds `public/models/character-brown.glb` from the original GLB. Clothing, hair and eye materials are preserved. `src/Character.tsx` uses the original intro pose, filtered typing animation and blink clip, with head tracking, scroll rotation, pause/reduced-motion handling and resource cleanup. The Moon asset remains available but is not displayed.

## October 2026: reference structure and chess
- Main scrolling page: Home, About, CV Experience, selected Work, GIS tech stack, chess invitation and Contact. Separate hash pages: #myworks and #play. Navbar remains About / Work / Contact.
- Original hair restored; brown skin retained. Character uses the reference introAnimation after loader completion, front/turned/desk views, blinking and typing. Motion pause and reduced-motion remain supported.
- Added a visible purple pointer circle for fine pointers, with no pointer interception.
- Chess uses chess.js legal rules and a local worker-based minimax opponent with three difficulties. It does not reproduce Ammar's playing style or verified Elo. Profile ratings are a user-supplied screenshot snapshot, not live data.
- Validation: production build and chess rule checks passed; browser move e4 received Nc6, undo and flip worked; Home, chess and project layout widths checked at 360px without horizontal overflow. Repository detail link verified.

## Project imagery and darker hero
- User-supplied OVC and GeoQA logos: public/images/projects/ovc-logo.png and geoqa-logo.png.
- OVC screenshots from README: https://github.com/AmmarYasser455/ovc (docs/assets/buildings_wm.jpg, docs/assets/road_wm.jpg).
- ArcGIS screenshot from README: https://github.com/AmmarYasser455/ovc-arcgis-pro (docs/images/build_ov.png).
- Source images preserved without retouching; cards use contain sizing, detailed results appear below the project map.
- Removed visible footer adaptation credit at user's request. MIT notice remains in public/reference-LICENSE.txt and the production build.
- Localized character halo; pointer-follow smoothing increased from 4 to 8 per second for the head only, keeping camera/scroll motion unchanged.

## Moon tech-stack interaction
- Replaced decorative ring with supplied moon.glb, lazy-mounted near the tech section. Section-relative scroll rotates, shifts and zooms the moon; pointer motion adds a small tilt. Violet rim light, sparse stars and opaque-backed skill tiles preserve contrast.
- Tech icons reveal individual colors on hover and keyboard focus. Social rail gains a lavender pill and dark icons on hover/focus-within.
- Shared motion toggle and prefers-reduced-motion disable moon movement; offscreen rendering suspends. 360px width check passed; 23 tiles retained. Browser verified colored focus state, social pill, loaded moon, changing section scroll progress and pause/resume control. Production build passed.
