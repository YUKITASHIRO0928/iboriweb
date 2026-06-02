/* IBC V16 — Confetti Party */
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

  /* === Confetti generation === */
  const hero = $('.hero');
  if (hero && !reduced) {
    const colors = ['#FF3D6F', '#FF8C42', '#FFD23F', '#1FB89E', '#3D85FF', '#A855F7', '#FF6BB5', '#06D6A0'];
    const shapes = ['', 'confetti--ribbon', 'confetti--circle', 'confetti--triangle'];
    const total = 60;
    for (let i = 0; i < total; i++) {
      const c = document.createElement('span');
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      c.className = 'confetti ' + shape;
      const color = colors[Math.floor(Math.random() * colors.length)];
      if (shape === 'confetti--triangle') c.style.color = color;
      else c.style.background = color;
      c.style.left = (Math.random() * 100) + '%';
      c.style.animationDuration = (4 + Math.random() * 6) + 's';
      c.style.animationDelay = (-Math.random() * 6) + 's';
      c.style.setProperty('--dx', (Math.random() * 200 - 100) + 'px');
      c.style.setProperty('--r', (Math.random() * 1440 - 720) + 'deg');
      c.style.opacity = .85;
      hero.appendChild(c);
    }
    // 5 stars among confetti
    for (let i = 0; i < 6; i++) {
      const s = document.createElement('span');
      s.className = 'confetti confetti--star';
      s.textContent = ['★','✦','✺','★'][i % 4];
      s.style.color = colors[Math.floor(Math.random() * colors.length)];
      s.style.left = (Math.random() * 100) + '%';
      s.style.animationDuration = (6 + Math.random() * 5) + 's';
      s.style.animationDelay = (-Math.random() * 6) + 's';
      s.style.setProperty('--dx', (Math.random() * 200 - 100) + 'px');
      s.style.setProperty('--r', (Math.random() * 1440 - 720) + 'deg');
      hero.appendChild(s);
    }
  }

  if (window.gsap && !reduced) {
    const gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.nav__inner > *', { y: -16, opacity: 0, duration: .5, stagger: .08 }, 0);
    tl.from('.streamer', { scaleY: 0, transformOrigin: 'top', duration: 1.0, stagger: .08, ease: 'expo.out' }, 0);

    tl.from('.hero__chip', { y: -12, scale: .9, opacity: 0, duration: .55, ease: 'back.out(1.6)' }, .2);
    tl.from('.hero__title-en', { x: -20, opacity: 0, duration: .65 }, .35);

    tl.to('.js-title-line .hero__title-inner', {
      y: 0, duration: 1.05, stagger: .14, ease: 'expo.out'
    }, .5);

    tl.from('.hero__sub', { y: 20, opacity: 0, duration: .7 }, 1.1);
    tl.from('.hero__ctas .btn', { y: 30, opacity: 0, duration: .55, stagger: .12, ease: 'back.out(1.6)' }, 1.25);
    tl.from('.hero__cell', { y: 40, opacity: 0, scale: .8, duration: .6, stagger: .12, ease: 'back.out(1.8)' }, 1.4);

    // Photos pop in
    tl.from('.hero__photo', { y: 40, opacity: 0, scale: .85, duration: .9, ease: 'back.out(1.4)' }, .5);
    tl.from('.hero__sub-photo', { scale: 0, opacity: 0, rotation: 0, duration: .7, stagger: .15, ease: 'back.out(1.8)' }, .8);
    tl.from('.hero__badge', { scale: 0, opacity: 0, rotation: -180, duration: .9, ease: 'back.out(1.6)' }, 1.1);
    tl.from('.hero__arrow', { x: -20, opacity: 0, duration: .6 }, 1.4);

    // Parallax
    if (window.ScrollTrigger) {
      gsap.to('.hero__big--9', { yPercent: -25, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__visual', { yPercent: -8, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }
  } else {
    $$('.js-title-line .hero__title-inner').forEach(el => el.style.transform = 'translateY(0)');
  }
})();
