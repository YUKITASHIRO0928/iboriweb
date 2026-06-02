/* IBC V8 — Shojo Manga */
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
      duration: 1.15,
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

    tl.from('.nav__inner > *', { y: -16, opacity: 0, duration: .5, stagger: .08 }, 0);
    tl.from('.hero__chip', { y: -10, opacity: 0, duration: .55, ease: 'back.out(1.6)' }, .15);

    tl.to('.js-title-line .hero__title-inner', {
      y: 0, duration: 1.1, stagger: .14, ease: 'expo.out'
    }, .3);

    tl.from('.hero__sub', { y: 20, opacity: 0, duration: .7 }, .9);
    tl.from('.hero__ctas .btn', { y: 30, opacity: 0, duration: .55, stagger: .12, ease: 'back.out(1.6)' }, 1.1);
    tl.from('.hero__stat', { y: 30, scale: .85, opacity: 0, duration: .55, stagger: .12, ease: 'back.out(1.6)' }, 1.25);

    // Background florals
    tl.from('.cloud', { x: -30, opacity: 0, duration: .8, stagger: .15 }, .1);

    // Main photos
    tl.from('.hero__photo', { scale: .8, opacity: 0, duration: 1.0, ease: 'back.out(1.4)' }, .4);
    tl.from('.hero__heart-photo', { scale: 0, opacity: 0, rotation: -180, duration: .8, ease: 'back.out(1.6)' }, .8);
    tl.from('.hero__circle-photo', { scale: 0, opacity: 0, rotation: 180, duration: .7, ease: 'back.out(1.6)' }, .95);
    tl.from('.hero__oval-photo', { y: 60, opacity: 0, duration: .75, ease: 'expo.out' }, 1.05);
    tl.from('.hero__oval-photo-ribbon', { y: -20, scale: 0, opacity: 0, duration: .55, ease: 'back.out(2)' }, 1.4);
    tl.from('.hero__badge', { scale: 0, rotation: -180, opacity: 0, duration: .8, ease: 'back.out(1.6)' }, 1.2);
    tl.from('.hero__handwritten', { x: 30, opacity: 0, duration: .7 }, 1.35);

    // Decorations
    tl.from('.deco', { scale: 0, opacity: 0, duration: .5, stagger: .1, ease: 'back.out(2)' }, 1.3);

    // Parallax + decorations follow mouse
    if (window.ScrollTrigger) {
      gsap.to('.hero__radial', { rotation: 60, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.cloud--1', { x: 80, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.cloud--2', { x: -80, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__visual', { yPercent: -8, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.deco--heart-1', { y: -80, rotation: -15, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.deco--star-1', { y: -120, rotation: 90, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    // Mouse parallax on decorations
    if (matchMedia('(pointer:fine)').matches) {
      const hero = $('.hero');
      const decos = $$('.deco');
      hero?.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - .5) * 2;
        const y = (e.clientY / window.innerHeight - .5) * 2;
        decos.forEach((el, i) => {
          const depth = (i % 3 + 1) * 6;
          gsap.to(el, { x: x * depth, y: y * depth, duration: .8, ease: 'power3.out' });
        });
      });
    }
  } else {
    $$('.js-title-line .hero__title-inner').forEach(el => el.style.transform = 'translateY(0)');
  }
})();
