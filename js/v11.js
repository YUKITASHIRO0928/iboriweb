/* IBC V11 — Black Tech */
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
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  /* Text scramble effect for code # */
  const scrambleEl = $('.hero__code .scramble');
  if (scrambleEl && !reduced) {
    const target = scrambleEl.dataset.target || scrambleEl.textContent;
    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ#%@!?';
    let frame = 0;
    const total = 30;
    const tick = () => {
      let out = '';
      for (let i = 0; i < target.length; i++) {
        if (frame > total * (i / target.length)) {
          out += target[i];
        } else {
          out += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      scrambleEl.textContent = out;
      frame++;
      if (frame <= total) requestAnimationFrame(tick);
      else scrambleEl.textContent = target;
    };
    setTimeout(() => requestAnimationFrame(tick), 1400);
  }

  if (window.gsap && !reduced) {
    const gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Rails draw in
    tl.from('.hero__rail--1', { scaleY: 0, transformOrigin: 'top', duration: .9 }, 0);
    tl.from('.hero__rail--2', { scaleY: 0, transformOrigin: 'bottom', duration: .9 }, .1);
    tl.from('.hero__rail--3', { scaleX: 0, transformOrigin: 'left', duration: .9 }, .15);

    tl.from('.nav__inner > *', { y: -16, opacity: 0, duration: .5, stagger: .08 }, 0);
    tl.from('.hero__meta > *', { x: -20, opacity: 0, duration: .55, stagger: .08 }, .1);

    // Title slide up
    tl.to('.js-title-line .hero__en-title-inner', {
      y: 0, duration: 1.05, stagger: .12, ease: 'expo.out'
    }, .3);

    tl.from('.hero__jp-sub', { y: 20, opacity: 0, duration: .7 }, .85);
    tl.from('.hero__sub', { y: 20, opacity: 0, duration: .7 }, 1.0);
    tl.from('.hero__ctas .btn', { y: 24, opacity: 0, duration: .55, stagger: .12 }, 1.1);
    tl.from('.hero__cell', { y: 18, opacity: 0, duration: .5, stagger: .08 }, 1.25);

    // Photo angular reveal
    const photo = $('.hero__photo');
    if (photo) {
      tl.fromTo(photo,
        { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' },
        { clipPath: 'polygon(0 4%, 100% 0, 100% 96%, 0 100%)', duration: 1.2, ease: 'expo.out' },
        .35);
      tl.fromTo(photo.querySelector('img'), { scale: 1.2 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, .35);
    }

    tl.from('.hero__corner', { scale: 0, opacity: 0, duration: .4, stagger: .08, ease: 'back.out(1.6)' }, .9);
    tl.from('.hero__pod', { scale: 0, opacity: 0, duration: .6, ease: 'back.out(1.6)' }, 1.1);
    tl.from('.hero__hud-overlay', { opacity: 0, x: -20, duration: .55, stagger: .12 }, 1.2);
    tl.from('.hero__code', { opacity: 0, y: 16, duration: .55 }, 1.35);
    tl.from('.hero__vlabel', { opacity: 0, y: 20, duration: .5 }, 1.45);

    // Parallax
    if (window.ScrollTrigger) {
      gsap.to('.hero__big--9', { yPercent: -25, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__visual', { yPercent: -10, ease: 'none',
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
    $$('.js-title-line .hero__en-title-inner').forEach(el => el.style.transform = 'translateY(0)');
  }
})();
