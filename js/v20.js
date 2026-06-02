/* IBC V20 — Glass Morph */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

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

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.nav', { y: -30, opacity: 0, duration: .7 }, 0);
    tl.from('.nav__inner > *', { y: -10, opacity: 0, duration: .5, stagger: .08 }, .2);

    tl.from('.hero__label', { y: -10, opacity: 0, duration: .6, ease: 'back.out(1.6)' }, .4);

    tl.to('.js-title-line .hero__title-inner', {
      y: 0, duration: 1.1, stagger: .14, ease: 'expo.out'
    }, .55);

    tl.from('.hero__sub', { y: 20, opacity: 0, duration: .7 }, 1.1);
    tl.from('.hero__ctas .btn', { y: 24, opacity: 0, duration: .55, stagger: .12, ease: 'back.out(1.6)' }, 1.25);

    // Glass cards float in
    tl.from('.card-stat--1', { scale: .85, opacity: 0, duration: .7, ease: 'back.out(1.5)' }, .9);
    tl.from('.card-stat--2', { scale: .85, opacity: 0, duration: .7, ease: 'back.out(1.5)' }, 1.05);
    tl.from('.card-stat--3', { scale: .85, opacity: 0, duration: .7, ease: 'back.out(1.5)' }, 1.2);

    // Floating photo cards
    tl.from('.card-photo', { scale: .8, opacity: 0, duration: .9, ease: 'expo.out' }, .8);
    tl.from('.card-photo-2', { scale: 0, opacity: 0, duration: .85, ease: 'back.out(1.6)' }, 1.1);
    tl.from('.card-photo-cap', { y: 10, opacity: 0, duration: .55 }, 1.4);

    // Counter
    const numEls = $$('.card-stat-num .count');
    numEls.forEach((el) => {
      const target = parseInt(el.dataset.target, 10);
      const obj = { v: 0 };
      tl.to(obj, { v: target, duration: 1.2, ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(obj.v); } }, 1.3);
    });

    // Parallax photo bg
    if (window.ScrollTrigger) {
      gsap.to('.hero__bg img', { yPercent: 10, scale: 1.15, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.card-photo', { y: -40, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.card-photo-2', { y: -20, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.orb', { yPercent: -30, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    /* Magnetic CTAs */
    if (matchMedia('(pointer:fine)').matches) {
      $$('.btn').forEach((b) => {
        b.addEventListener('mousemove', (e) => {
          const r = b.getBoundingClientRect();
          gsap.to(b, {
            x: (e.clientX - (r.left + r.width / 2)) * .18,
            y: (e.clientY - (r.top + r.height / 2)) * .18,
            duration: .25
          });
        });
        b.addEventListener('mouseleave', () => gsap.to(b, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1,.4)' }));
      });
    }
  } else {
    $$('.js-title-line .hero__title-inner').forEach(el => el.style.transform = 'translateY(0)');
  }
})();
