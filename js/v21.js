/* IBC V21 — Terminal */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  if (window.Lenis && !reduced) {
    const lenis = new window.Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  /* === タイプライター効果 === */
  if (!reduced) {
    const targets = $$('.typewrite');
    targets.forEach((el, idx) => {
      const text = el.textContent;
      el.textContent = '';
      el.style.opacity = 1;
      setTimeout(() => {
        let i = 0;
        const tick = () => {
          if (i <= text.length) {
            el.textContent = text.slice(0, i);
            i++;
            setTimeout(tick, 22 + Math.random() * 30);
          }
        };
        tick();
      }, 400 + idx * 350);
    });
  }

  if (window.gsap && !reduced) {
    const gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.from('.nav', { y: -16, opacity: 0, duration: .5 }, 0);
    tl.from('.statusbar', { opacity: 0, y: -10, duration: .5 }, .1);

    tl.from('.panel', { opacity: 0, y: 20, duration: .6, stagger: .15 }, .2);

    // Image corner markers
    tl.from('.img-corner', { scale: 0, opacity: 0, duration: .4, stagger: .08, ease: 'back.out(1.6)' }, .8);
    tl.from('.img-hud-left, .img-hud-right', { x: -10, opacity: 0, duration: .55, stagger: .12 }, 1.0);

    // Photo zoom in
    tl.from('.img-container img', { scale: 1.15, duration: 1.4, ease: 'expo.out' }, .3);

    // Code title reveal
    tl.from('.code-title', { y: 20, opacity: 0, duration: .8 }, 1.0);

    // CTAs
    tl.from('.code-ctas .btn', { y: 14, opacity: 0, duration: .5, stagger: .12, ease: 'back.out(1.6)' }, 1.4);

    // Bottombar
    tl.from('.bottombar > *', { y: 14, opacity: 0, duration: .5, stagger: .08 }, 1.5);

    // Counter
    $$('.stat-panel-num .count').forEach((el) => {
      const target = parseInt(el.dataset.target, 10);
      const obj = { v: 0 };
      tl.to(obj, { v: target, duration: 1.2, ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(obj.v); } }, 1.6);
    });

    // Photo parallax
    if (window.ScrollTrigger) {
      gsap.to('.img-container img', { yPercent: 5, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }
  } else {
    $$('.typewrite').forEach(el => { el.style.opacity = 1 });
  }
})();
