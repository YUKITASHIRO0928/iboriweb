/* IBC editorial.js — v2 hero animations */
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* Nav scroll state */
  const nav = $('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Smooth scroll */
  if (window.Lenis && !reducedMotion) {
    const lenis = new window.Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  /* Hero timeline */
  if (window.gsap && !reducedMotion) {
    const gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.nav__inner > *', { y: -16, opacity: 0, duration: .5, stagger: .08 }, 0);
    tl.from('.hero__eyebrow', { opacity: 0, x: -28, duration: .6 }, .1);

    // Title lines reveal (mask up)
    tl.to('.js-title-line .hero__title-inner', {
      y: 0, duration: 1.1, stagger: .15, ease: 'expo.out'
    }, .25);

    // Mark highlight kicks in (handled via CSS class toggle)
    tl.add(() => $('.hero__title')?.classList.add('is-in'), .9);

    // Subtitle + CTA
    tl.from('.hero__sub', { y: 20, opacity: 0, duration: .7 }, .7);
    tl.from('.hero__ctas .btn', {
      y: 24, opacity: 0, duration: .55, stagger: .1, ease: 'back.out(1.6)'
    }, .95);
    tl.from('.hero__stat', { y: 16, opacity: 0, duration: .5, stagger: .08 }, 1.1);

    // Photo reveal (mask from bottom + slight zoom out)
    const mainPhoto = $('.hero__photo');
    if (mainPhoto) {
      tl.fromTo(mainPhoto, { clipPath: 'inset(100% 0 0 0)' }, {
        clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'expo.out'
      }, .3);
      tl.fromTo(mainPhoto.querySelector('img'),
        { scale: 1.25 },
        { scale: 1, duration: 1.6, ease: 'expo.out' },
        .3
      );
    }

    // Sub photos pop
    tl.from('.hero__sub-photo', { scale: 0, opacity: 0, duration: .6, stagger: .12, ease: 'back.out(2)' }, 1.0);

    // Badge spin in
    tl.from('.hero__badge', { scale: 0, rotation: -180, opacity: 0, duration: .7, ease: 'back.out(1.8)' }, 1.2);

    // Stars
    tl.from('.hero__star', { scale: 0, opacity: 0, duration: .4, stagger: .12, ease: 'back.out(2)' }, 1.4);

    // Scroll parallax
    if (window.ScrollTrigger) {
      gsap.to('.hero__shout', {
        yPercent: -20, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
      gsap.to('.hero__visual', {
        yPercent: -8, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
      gsap.to('.hero__circle--yellow', {
        yPercent: 15, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }

    /* Magnetic CTAs (PC only, fine pointer) */
    if (matchMedia('(pointer:fine)').matches) {
      $$('.btn').forEach((btn) => {
        const strength = 12;
        btn.addEventListener('mousemove', (e) => {
          const r = btn.getBoundingClientRect();
          const x = (e.clientX - (r.left + r.width / 2)) / r.width * strength;
          const y = (e.clientY - (r.top + r.height / 2)) / r.height * strength;
          gsap.to(btn, { x, y, duration: .25, ease: 'power3.out' });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { x: 0, y: 0, duration: .4, ease: 'elastic.out(1,.4)' });
        });
      });
    }
  } else {
    $$('.js-title-line .hero__title-inner').forEach(el => el.style.transform = 'translateY(0)');
    $('.hero__title')?.classList.add('is-in');
  }
})();
