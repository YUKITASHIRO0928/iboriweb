/* IBC V9 — 3D Gummy / Claymorphism */
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

    // 3Dブロブが弾むように
    tl.from('.blob', { scale: 0, opacity: 0, duration: .9, stagger: .1, ease: 'back.out(2)' }, 0);
    tl.from('.deco-heart', { scale: 0, opacity: 0, duration: .6, stagger: .15, ease: 'back.out(2)' }, .4);

    tl.from('.hero__pill', { y: -10, opacity: 0, duration: .55, ease: 'back.out(1.6)' }, .15);

    tl.to('.js-title-line .hero__title-inner', {
      y: 0, duration: 1.05, stagger: .14, ease: 'expo.out'
    }, .3);

    tl.from('.hero__sub', { y: 20, opacity: 0, duration: .7 }, .9);
    tl.from('.hero__ctas .btn', { y: 30, scale: .8, opacity: 0, duration: .65, stagger: .14, ease: 'back.out(1.8)' }, 1.05);
    tl.from('.hero__stat', { y: 40, scale: .8, opacity: 0, duration: .65, stagger: .12, ease: 'back.out(1.8)' }, 1.25);

    // Photos: bubble pop
    tl.from('.hero__photo', { scale: 0, opacity: 0, duration: 1.0, ease: 'back.out(1.5)' }, .35);
    tl.from('.hero__bubble-photo', { scale: 0, opacity: 0, duration: .7, stagger: .15, ease: 'back.out(2)' }, .9);
    tl.from('.hero__badge', { scale: 0, opacity: 0, rotation: -180, duration: .85, ease: 'back.out(1.6)' }, 1.2);

    // Parallax: blobs float in different directions
    if (window.ScrollTrigger) {
      gsap.to('.blob--blue',  { y: -100, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.blob--peach', { y: -60, x: 40, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.blob--mint',  { y: 60, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.blob--grape', { y: -80, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.blob--lemon', { y: 50, x: -20, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__visual', { yPercent: -8, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    /* Mouse parallax on blobs (PC) */
    if (matchMedia('(pointer:fine)').matches) {
      const hero = $('.hero');
      const blobs = $$('.blob, .deco-heart');
      hero?.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - .5) * 2;
        const y = (e.clientY / window.innerHeight - .5) * 2;
        blobs.forEach((el, i) => {
          const depth = (i % 4 + 1) * 6;
          gsap.to(el, { x: x * depth, y: y * depth, duration: 1.0, ease: 'power3.out' });
        });
      });
    }
  } else {
    $$('.js-title-line .hero__title-inner').forEach(el => el.style.transform = 'translateY(0)');
  }
})();
