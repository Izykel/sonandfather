/* Son and Father Gas — interaction & motion layer.
   Everything here is progressive enhancement: the page is fully
   readable and every link works without it. */
(() => {
  const WA_NUMBER = "2348102308647";
  const WA_BASE = "Hello, I want to order cooking gas.";

  /* ---------- Scroll reveals ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -4% 0px", threshold: 0 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Deferred sections ----------
     Sections with .defer-render skip layout until they near the viewport.
     Before an in-page link scrolls (or when the page opens on a #hash),
     render them in full so the scroll target position is exact. */
  const deferred = document.querySelectorAll(".defer-render");
  const renderDeferred = () => deferred.forEach((el) => el.classList.add("is-rendered"));
  if (location.hash) renderDeferred();
  document.addEventListener(
    "click",
    (e) => {
      const link = e.target.closest?.('a[href^="#"]');
      if (link && link.getAttribute("href").length > 1) renderDeferred();
    },
    { capture: true }
  );

  /* ---------- Parallax ----------
     Desktop only (wide screen + mouse), never with reduced motion.
     Layer positions are measured once (load, resize, font swap) so scrolling
     only does arithmetic and writes transforms: no layout reads per frame. */
  const parallaxQuery = window.matchMedia(
    "(min-width: 768px) and (hover: hover) and (prefers-reduced-motion: no-preference)"
  );
  const layers = Array.from(document.querySelectorAll("[data-parallax]")).map((el) => ({
    el,
    speed: parseFloat(el.dataset.parallax) || 0,
    // The untransformed parent, so a layer's own offset never feeds back
    anchor: el.parentElement,
    top: 0,
    height: 0,
    active: false,
  }));
  let viewportH = window.innerHeight;
  let parallaxOn = false;
  let ticking = false;

  const measure = () => {
    viewportH = window.innerHeight;
    const scrollY = window.scrollY;
    for (const layer of layers) {
      const rect = layer.anchor.getBoundingClientRect();
      layer.top = rect.top + scrollY;
      layer.height = rect.height;
    }
  };
  const renderParallax = () => {
    ticking = false;
    if (!parallaxOn) return;
    const center = window.scrollY + viewportH / 2;
    for (const layer of layers) {
      if (!layer.active) continue;
      const offset = layer.top + layer.height / 2 - center;
      const y = Math.max(-120, Math.min(120, -offset * layer.speed));
      layer.el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    }
  };
  const requestParallax = () => {
    if (parallaxOn && !ticking) {
      ticking = true;
      requestAnimationFrame(renderParallax);
    }
  };
  let resizeTimer = 0;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      measure();
      requestParallax();
    }, 150);
  };

  let layerObserver = null;
  const enableParallax = () => {
    if (parallaxOn || !layers.length || !("IntersectionObserver" in window)) return;
    parallaxOn = true;
    document.documentElement.classList.add("parallax-on");
    measure();
    layerObserver ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          for (const layer of layers) {
            if (layer.anchor === entry.target) layer.active = entry.isIntersecting;
          }
        }
        requestParallax();
      },
      { rootMargin: "20% 0px" }
    );
    new Set(layers.map((l) => l.anchor)).forEach((anchor) => layerObserver.observe(anchor));
    window.addEventListener("scroll", requestParallax, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("load", onResize, { once: true });
    document.fonts?.ready.then(onResize);
  };
  const disableParallax = () => {
    if (!parallaxOn) return;
    parallaxOn = false;
    document.documentElement.classList.remove("parallax-on");
    layerObserver?.disconnect();
    window.removeEventListener("scroll", requestParallax);
    window.removeEventListener("resize", onResize);
    layers.forEach((l) => (l.el.style.transform = ""));
  };
  const syncParallax = () => (parallaxQuery.matches ? enableParallax() : disableParallax());
  syncParallax();
  parallaxQuery.addEventListener?.("change", syncParallax);

  /* ---------- Nav state + mobile order bar ---------- */
  const nav = document.querySelector(".site-nav");
  const hero = document.querySelector("[data-hero]");
  const ctaBar = document.querySelector("[data-cta-bar]");

  let scrolled = null;
  const onScroll = () => {
    const next = window.scrollY > 24;
    if (next !== scrolled) {
      scrolled = next;
      nav?.classList.toggle("is-scrolled", next);
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Show the bar only between the hero and the footer, where no other order button is on screen
  const footer = document.querySelector("[data-footer]");
  if (hero && ctaBar && "IntersectionObserver" in window) {
    const inView = new Map();
    const barObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) inView.set(entry.target, entry.isIntersecting);
        const show = !inView.get(hero) && !inView.get(footer);
        ctaBar.classList.toggle("is-shown", show);
        ctaBar.inert = !show;
      },
      { threshold: 0.05 }
    );
    barObserver.observe(hero);
    if (footer) barObserver.observe(footer);
  }

  /* ---------- Area selector → WhatsApp message ---------- */
  const waLinks = document.querySelectorAll("[data-wa-link]");
  const areaCta = document.querySelector("[data-area-cta]");
  const setArea = (area) => {
    const text = area ? `${WA_BASE} My area: ${area}.` : WA_BASE;
    const href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    waLinks.forEach((a) => (a.href = href));
    if (areaCta && area) areaCta.textContent = `Order for ${area}`;
  };
  document.querySelector("[data-area-select]")?.addEventListener("change", (e) => {
    if (e.target.name === "area") setArea(e.target.value);
  });

  /* ---------- Footer year ---------- */
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
