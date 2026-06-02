/* IBC V6 — Kirie / Paper Craft */
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
    tl.from('.hero__tag', { y: -10, opacity: 0, duration: .55, ease: 'back.out(1.6)' }, .15);

    tl.to('.js-title-line .hero__title-inner', {
      y: 0, duration: 1.0, stagger: .14, ease: 'expo.out'
    }, .3);

    tl.from('.hero__sub', { y: 20, opacity: 0, duration: .7 }, .85);
    tl.from('.hero__ctas .btn', { y: 30, opacity: 0, duration: .5, stagger: .12, ease: 'back.out(1.6)' }, 1.05);
    tl.from('.hero__stat', { y: 30, opacity: 0, scale: .85, duration: .5, stagger: .12, ease: 'back.out(1.6)' }, 1.2);

    // 紙のレイヤーが順に立ち上がる
    tl.from('.hill--back', { y: 60, opacity: 0, duration: 1.0 }, .1);
    tl.from('.hill--right', { y: 60, opacity: 0, duration: 1.0 }, .25);
    tl.from('.hill--front', { y: 60, opacity: 0, duration: 1.0 }, .4);
    tl.from('.cloud', { x: -40, opacity: 0, duration: .9, stagger: .15 }, .3);
    tl.from('.sun', { scale: 0, opacity: 0, duration: 1.0, ease: 'back.out(1.5)' }, .15);

    // Photo & accessories
    tl.from('.hero__photo', { y: 60, opacity: 0, rotation: -8, duration: 1.0, ease: 'expo.out' }, .5);
    tl.from('.hero__sub-photo', { scale: 0, opacity: 0, y: 30, duration: .65, stagger: .15, ease: 'back.out(1.8)' }, 1.0);
    tl.from('.hero__badge', { scale: 0, opacity: 0, rotation: -180, duration: .8, ease: 'back.out(1.6)' }, 1.2);
    tl.from('.flower', { scale: 0, opacity: 0, duration: .5, stagger: .1, ease: 'back.out(2)' }, 1.3);

    // Parallax
    if (window.ScrollTrigger) {
      gsap.to('.sun', { y: -60, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.cloud--1', { x: 100, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.cloud--2', { x: -120, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hill--back',  { yPercent: 20, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hill--front', { yPercent: 40, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__visual', { yPercent: -8, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }
  } else {
    $$('.js-title-line .hero__title-inner').forEach(el => el.style.transform = 'translateY(0)');
  }
})();
