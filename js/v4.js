/* IBC V4 — Natural Modern */
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

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.nav__inner > *', { y: -16, opacity: 0, duration: .6, stagger: .08 }, 0);
    tl.from('.hero__issue > *', { x: -28, opacity: 0, duration: .6, stagger: .07 }, .1);

    // Title lines (subtle, refined)
    tl.to('.js-title-line .hero__title-inner', {
      y: 0, duration: 1.2, stagger: .15, ease: 'expo.out'
    }, .25);

    tl.from('.hero__sub', { y: 24, opacity: 0, duration: .9 }, .85);
    tl.from('.hero__ctas > *', { y: 18, opacity: 0, duration: .6, stagger: .12 }, 1.05);
    tl.from('.hero__stat', { y: 20, opacity: 0, duration: .55, stagger: .1 }, 1.2);

    // Photo: clip-path reveal (subtle)
    const photo = $('.hero__photo');
    if (photo) {
      tl.fromTo(photo, { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.out' }, .25);
      tl.fromTo(photo.querySelector('img'), { scale: 1.15 },
        { scale: 1, duration: 1.6, ease: 'expo.out' }, .25);
    }

    tl.from('.hero__sub-photo', { scale: .85, opacity: 0, y: 30, duration: .9, ease: 'expo.out' }, .9);
    tl.from('.hero__sub-photo-2', { scale: 0, opacity: 0, duration: .7, ease: 'back.out(1.6)' }, 1.0);
    tl.from('.hero__caption', { x: -30, opacity: 0, duration: .7 }, 1.2);
    tl.from('.hero__badge', { scale: 0, rotation: -180, opacity: 0, duration: .8, ease: 'back.out(1.6)' }, 1.3);
    tl.from('.hero__leaf', { scale: 0, opacity: 0, duration: .5, stagger: .15, ease: 'back.out(2)' }, 1.4);

    // Parallax
    if (window.ScrollTrigger) {
      gsap.to('.hero__big-type', { yPercent: -15, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__visual', { yPercent: -6, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__deco-circle', { rotation: 30, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }
  } else {
    $$('.js-title-line .hero__title-inner').forEach(el => el.style.transform = 'translateY(0)');
  }
})();
