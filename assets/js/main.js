/* Son and Father Gas — interaction & motion layer.
   Everything here is progressive enhancement: the page is fully
   readable and every link works without it. */
(() => {
  const WA_NUMBER = "2348102308647";
  const WA_BASE = "Hello, I want to order cooking gas.";
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduceMotion = motionQuery.matches;

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
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Parallax (transform-only, in-view layers only) ---------- */
  const layers = Array.from(document.querySelectorAll("[data-parallax]")).map((el) => ({
    el,
    speed: parseFloat(el.dataset.parallax) || 0,
    // Measure the untransformed parent so the layer's own offset never feeds back
    anchor: el.parentElement,
    active: false,
  }));

  let ticking = false;
  const renderParallax = () => {
    ticking = false;
    if (reduceMotion) return;
    const vh = window.innerHeight;
    // Gentler on small screens to avoid motion discomfort
    const factor = window.innerWidth < 768 ? 0.6 : 1;
    for (const layer of layers) {
      if (!layer.active) continue;
      const rect = layer.anchor.getBoundingClientRect();
      const offset = rect.top + rect.height / 2 - vh / 2;
      const y = Math.max(-120, Math.min(120, -offset * layer.speed * factor));
      layer.el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    }
  };
  const requestParallax = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(renderParallax);
    }
  };

  if ("IntersectionObserver" in window && layers.length) {
    const layerObserver = new IntersectionObserver(
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
    window.addEventListener("resize", requestParallax, { passive: true });
  }

  const clearParallax = () => layers.forEach((l) => (l.el.style.transform = ""));
  motionQuery.addEventListener?.("change", (e) => {
    reduceMotion = e.matches;
    reduceMotion ? clearParallax() : requestParallax();
  });

  /* ---------- Nav state + mobile order bar ---------- */
  const nav = document.querySelector(".site-nav");
  const hero = document.querySelector("[data-hero]");
  const ctaBar = document.querySelector("[data-cta-bar]");

  const onScroll = () => nav?.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (hero && ctaBar && "IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => {
        const show = !entry.isIntersecting;
        ctaBar.classList.toggle("is-shown", show);
        ctaBar.inert = !show;
      },
      { threshold: 0.05 }
    ).observe(hero);
  }

  /* ---------- Count-up ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const runCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    if (reduceMotion) return;
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          runCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => countObserver.observe(el));
  }

  /* ---------- Area selector → WhatsApp message ---------- */
  const waLinks = document.querySelectorAll("[data-wa-link]");
  const areaName = document.querySelector("[data-area-name]");
  const setArea = (area) => {
    const text = area ? `${WA_BASE} My area: ${area}.` : WA_BASE;
    const href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    waLinks.forEach((a) => (a.href = href));
    if (areaName && area) areaName.textContent = area;
  };
  document.querySelector("[data-area-select]")?.addEventListener("change", (e) => {
    if (e.target.name === "area") setArea(e.target.value);
  });

  /* ---------- Footer year ---------- */
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
