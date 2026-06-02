/* IBC V12 — Swiss Grid */
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

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Grid lines draw in
    tl.from('.hero__grid span', { scaleY: 0, transformOrigin: 'top', duration: 1.0, stagger: .04 }, 0);

    tl.from('.nav__inner > *', { y: -16, opacity: 0, duration: .5, stagger: .08 }, 0);

    // Top meta line: width animate
    tl.from('.hero__top-meta > *', { x: 30, opacity: 0, duration: .65, stagger: .12 }, .2);
    tl.from('.hero__top-meta', { scaleX: 0, transformOrigin: 'left', duration: 0 }, 0); // no-op safety

    tl.from('.hero__cat', { x: -20, opacity: 0, duration: .55 }, .4);

    // Title lines
    tl.to('.js-title-line .hero__title-inner', {
      y: 0, duration: 1.1, stagger: .15, ease: 'expo.out'
    }, .55);

    tl.from('.hero__sub-en', { y: 20, opacity: 0, duration: .65 }, 1.15);
    tl.from('.hero__lead', { y: 20, opacity: 0, duration: .7 }, 1.25);
    tl.from('.hero__ctas .btn', { y: 24, opacity: 0, duration: .55, stagger: .12 }, 1.35);
    tl.from('.hero__num-cell', { y: 30, opacity: 0, duration: .6, stagger: .12 }, 1.5);

    // Chapter number
    tl.from('.hero__chapter', { opacity: 0, scale: .9, duration: 1.4, ease: 'expo.out' }, .2);

    // Photo: mask reveal from bottom
    const photo = $('.hero__photo');
    if (photo) {
      tl.fromTo(photo, { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'expo.out' }, .35);
      tl.fromTo(photo.querySelector('img'), { scale: 1.25 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, .35);
    }

    tl.from('.hero__photo-cap > *', { y: 14, opacity: 0, duration: .55, stagger: .1 }, 1.1);
    tl.from('.hero__photo-sub', { y: 30, opacity: 0, duration: .8, ease: 'expo.out' }, 1.2);
    tl.from('.hero__corner-mark', { scale: 0, opacity: 0, duration: .7, ease: 'back.out(1.6)' }, 1.3);

    // Parallax
    if (window.ScrollTrigger) {
      gsap.to('.hero__chapter', { yPercent: -25, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__visual', { yPercent: -6, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    /* Magnetic CTA */
    if (matchMedia('(pointer:fine)').matches) {
      $$('.btn').forEach((b) => {
        b.addEventListener('mousemove', (e) => {
          const r = b.getBoundingClientRect();
          gsap.to(b, {
            x: (e.clientX - (r.left + r.width / 2)) * .2,
            y: (e.clientY - (r.top + r.height / 2)) * .2,
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
