/* IBC V10 — Scrapbook / Sticker Diary */
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

    // Tapes drop in at corners
    tl.from('.tape', { y: -40, opacity: 0, duration: .55, stagger: .12, ease: 'expo.out' }, 0);

    tl.from('.hero__date', { x: -30, opacity: 0, duration: .6 }, .15);

    tl.to('.js-title-line .hero__title-inner', {
      y: 0, duration: 1.0, stagger: .14, ease: 'expo.out'
    }, .3);

    tl.from('.hero__sub', { y: 20, opacity: 0, duration: .7 }, 1.0);
    tl.from('.hero__ctas .btn', { y: 30, opacity: 0, duration: .55, stagger: .12, ease: 'back.out(1.6)' }, 1.15);
    tl.from('.hero__stat', { y: 40, opacity: 0, duration: .6, stagger: .12, ease: 'back.out(1.6)' }, 1.3);

    // Photos paste in stagger (like sticking them onto the page)
    const snaps = $$('.snap');
    snaps.forEach((el, i) => {
      // Read current rotation from inline style to preserve
      tl.fromTo(el,
        { y: 80, opacity: 0, scale: 1.1, rotation: 0 },
        { y: 0, opacity: 1, scale: 1, duration: .7, ease: 'back.out(1.4)', clearProps: 'rotation' },
        .5 + i * .12);
    });

    // Stickies
    tl.from('.sticky', { scale: 0, opacity: 0, duration: .55, stagger: .15, ease: 'back.out(2)' }, 1.2);

    // Stickers
    tl.from('.sticker', { scale: 0, opacity: 0, duration: .5, stagger: .12, ease: 'back.out(2)' }, 1.4);

    // Scribbles
    tl.from('.scribble', { x: -20, opacity: 0, duration: .6 }, 1.5);

    // Badge
    tl.from('.hero__badge', { scale: 0, opacity: 0, rotation: -180, duration: .8, ease: 'back.out(1.6)' }, 1.25);

    // Parallax
    if (window.ScrollTrigger) {
      gsap.to('.sticky--note1', { y: -50, rotation: 12, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.sticky--note2', { y: -30, rotation: -14, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__visual', { yPercent: -6, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.sticker', { y: -40, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    /* Tilt photos slightly on hover (PC) */
    if (matchMedia('(pointer:fine)').matches) {
      snaps.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - (r.left + r.width / 2)) / r.width;
          const y = (e.clientY - (r.top + r.height / 2)) / r.height;
          gsap.to(el, { rotateY: x * 8, rotateX: -y * 8, transformPerspective: 600, duration: .35 });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(el, { rotateY: 0, rotateX: 0, duration: .5, ease: 'elastic.out(1,.4)' });
        });
      });
    }
  } else {
    $$('.js-title-line .hero__title-inner').forEach(el => el.style.transform = 'translateY(0)');
  }
})();
