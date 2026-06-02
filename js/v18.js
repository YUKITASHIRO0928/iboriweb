/* IBC V18 — Split Pane */
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

    // Panes slide in from random directions
    const panes = [
      ['.pane--title',     { x: -60 }],
      ['.pane--photo-big', { x: 60 }],
      ['.pane--cta',       { y: 60 }],
      ['.pane--meta',      { scale: .8 }],
      ['.pane--photo-2',   { x: 60 }],
      ['.pane--mini',      { y: 30 }],
    ];
    panes.forEach(([sel, from], i) => {
      tl.from(sel, { ...from, opacity: 0, duration: .85 }, .15 + i * .12);
    });

    // Title elements
    tl.from('.pane__eyebrow', { y: -10, opacity: 0, duration: .55, ease: 'power3.out' }, .5);
    tl.from('.pane__title-inner', { y: 80, opacity: 0, duration: .9, stagger: .14 }, .65);
    tl.from('.pane__title-en', { y: 20, opacity: 0, duration: .7, ease: 'power3.out' }, 1.1);
    tl.from('.pane__title-meta > *', { y: 10, opacity: 0, duration: .5, stagger: .1, ease: 'power3.out' }, 1.25);

    // CTA inside orange pane
    tl.from('.pane--cta__title', { y: 20, opacity: 0, duration: .65, ease: 'power3.out' }, 1.2);
    tl.from('.pane--cta__sub', { y: 14, opacity: 0, duration: .6, ease: 'power3.out' }, 1.35);
    tl.from('.pane--cta .btn', { y: 24, opacity: 0, duration: .55, stagger: .12, ease: 'back.out(1.6)' }, 1.45);

    // Number counter
    const numEl = $('.pane--meta__num span.count');
    if (numEl) {
      const target = parseInt(numEl.dataset.target, 10);
      const obj = { v: 0 };
      tl.to(obj, {
        v: target, duration: 1.4, ease: 'power3.out',
        onUpdate: () => { numEl.textContent = Math.round(obj.v) }
      }, 1.4);
    }

    // Parallax photos on scroll
    if (window.ScrollTrigger) {
      gsap.to('.pane--photo-big img', { yPercent: -8, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.pane--photo-2 img', { yPercent: -10, ease: 'none',
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
