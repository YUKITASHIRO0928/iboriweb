/* IBC V3 — Dynamic Sports */
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
      duration: 1.05,
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

    tl.from('.nav__inner > *', { y: -16, opacity: 0, duration: .5, stagger: .08 }, 0);
    tl.from('.hero__tag', { x: -40, opacity: 0, duration: .55 }, .1);

    tl.to('.js-title-line .hero__title-inner', {
      y: 0, duration: 1.0, stagger: .14, ease: 'expo.out'
    }, .25);

    tl.from('.hero__sub', { y: 20, opacity: 0, duration: .7 }, .85);
    tl.from('.hero__ctas .btn', { y: 24, opacity: 0, duration: .55, stagger: .12, ease: 'back.out(1.6)' }, 1.05);
    tl.from('.hero__cell', { y: 20, opacity: 0, duration: .5, stagger: .08 }, 1.25);

    // Photo angular reveal
    const photo = $('.hero__photo');
    if (photo) {
      tl.fromTo(photo,
        { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' },
        { clipPath: 'polygon(0 4%, 100% 0, 96% 100%, 4% 96%)', duration: 1.2, ease: 'expo.out' },
        .3);
      tl.fromTo(photo.querySelector('img'),
        { scale: 1.25 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, .3);
    }

    tl.from('.hero__sub-photo', { scale: 0, opacity: 0, duration: .6, stagger: .12, ease: 'back.out(2)' }, 1.0);
    tl.from('.hero__vlabel', { opacity: 0, y: 20, duration: .5 }, 1.3);
    tl.from('.hero__code', { x: -30, opacity: 0, duration: .5 }, 1.4);
    tl.from('.hero__overlay-num', { y: 60, opacity: 0, duration: .8, ease: 'expo.out' }, 1.0);

    // Parallax
    if (window.ScrollTrigger) {
      gsap.to('.hero__big--9', { yPercent: -25, rotation: 14, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__big--4', { yPercent: 18, rotation: -10, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__visual', { yPercent: -10, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__overlay-num', { yPercent: -40, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    /* Magnetic CTA on PC */
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
