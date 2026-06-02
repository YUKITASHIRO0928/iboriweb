/* IBC V27 — Gallery Spread */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const nav = $('.nav');
  if (nav) {
    const fn = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
    fn(); window.addEventListener('scroll', fn, { passive: true });
  }

  if (window.Lenis && !reduced) {
    const lenis = new window.Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  if (window.gsap && !reduced) {
    const gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    tl.from('.nav__inner > *', { y: -16, opacity: 0, duration: .6, stagger: .08, ease: 'power3.out' }, 0);

    const tiles = $$('.tile');
    tiles.forEach((tile, i) => {
      tl.fromTo(tile,
        { opacity: 0, y: 20, scale: .96 },
        { opacity: 1, y: 0, scale: 1, duration: 1.0 },
        .15 + i * .055);
    });

    tl.from('.center-card', { scale: .94, opacity: 0, y: 30, duration: 1.1 }, .85);
    tl.from('.center-card__img-label, .center-card__img-tag',
      { opacity: 0, x: -10, duration: .55, stagger: .12, ease: 'power3.out' }, 1.3);
    tl.from('.center-card__issue > *',
      { y: -8, opacity: 0, duration: .55, stagger: .1, ease: 'power3.out' }, 1.35);
    tl.from('.js-title-line .hero__title-inner', { y: 70, duration: 1.05, stagger: .16 }, 1.55);
    tl.from('.hero__lead', { y: 14, opacity: 0, duration: .7, ease: 'power3.out' }, 1.85);
    tl.from('.hero__quote', { y: 14, opacity: 0, duration: .6, ease: 'power3.out' }, 1.95);
    tl.from('.hero__stat', { y: 14, opacity: 0, duration: .55, stagger: .12 }, 2.0);
    tl.from('.hero__ctas > *', { y: 18, opacity: 0, duration: .55, stagger: .15 }, 2.2);

    $$('.hero__stat-num .count').forEach((el) => {
      const target = parseInt(el.dataset.target, 10);
      const obj = { v: 0 };
      tl.to(obj, { v: target, duration: 1.1, ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(obj.v); } }, 2.05);
    });

    if (window.ScrollTrigger) {
      tiles.forEach((t, i) => {
        const depth = (i % 3) * 12 + 8;
        gsap.to(t.querySelector('img'), {
          yPercent: -depth, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
        });
      });
      gsap.to('.center-card', { yPercent: -5, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }
  }
})();
