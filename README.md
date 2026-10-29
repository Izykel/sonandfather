# sonandfather

Landing page for Son and Father Gas, a cooking gas (LPG) delivery service in Port Harcourt.

Static HTML + Tailwind CSS (CLI build) + a small vanilla JS motion layer. No framework, no runtime dependencies.

```
index.html            page markup
src/input.css         Tailwind source: tokens, components, animations
dist/styles.css       compiled CSS (commit after building)
assets/js/main.js     scroll reveals, desktop parallax, area selector, sticky mobile CTA
assets/optimized/     resized AVIF/WebP/JPEG images, logo, icons and favicons
assets/fonts/         self-hosted Bricolage Grotesque + Inter (woff2, Latin + Latin Extended)
robots.txt, sitemap.xml, .htaccess   SEO, redirects to https://www.sonandfather.online/, caching
```

## Build

```
npm install
npm run build:css:prod   # minified build
npm run watch:css        # rebuild on change while developing
```

## Notes

- Brand palette: amber `#ffc121`, ink `#141414`, black `#2b2b2b`. Defined in `tailwind.config.cjs`.
- Fonts: Bricolage Grotesque for headings, Inter for body text, self-hosted (no Google Fonts request).
- All motion uses `transform`/`opacity` only and is turned off under `prefers-reduced-motion`.
- Scroll-reveal content is only hidden when JS runs (`html.js`), so the page still reads fine without JS.
- Picking a delivery area adds it to every WhatsApp order link's message.

## Performance notes

- After changing CSS or JS, bump the `?v=N` on the stylesheet and script links in `index.html`.
  `.htaccess` caches them for a year, so the new URL is what makes browsers fetch the update.
- Parallax runs only on desktop and never reads layout while scrolling.
- `#how` and `#faq` use `content-visibility: auto` (class `defer-render`). If their content changes a lot,
  update the measured heights in `src/input.css` so the scrollbar stays stable.
- Avoid `text-wrap: pretty/balance` on body text: it made first layout several times slower on phones.
