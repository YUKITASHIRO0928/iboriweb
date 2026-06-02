/* IBC V23 — Kinetic Type */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

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

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    tl.from('.nav__inner > *', { y: -16, opacity: 0, duration: .5, stagger: .08, ease: 'power3.out' }, 0);

    // Rows slide in
    tl.from('.row-mega', { y: -60, opacity: 0, duration: .9 }, .1);
    tl.from('.row-photos', { y: 60, opacity: 0, duration: .9 }, .25);
    tl.from('.row-mono', { y: -20, opacity: 0, duration: .7, ease: 'power3.out' }, .4);

    // Center text
    tl.from('.center__eyebrow', { x: -20, opacity: 0, duration: .5, ease: 'power3.out' }, .55);
    tl.from('.center__title', { y: 30, opacity: 0, duration: .85, ease: 'expo.out' }, .65);
    tl.from('.center__lead', { y: 20, opacity: 0, duration: .65, ease: 'power3.out' }, .9);
    tl.from('.center__stat', { y: 20, opacity: 0, duration: .55, stagger: .12, ease: 'power3.out' }, 1.0);
    tl.from('.center__ctas .btn', { y: 20, opacity: 0, duration: .55, stagger: .12, ease: 'back.out(1.6)' }, 1.15);

    // Center photo dramatic
    tl.from('.center__img', { y: 60, opacity: 0, duration: 1.0, ease: 'expo.out' }, .5);
    tl.fromTo('.center__img img', { scale: 1.2 }, { scale: 1, duration: 1.5, ease: 'expo.out' }, .5);

    // Counter
    $$('.center__stat-num .count').forEach((el) => {
      const target = parseInt(el.dataset.target, 10);
      const obj = { v: 0 };
      tl.to(obj, { v: target, duration: 1.2, ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(obj.v); } }, 1.05);
    });

    // Scroll-based speed control: faster on scroll
    if (window.ScrollTrigger) {
      ScrollTrigger.create({
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          const speed = 1 + self.getVelocity() / 2000;
          $$('.scroller__inner').forEach((el) => {
            el.style.animationDuration = `${Math.max(8, 30 / Math.abs(speed))}s`;
          });
        }
      });

      gsap.to('.center__img img', { yPercent: -8, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }
  }
})();
