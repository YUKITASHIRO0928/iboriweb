/* IBC V13 — Cinematic */
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
      duration: 1.3,
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

    // Letterbox reveal (open from full black)
    tl.from('.letterbox--top', { height: '50%', duration: 1.2, ease: 'expo.inOut' }, 0);
    tl.from('.letterbox--bot', { height: '50%', duration: 1.2, ease: 'expo.inOut' }, 0);

    tl.from('.nav__inner > *', { y: -16, opacity: 0, duration: .7, stagger: .08 }, .8);

    tl.from('.hero__year', { x: -30, opacity: 0, duration: .8 }, 1.0);
    tl.from('.hero__title-en', { x: -20, opacity: 0, duration: .7 }, 1.15);

    // Title slow reveal
    tl.to('.js-title-line .hero__title-inner', {
      y: 0, duration: 1.3, stagger: .25, ease: 'expo.out'
    }, 1.3);

    tl.from('.hero__tagline', { y: 24, opacity: 0, duration: 1.0 }, 1.9);
    tl.from('.hero__ctas .btn', { y: 24, opacity: 0, duration: .7, stagger: .15 }, 2.1);

    // Vertical text (left)
    tl.from('.hero__vertical-text', { opacity: 0, x: -30, duration: 1.1 }, 1.5);

    // Credits (right)
    tl.from('.hero__credits-block', { opacity: 0, y: 16, duration: .7, stagger: .15 }, 1.7);

    // Background image: subtle zoom out + brightness
    if (window.ScrollTrigger) {
      gsap.to('.hero__bg img', {
        yPercent: 8, scale: 1.05, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
      gsap.to('.hero__content', { yPercent: -8, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }
  } else {
    $$('.js-title-line .hero__title-inner').forEach(el => el.style.transform = 'translateY(0)');
  }
})();
