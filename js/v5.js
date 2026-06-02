/* IBC V5 — Cyber Kawaii / Y2K */
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
      duration: 1.1,
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
    tl.from('.hero__chip', { scale: 0, opacity: 0, duration: .6, ease: 'back.out(2)' }, .15);

    tl.to('.js-title-line .hero__title-inner', {
      y: 0, duration: 1.0, stagger: .14, ease: 'expo.out'
    }, .3);

    tl.from('.hero__sub', { y: 20, opacity: 0, duration: .7 }, .85);
    tl.from('.hero__ctas .btn', { y: 24, scale: .85, opacity: 0, duration: .6, stagger: .12, ease: 'back.out(1.6)' }, 1.05);
    tl.from('.hero__stat', { y: 30, scale: .8, opacity: 0, duration: .55, stagger: .12, ease: 'back.out(1.6)' }, 1.2);

    // Photo halo spin in
    tl.from('.hero__photo', { scale: 0, opacity: 0, rotation: -180, duration: 1.0, ease: 'back.out(1.4)' }, .4);

    // Tiles flying in
    tl.from('.hero__tile', { scale: 0, opacity: 0, y: 60, rotation: 0, duration: .65, stagger: .12, ease: 'back.out(2)' }, .8);

    // Bubbles
    tl.from('.hero__bubble', { scale: 0, opacity: 0, duration: .55, stagger: .15, ease: 'back.out(2.2)' }, 1.2);

    // Decorations: pop in
    tl.from('.deco', { scale: 0, opacity: 0, duration: .5, stagger: .08, ease: 'back.out(2)' }, 1.3);

    // Arrow handwriting
    tl.from('.hero__arrow', { x: -20, opacity: 0, duration: .7, ease: 'power2.out' }, 1.5);

    // Parallax: photos, decorations
    if (window.ScrollTrigger) {
      gsap.to('.deco--sparkle1', { y: -100, rotation: 60, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.deco--heart', { y: -150, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.deco--butterfly', { y: -120, x: 40, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__visual', { yPercent: -8, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    /* Mouse-based parallax on decorations (PC) */
    if (matchMedia('(pointer:fine)').matches) {
      const hero = $('.hero');
      const decos = $$('.deco');
      hero?.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - .5) * 2;
        const y = (e.clientY / window.innerHeight - .5) * 2;
        decos.forEach((el, i) => {
          const depth = (i % 3 + 1) * 8;
          gsap.to(el, { x: x * depth, y: y * depth, duration: .8, ease: 'power3.out' });
        });
      });
    }
  } else {
    $$('.js-title-line .hero__title-inner').forEach(el => el.style.transform = 'translateY(0)');
  }
})();
