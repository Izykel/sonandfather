# sonandfather

Landing page for Son and Father Gas, a cooking gas (LPG) delivery service in Port Harcourt.

Static HTML + Tailwind CSS (CLI build) + a small vanilla JS motion layer. No framework, no runtime dependencies.

```
index.html            page markup
src/input.css         Tailwind source: tokens, components, animations
dist/styles.css       compiled CSS (commit after building)
assets/js/main.js     scroll reveals, parallax, count-up, area selector, sticky mobile CTA
assets/optimized/     resized WebP/JPEG images, logo and favicons
```

## Build

```
npm install
npm run build:css:prod   # minified build
npm run watch:css        # rebuild on change while developing
```

## Notes

- Brand palette: amber `#ffc121`, ink `#141414`, black `#2b2b2b`. Defined in `tailwind.config.cjs`.
- Fonts: Bricolage Grotesque for headings, Inter for body text.
- All motion uses `transform`/`opacity` only and is turned off under `prefers-reduced-motion`.
- Scroll-reveal content is only hidden when JS runs (`html.js`), so the page still reads fine without JS.
- Picking a delivery area adds it to every WhatsApp order link's message.
