/* IBC main.js — Hero animation + nav scroll state */
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ===== Nav scroll state ===== */
  const nav = $('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ===== Smooth scroll via Lenis ===== */
  if (window.Lenis && !reducedMotion) {
    const lenis = new window.Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  /* ===== Hero animation timeline ===== */
  if (window.gsap && !reducedMotion) {
    const gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    // 初期: 写真は配置のtransformを保持しつつフェードイン用に opacity:0 だけ持ってる
    // CSS で .js-photo-init { opacity:0 } されている

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Nav fade
    tl.from('.nav__inner > *', {
      y: -20, opacity: 0, duration: .5, stagger: .08
    }, 0);

    // Eyebrow
    tl.from('.hero__eyebrow', { opacity: 0, x: -30, duration: .6 }, .15);

    // Title lines (元の rotate を保持しつつ Y を 110% → 0% へ)
    tl.to('.js-title-line .hero__title-inner', {
      y: 0, duration: 1.0, stagger: .12, ease: 'expo.out'
    }, .3);

    // Sub copy
    tl.from('.hero__sub', { y: 24, opacity: 0, duration: .7 }, .75);

    // CTAs (バウンス)
    tl.from('.hero__ctas .btn', {
      y: 30, opacity: 0, scale: .9, duration: .55, stagger: .12, ease: 'back.out(2)'
    }, 1.0);

    // Meta cards
    tl.from('.hero__meta-item', {
      y: 24, opacity: 0, duration: .5, stagger: .08, ease: 'back.out(1.6)'
    }, 1.2);

    // Photos (コラージュをパッパッと出す)
    // それぞれの photo に必要な最終 transform を保持したまま、追加で from 状態を当てる
    const photos = $$('.hero__photo');
    photos.forEach((el, i) => {
      // CSS で transform: rotate(...) が設定済みなので fromTo で乗せる
      gsap.fromTo(el,
        { opacity: 0, scale: .6, y: 60 },
        {
          opacity: 1, scale: 1, y: 0,
          duration: .7, ease: 'back.out(1.8)',
          delay: .5 + i * .12
        }
      );
    });

    // Bubbles (ポンッと現れる)
    const bubbles = $$('.hero__bubble');
    bubbles.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, scale: 0 },
        {
          opacity: 1, scale: 1,
          duration: .55, ease: 'back.out(2.4)',
          delay: 1.3 + i * .15
        }
      );
    });

    // 背景パララックス
    if (window.ScrollTrigger) {
      gsap.to('.hero__bg-num--9', {
        yPercent: -30, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
      gsap.to('.hero__bg-num--4', {
        yPercent: 25, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
      gsap.to('.hero__collage', {
        yPercent: -8, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }
  } else {
    // Reduced motion / no GSAP fallback
    $$('.js-title-line .hero__title-inner').forEach(el => el.style.transform = 'translateY(0)');
    $$('.js-photo-init').forEach(el => el.style.opacity = '1');
    $$('.js-bubble-init').forEach(el => { el.style.opacity = '1'; el.style.transform = ''; });
  }
})();
