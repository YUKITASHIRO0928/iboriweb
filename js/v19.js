/* IBC V19 — Radial Center */
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

  /* === 放射状スポーク生成（CSS で書ききれないので JS で） === */
  const hero = $('.hero');
  if (hero) {
    const spokeCount = 12;
    const length = '80vmin';
    for (let i = 0; i < spokeCount; i++) {
      const s = document.createElement('div');
      s.className = 'spoke';
      s.style.height = length;
      s.style.transform = `translate(-50%, 0) rotate(${(360 / spokeCount) * i}deg)`;
      hero.appendChild(s);
    }
  }

  if (window.gsap && !reduced) {
    const gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.nav__inner > *', { y: -16, opacity: 0, duration: .5, stagger: .08 }, 0);

    // Rings scale-in
    tl.from('.ring', { scale: 0, opacity: 0, duration: 1.2, stagger: .1, ease: 'expo.out' }, 0);
    tl.from('.spoke', { scaleY: 0, opacity: 0, duration: .9, stagger: .04, ease: 'expo.out' }, .1);

    tl.from('.hero__top-label', { y: -10, opacity: 0, duration: .6 }, .3);
    tl.from('.hero__eyebrow', { y: 10, opacity: 0, duration: .55 }, .5);

    // Title lines
    tl.to('.js-title-line .hero__title-inner', {
      y: 0, duration: 1.05, stagger: .14, ease: 'expo.out'
    }, .65);

    tl.from('.hero__lead', { y: 20, opacity: 0, duration: .7 }, 1.2);

    // Center circle: dramatic scale-in
    tl.from('.hero__circle', { scale: 0, opacity: 0, rotation: -180, duration: 1.2, ease: 'back.out(1.4)' }, .5);

    // Satellites pop in
    tl.from('.satellite', { scale: 0, opacity: 0, duration: .7, stagger: .15, ease: 'back.out(1.8)' }, 1.0);

    // Stat orbits
    tl.from('.stat-orbit', { scale: 0, opacity: 0, duration: .7, stagger: .15, ease: 'back.out(1.6)' }, 1.2);

    // CTAs
    tl.from('.hero__ctas .btn', { y: 24, opacity: 0, duration: .55, stagger: .12, ease: 'back.out(1.6)' }, 1.5);

    // Parallax + slow rotation
    if (window.ScrollTrigger) {
      gsap.to('.ring--1', { rotation: '+=60', ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.ring--3', { rotation: '+=-60', ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__circle', { scale: .85, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.satellite--1', { y: -50, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.satellite--2', { y: 50, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.satellite--3', { y: -30, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.satellite--4', { y: 30, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    /* Mouse-following on satellites (PC) */
    if (matchMedia('(pointer:fine)').matches) {
      const heroEl = $('.hero');
      const sats = $$('.satellite');
      heroEl?.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - .5) * 2;
        const y = (e.clientY / window.innerHeight - .5) * 2;
        sats.forEach((el, i) => {
          const depth = (i % 4 + 1) * 8;
          gsap.to(el, { x: x * depth, y: y * depth, duration: .8, ease: 'power3.out' });
        });
      });

      /* Magnetic CTA */
      $$('.btn').forEach((b) => {
        b.addEventListener('mousemove', (e) => {
          const r = b.getBoundingClientRect();
          gsap.to(b, {
            x: (e.clientX - (r.left + r.width / 2)) * .18,
            y: (e.clientY - (r.top + r.height / 2)) * .18,
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
