/* IBC V24 — Photo Wall Light (V22 派生) */
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
      duration: 1.2,
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

    tl.from('.nav__inner > *', { y: -16, opacity: 0, duration: .5, stagger: .08, ease: 'power3.out' }, 0);

    // Tiles cascade in
    const tiles = $$('.tile');
    tiles.forEach((tile, i) => {
      tl.fromTo(tile,
        { scale: .9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: .75 },
        .1 + i * .06);
    });

    // Center card
    tl.from('.center-card', { scale: .92, opacity: 0, y: 30, duration: .9 }, .8);
    tl.from('.center-card__img-label, .center-card__img-tag',
      { opacity: 0, x: -10, duration: .5, stagger: .12, ease: 'power3.out' }, 1.2);
    tl.from('.center-card__chip', { x: -16, opacity: 0, duration: .55, ease: 'power3.out' }, 1.25);
    tl.from('.js-title-line .hero__title-inner', { y: 60, duration: .9, stagger: .15 }, 1.35);
    tl.from('.hero__lead', { y: 14, opacity: 0, duration: .65, ease: 'power3.out' }, 1.6);
    tl.from('.hero__stat', { y: 14, opacity: 0, duration: .55, stagger: .1, ease: 'power3.out' }, 1.7);
    tl.from('.hero__ctas .btn', { y: 20, opacity: 0, duration: .55, stagger: .12, ease: 'back.out(1.6)' }, 1.9);

    // Counter
    $$('.hero__stat-num .count').forEach((el) => {
      const target = parseInt(el.dataset.target, 10);
      const obj = { v: 0 };
      tl.to(obj, { v: target, duration: 1.0, ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(obj.v); } }, 1.75);
    });

    // Parallax on tile images
    if (window.ScrollTrigger) {
      tiles.forEach((t, i) => {
        const depth = (i % 3) * 12 + 8;
        gsap.to(t.querySelector('img'), {
          yPercent: -depth, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
        });
      });
      gsap.to('.center-card', { yPercent: -6, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    /* Magnetic CTAs */
    if (matchMedia('(pointer:fine)').matches) {
      $$('.btn').forEach((b) => {
        b.addEventListener('mousemove', (e) => {
          const r = b.getBoundingClientRect();
          gsap.to(b, {
            x: (e.clientX - (r.left + r.width / 2)) * .15,
            y: (e.clientY - (r.top + r.height / 2)) * .15,
            duration: .25
          });
        });
        b.addEventListener('mouseleave', () => gsap.to(b, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1,.4)' }));
      });
    }
  } else {
    $$('.tile').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  }
})();
