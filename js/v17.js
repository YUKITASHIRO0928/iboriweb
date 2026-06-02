/* IBC V17 — Type Mask */
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

    // Bands slide in
    tl.from('.hero__band--orange', { x: -200, duration: 1.0, ease: 'expo.out' }, 0);
    tl.from('.hero__band--blue',   { x: 200, duration: 1.0, ease: 'expo.out' }, .1);

    tl.from('.hero__topbar > *', { y: -10, opacity: 0, duration: .55, stagger: .12 }, .2);

    tl.from('.hero__eyebrow', { y: -10, opacity: 0, duration: .55 }, .4);
    tl.from('.hero__sub-jp', { y: -16, opacity: 0, duration: .6 }, .5);

    // MEGA TEXT: dramatic reveal
    tl.from('.hero__mega', {
      scale: 1.3, opacity: 0, y: 60, duration: 1.4, ease: 'expo.out'
    }, .55);

    // Background pan inside the text
    gsap.to('.hero__mega', {
      backgroundPosition: '100% 50%',
      duration: 20, repeat: -1, yoyo: true, ease: 'sine.inOut'
    });

    tl.from('.hero__mega-text', { x: -30, opacity: 0, duration: .7 }, 1.4);
    tl.from('.hero__mega-punct', { scale: 0, opacity: 0, duration: .5, stagger: .08, ease: 'back.out(2)' }, 1.5);
    tl.from('.hero__tagline', { y: 20, opacity: 0, duration: .8 }, 1.6);

    // Grid below
    tl.from('.hero__cta-col .btn', { y: 30, opacity: 0, duration: .55, stagger: .12, ease: 'back.out(1.6)' }, 1.8);
    tl.from('.hero__meta-col', { y: 30, opacity: 0, duration: .7 }, 1.9);
    tl.from('.hero__meta-item', { y: 12, opacity: 0, duration: .4, stagger: .1 }, 2.1);
    tl.from('.hero__photo-col', { y: 30, opacity: 0, duration: .7 }, 2.0);
    tl.from('.hero__bottom-line > *', { opacity: 0, y: 10, duration: .55, stagger: .12 }, 2.3);

    // Parallax
    if (window.ScrollTrigger) {
      gsap.to('.hero__mega', { yPercent: -10, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__band--orange', { y: 50, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__band--blue', { y: -50, ease: 'none',
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
  }
})();
