/* IBC V14 — Fresh Court */
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
    tl.from('.hero__chip', { y: -10, scale: .9, opacity: 0, duration: .55, ease: 'back.out(1.6)' }, .15);

    tl.to('.js-title-line .hero__title-inner', {
      y: 0, duration: 1.05, stagger: .14, ease: 'expo.out'
    }, .3);

    tl.from('.hero__sub', { y: 20, opacity: 0, duration: .7 }, .9);
    tl.from('.hero__ctas .btn', { y: 28, opacity: 0, duration: .6, stagger: .12, ease: 'back.out(1.6)' }, 1.05);
    tl.from('.hero__cell', { y: 30, opacity: 0, duration: .55, stagger: .12, ease: 'back.out(1.5)' }, 1.2);

    // Photo bg circle rotate in
    tl.from('.hero__photo-bg', { scale: 0, opacity: 0, duration: 1.0, ease: 'expo.out' }, .35);
    tl.from('.hero__photo', { y: 80, opacity: 0, duration: 1.0, ease: 'expo.out' }, .55);
    tl.from('.hero__chip-photo', { scale: 0, opacity: 0, duration: .7, stagger: .15, ease: 'back.out(1.8)' }, .9);
    tl.from('.hero__badge', { scale: 0, opacity: 0, rotation: -180, duration: .8, ease: 'back.out(1.6)' }, 1.15);
    tl.from('.spark', { scale: 0, opacity: 0, duration: .5, stagger: .12, ease: 'back.out(2)' }, 1.25);

    // Animate the wave SVG path drawing
    const wavePath = $('.hero__wave path');
    if (wavePath) {
      const len = wavePath.getTotalLength();
      gsap.set(wavePath, { strokeDasharray: len, strokeDashoffset: len });
      tl.to(wavePath, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.out' }, .2);
    }

    // Parallax
    if (window.ScrollTrigger) {
      gsap.to('.hero__big--9', { yPercent: -28, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__visual', { yPercent: -8, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.shuttle-deco', { y: -120, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    /* Magnetic CTA */
    if (matchMedia('(pointer:fine)').matches) {
      $$('.btn').forEach((b) => {
        b.addEventListener('mousemove', (e) => {
          const r = b.getBoundingClientRect();
          gsap.to(b, {
            x: (e.clientX - (r.left + r.width / 2)) * .15,
            y: (e.clientY - (r.top + r.height / 2)) * .15,
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
