/* IBC V15 — Retro Sunset */
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

    // Sun rises
    tl.from('.sun', { y: 200, scale: .6, opacity: 0, duration: 1.6, ease: 'expo.out' }, 0);
    tl.from('.sun-stripes', { opacity: 0, duration: 1.0 }, 1.0);
    tl.from('.horizon', { opacity: 0, duration: 1.4 }, .5);

    tl.from('.star-deco', { scale: 0, opacity: 0, duration: .5, stagger: .12, ease: 'back.out(2)' }, .8);

    tl.from('.nav__inner > *', { y: -16, opacity: 0, duration: .5, stagger: .08 }, 0);
    tl.from('.hero__tag', { y: -10, opacity: 0, duration: .55, ease: 'back.out(1.6)' }, .15);
    tl.from('.hero__title-en', { x: -30, opacity: 0, duration: .7 }, .3);

    tl.to('.js-title-line .hero__title-inner', {
      y: 0, duration: 1.05, stagger: .14, ease: 'expo.out'
    }, .5);

    tl.from('.hero__sub', { y: 20, opacity: 0, duration: .7 }, 1.05);
    tl.from('.hero__ctas .btn', { y: 30, opacity: 0, duration: .55, stagger: .12, ease: 'back.out(1.6)' }, 1.2);
    tl.from('.hero__cell', { y: 30, opacity: 0, scale: .9, duration: .55, stagger: .12, ease: 'back.out(1.5)' }, 1.35);

    // Photos
    tl.from('.hero__photo', { y: 60, opacity: 0, rotation: -8, duration: 1.0, ease: 'expo.out' }, .55);
    tl.from('.hero__polaroid', { scale: 0, opacity: 0, duration: .7, stagger: .15, ease: 'back.out(1.8)' }, 1.0);
    tl.from('.hero__badge', { scale: 0, opacity: 0, rotation: -180, duration: .9, ease: 'back.out(1.6)' }, 1.25);

    // VHS glitch on title every 8s
    const vhs = $('.hero__title-vhs');
    if (vhs) {
      setInterval(() => {
        gsap.timeline()
          .to(vhs, { x: -3, skewX: 3, duration: .05 })
          .to(vhs, { x: 3, skewX: -3, duration: .05 })
          .to(vhs, { x: 0, skewX: 0, duration: .05 });
      }, 8000);
    }

    // Parallax
    if (window.ScrollTrigger) {
      gsap.to('.sun', { yPercent: 20, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.horizon', { yPercent: 40, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.star-deco', { y: -80, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__visual', { yPercent: -8, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }
  } else {
    $$('.js-title-line .hero__title-inner').forEach(el => el.style.transform = 'translateY(0)');
  }
})();
