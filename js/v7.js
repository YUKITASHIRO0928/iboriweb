/* IBC V7 — Neo-Memphis / Bauhaus Pop */
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
      duration: 1.0,
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

    // シェイプが踊るように出現
    tl.from('.shape', {
      scale: 0, opacity: 0, rotation: 60,
      duration: .9, stagger: .07, ease: 'back.out(1.6)'
    }, 0);
    tl.from('.pattern--zigzag,.pattern--dots,.pattern--stripes,.pattern--wave', {
      scale: 0, opacity: 0, duration: .55, stagger: .08, ease: 'back.out(2)'
    }, .3);

    tl.from('.nav__inner > *', { y: -16, opacity: 0, duration: .5, stagger: .08 }, 0);
    tl.from('.hero__chip', { x: -30, opacity: 0, duration: .55 }, .15);

    tl.to('.js-title-line .hero__title-inner', {
      y: 0, duration: 1.05, stagger: .14, ease: 'expo.out'
    }, .3);

    tl.from('.hero__sub', { y: 20, opacity: 0, duration: .7 }, .9);
    tl.from('.hero__ctas .btn', { y: 30, opacity: 0, duration: .55, stagger: .12, ease: 'back.out(1.6)' }, 1.1);
    tl.from('.hero__stat', { y: 30, opacity: 0, duration: .5, stagger: .12, ease: 'back.out(1.4)' }, 1.25);

    // Photo block reveal
    tl.from('.hero__photo', { y: 40, x: 30, opacity: 0, duration: .9, ease: 'expo.out' }, .5);
    tl.from('.hero__circle-photo', { scale: 0, opacity: 0, rotation: -90, duration: .8, ease: 'back.out(1.5)' }, .8);
    tl.from('.hero__tilt-photo', { scale: 0, opacity: 0, duration: .7, ease: 'back.out(1.6)' }, 1.0);
    tl.from('.hero__badge', { scale: 0, rotation: 180, opacity: 0, duration: .8, ease: 'back.out(1.6)' }, 1.15);
    tl.from('.hero__deco', { scale: 0, opacity: 0, duration: .5, stagger: .12, ease: 'back.out(2)' }, 1.3);
    tl.from('.hero__vlabel', { y: 40, opacity: 0, duration: .55 }, 1.4);

    // Parallax
    if (window.ScrollTrigger) {
      gsap.to('.shape--circle-red', { yPercent: -25, rotation: 30, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.shape--triangle', { yPercent: 15, rotation: 30, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.shape--square-yellow', { rotation: -30, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.shape--half', { yPercent: 30, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__visual', { yPercent: -10, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }
  } else {
    $$('.js-title-line .hero__title-inner').forEach(el => el.style.transform = 'translateY(0)');
  }
})();
