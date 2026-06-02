/* IBC V25 — Pastel Joy (Full Site)
   ふんだんアニメ × ゴージャスインタラクション */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ============ Nav scroll state ============ */
  const nav = $('.nav');
  if (nav) {
    const fn = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
    fn(); window.addEventListener('scroll', fn, { passive: true });
  }

  /* ============ Lenis (smooth scroll) ============ */
  let lenis = null;
  if (window.Lenis && !reduced) {
    lenis = new window.Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);

    // anchor links use Lenis scroll
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id && id.length > 1) {
          const el = $(id);
          if (el) {
            e.preventDefault();
            lenis.scrollTo(el, { offset: -60, duration: 1.4 });
          }
        }
      });
    });
  }

  /* ============ Float CTA show/hide (contact / footer 判定) ============ */
  const floatCta = $('#float-cta');
  const contactSection = $('#contact');
  const footerEl = $('.foot');
  if (floatCta) {
    const update = () => {
      const scrolled = window.scrollY > 400;
      let inLast = false;
      if (contactSection) {
        const r = contactSection.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) inLast = true;
      }
      if (footerEl) {
        const r = footerEl.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) inLast = true;
      }
      floatCta.classList.toggle('is-visible', scrolled && !inLast);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  /* ============ Gallery アコーディオン ============ */
  const galleryGrid = document.getElementById('gallery-grid');
  const galleryMoreBtn = document.getElementById('gallery-more-btn');
  if (galleryGrid && galleryMoreBtn) {
    const label = galleryMoreBtn.querySelector('.gallery-more-btn__label');
    const toggle = (ev) => {
      if (ev) ev.preventDefault();
      const wasOpen = !galleryGrid.classList.contains('is-collapsed');
      if (wasOpen) {
        galleryGrid.classList.add('is-collapsed');
        galleryMoreBtn.classList.remove('is-open');
        galleryMoreBtn.setAttribute('aria-expanded', 'false');
        if (label) label.textContent = 'もっと見る';
        const sec = document.getElementById('gallery');
        if (sec) {
          const y = sec.getBoundingClientRect().top + window.scrollY - 80;
          try {
            if (lenis && lenis.scrollTo) lenis.scrollTo(y, { duration: 1.0 });
            else window.scrollTo({ top: y, behavior: 'smooth' });
          } catch (e) { window.scrollTo(0, y); }
        }
      } else {
        galleryGrid.classList.remove('is-collapsed');
        galleryMoreBtn.classList.add('is-open');
        galleryMoreBtn.setAttribute('aria-expanded', 'true');
        if (label) label.textContent = '閉じる';
        const hidden = Array.from(galleryGrid.querySelectorAll('.gallery-item')).slice(8);
        hidden.forEach((el, i) => {
          el.classList.remove('is-revealed');
          void el.offsetWidth;
          el.style.animationDelay = (i * 0.04) + 's';
          el.classList.add('is-revealed');
        });
      }
    };
    galleryMoreBtn.addEventListener('click', toggle);
    // iOS Safari など click 発火不安定対策 (子要素を pointer-events:none済 + touchend 二重バインド)
    galleryMoreBtn.addEventListener('touchend', (ev) => {
      // ダブル発火防止: 直前のclickに任せる場合は何もしない
      // ただし click が来ない端末向け: 100ms内にclickがなければ自分でtoggle
      let clicked = false;
      const guard = () => { clicked = true };
      galleryMoreBtn.addEventListener('click', guard, { once: true });
      setTimeout(() => {
        galleryMoreBtn.removeEventListener('click', guard);
        if (!clicked) toggle(ev);
      }, 350);
    }, { passive: true });
  }

  /* ============ スクロール進捗バー ============ */
  const progressBar = $('#scroll-progress');
  if (progressBar) {
    const updateProgress = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
      progressBar.style.width = Math.max(0, Math.min(100, pct)) + '%';
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
  }

  /* ============ トップに戻るボタン ============ */
  const toTop = $('#to-top');
  if (toTop) {
    const updateToTop = () => {
      toTop.classList.toggle('is-visible', window.scrollY > 600);
    };
    updateToTop();
    window.addEventListener('scroll', updateToTop, { passive: true });
    toTop.addEventListener('click', () => {
      if (lenis) lenis.scrollTo(0, { duration: 1.4 });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============ ナビ現在地ハイライト ============ */
  const navLinks = $$('.nav__links a[href^="#"]');
  if (navLinks.length) {
    const idToLink = new Map();
    navLinks.forEach(a => {
      const id = a.getAttribute('href').slice(1);
      idToLink.set(id, a);
    });
    const sections = $$('main section[id]').filter(s => idToLink.has(s.id));
    const updateActive = () => {
      let currentId = null;
      const mid = window.innerHeight * 0.35;
      sections.forEach(s => {
        const r = s.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) currentId = s.id;
      });
      navLinks.forEach(a => a.classList.remove('is-current'));
      if (currentId && idToLink.has(currentId)) {
        idToLink.get(currentId).classList.add('is-current');
      }
    };
    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
  }

  /* ============ Gallery modal ============ */
  const modal = $('#gallery-modal');
  if (modal) {
    const modalImg = modal.querySelector('img');
    const openModal = (src, alt) => {
      modalImg.src = src;
      modalImg.alt = alt || '';
      modal.classList.add('is-open');
      lenis?.stop();
    };
    const closeModal = () => {
      modal.classList.remove('is-open');
      lenis?.start();
    };
    $$('.gallery-item').forEach((b) => {
      b.addEventListener('click', () => {
        openModal(b.dataset.src, b.dataset.alt);
      });
    });
    modal.querySelector('.gallery-modal-close')?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  /* ============ FAQ (open accordion exclusive optional) ============ */
  // <details> default behavior is enough, but custom toggle anim is via CSS via is-open class
  $$('.faq-item').forEach((item) => {
    item.addEventListener('toggle', () => {
      item.classList.toggle('is-open', item.open);
    });
  });

  /* ============ GSAP everything ============ */
  if (window.gsap && !reduced) {
    const gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    /* === HERO TL === */
    const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    heroTl.from('.nav__inner > *', { y: -16, opacity: 0, duration: .5, stagger: .08, ease: 'power3.out' }, 0);

    const tiles = $$('.hero .tile');
    tiles.forEach((tile, i) => {
      heroTl.fromTo(tile,
        { scale: .85, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: .8, ease: 'back.out(1.4)' },
        .1 + i * .05);
    });

    heroTl.from('.center-card', { scale: .9, opacity: 0, y: 30, duration: 1.0, ease: 'back.out(1.3)' }, .8);
    heroTl.from('.center-card__img-label, .center-card__img-tag',
      { opacity: 0, x: -10, duration: .55, stagger: .12, ease: 'power3.out' }, 1.3);
    heroTl.from('.center-card__chip', { x: -16, opacity: 0, duration: .55, ease: 'power3.out' }, 1.35);
    heroTl.from('.js-title-line .hero__title-inner', { y: 80, duration: 1.0, stagger: .15 }, 1.45);
    heroTl.from('.hero__lead', { y: 14, opacity: 0, duration: .65, ease: 'power3.out' }, 1.75);
    heroTl.from('.hero__stat', { y: 30, scale: .8, opacity: 0, duration: .65, stagger: .12, ease: 'back.out(1.8)' }, 1.85);
    heroTl.from('.hero__ctas .btn', { y: 24, opacity: 0, duration: .55, stagger: .12, ease: 'back.out(1.6)' }, 2.1);

    // Hero counter
    $$('.hero__stat-num .count').forEach((el) => {
      const target = parseInt(el.dataset.target, 10);
      const obj = { v: 0 };
      heroTl.to(obj, { v: target, duration: 1.0, ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(obj.v); } }, 1.95);
    });

    /* === Hero tile parallax === */
    if (window.ScrollTrigger) {
      tiles.forEach((t, i) => {
        const depth = (i % 3) * 14 + 8;
        gsap.to(t.querySelector('img'), {
          yPercent: -depth, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
        });
      });
      gsap.to('.center-card', { yPercent: -6, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    /* ============ Reusable reveal on scroll ============ */
    if (window.ScrollTrigger) {
      const animMap = [
        ['.js-fade-in',    { opacity: 0, y: 40 },              { opacity: 1, y: 0 }],
        ['.js-zoom-in',    { opacity: 0, scale: .92 },         { opacity: 1, scale: 1 }],
        ['.js-slide-left', { opacity: 0, x: -50 },             { opacity: 1, x: 0 }],
        ['.js-slide-right',{ opacity: 0, x: 50 },              { opacity: 1, x: 0 }],
        ['.js-rotate-in',  { opacity: 0, rotation: -12, scale: .92 }, { opacity: 1, rotation: 0, scale: 1 }],
      ];
      animMap.forEach(([sel, from, to]) => {
        $$(sel).forEach((el) => {
          gsap.fromTo(el, from, {
            ...to,
            duration: .9,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none reset',
            }
          });
        });
      });

      // stagger groups
      $$('.stats-grid, .features-grid, .philosophy-list, .voices-grid, .gallery-grid, .steps-grid, .events-scroll').forEach((grp) => {
        const items = grp.children;
        gsap.fromTo(items,
          { opacity: 0, y: 30, scale: .96 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: .7, ease: 'back.out(1.4)', stagger: .1,
            scrollTrigger: { trigger: grp, start: 'top 85%', toggleActions: 'play none none reset' }
          });
      });
    }

    /* ============ Counter for stats section ============ */
    if (window.ScrollTrigger) {
      $$('.s-stats .count, .price-highlight-value .count').forEach((el) => {
        const target = parseInt(el.dataset.target, 10);
        if (!isFinite(target)) return;
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            const obj = { v: 0 };
            gsap.to(obj, { v: target, duration: 1.2, ease: 'power2.out',
              onUpdate: () => { el.textContent = Math.round(obj.v); } });
          }
        });
      });
    }

    /* ============ Slogan giant text parallax ============ */
    if (window.ScrollTrigger) {
      gsap.to('.slogan-bg', {
        yPercent: -20, ease: 'none',
        scrollTrigger: { trigger: '.slogan', start: 'top bottom', end: 'bottom top', scrub: true }
      });
      gsap.to('.section-blob, .s-stats::before', {
        yPercent: -15, ease: 'none',
        scrollTrigger: { trigger: '.s-stats', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }

    /* ============ Decoration float (mouse parallax in hero) ============ */
    if (matchMedia('(pointer:fine)').matches) {
      const hero = $('.hero');
      const decos = $$('.sparkle, .deco-icon');
      hero?.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - .5) * 2;
        const y = (e.clientY / window.innerHeight - .5) * 2;
        decos.slice(0, 8).forEach((el, i) => {
          const depth = (i % 3 + 1) * 6;
          gsap.to(el, { x: x * depth, y: y * depth, duration: .9, ease: 'power3.out' });
        });
      });

      /* Magnetic CTAs */
      $$('.btn, .contact-btn, .nav__cta').forEach((b) => {
        b.addEventListener('mousemove', (e) => {
          const r = b.getBoundingClientRect();
          gsap.to(b, {
            x: (e.clientX - (r.left + r.width / 2)) * .13,
            y: (e.clientY - (r.top + r.height / 2)) * .13,
            duration: .25
          });
        });
        b.addEventListener('mouseleave', () => gsap.to(b, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1,.4)' }));
      });
    }

    /* ============ Slogan main char-by-char drop ============ */
    const sloganMain = $('.slogan-main');
    if (sloganMain && window.ScrollTrigger) {
      // wrap each character of children that are not styled em (preserve em block)
      // simpler: animate as a single unit with stagger via inner spans
      gsap.fromTo(sloganMain,
        { opacity: 0, y: 30, scale: .92 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: '.slogan', start: 'top 80%', toggleActions: 'play none none reset' }
        });
    }

    /* ============ Coach photo gentle rotation on scroll ============ */
    if (window.ScrollTrigger) {
      gsap.to('.coach-photo', {
        rotation: 8, ease: 'none',
        scrollTrigger: { trigger: '.coach-block', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }

    /* ============ Section blob parallax everywhere ============ */
    if (window.ScrollTrigger) {
      ['.s-stats', '.s-features', '.s-philosophy', '.s-gallery', '.s-price'].forEach((sec) => {
        gsap.fromTo(sec,
          {},
          {
            scrollTrigger: {
              trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true,
              onUpdate: (self) => {
                const el = $(sec);
                if (el) el.style.setProperty('--bg-shift', (self.progress * 30) + 'px');
              }
            }
          });
      });
    }
  } else {
    /* Reduced motion fallback: show everything */
    $$('.js-fade-in, .js-zoom-in, .js-slide-left, .js-slide-right, .js-rotate-in').forEach((el) => {
      el.style.opacity = 1; el.style.transform = 'none';
    });
    $$('.tile').forEach(el => { el.style.opacity = 1; el.style.transform = 'none' });
    $$('.js-title-line .hero__title-inner').forEach(el => el.style.transform = 'translateY(0)');
    $$('.count').forEach(el => {
      const target = el.dataset.target;
      if (target) el.textContent = target;
    });
  }
})();
