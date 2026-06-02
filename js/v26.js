/* IBC V26 — Big Energy (Full Site) */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ===== Lenis ===== */
  let lenis = null;
  if (window.Lenis && !reduced) {
    lenis = new window.Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);

    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id && id.length > 1) {
          const el = $(id);
          if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -60, duration: 1.3 }); }
        }
      });
    });
  }

  /* ===== Float CTA show/hide (contact / footer 入ったら消す) ===== */
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

  /* ===== Gallery accordion (もっと見る) ===== */
  const galleryGrid = $('#gallery-grid');
  const galleryMoreBtn = $('#gallery-more-btn');
  if (galleryGrid && galleryMoreBtn) {
    const label = galleryMoreBtn.querySelector('.gallery-more-btn__label');
    galleryMoreBtn.addEventListener('click', () => {
      const isOpen = !galleryGrid.classList.contains('is-collapsed');
      if (isOpen) {
        // 閉じる: トップから16枚目以降を非表示にする前にスクロール戻す
        galleryGrid.classList.add('is-collapsed');
        galleryMoreBtn.classList.remove('is-open');
        galleryMoreBtn.setAttribute('aria-expanded', 'false');
        if (label) label.textContent = 'もっと見る';
        // スクロールをセクション先頭へ
        const sec = document.getElementById('gallery');
        if (sec) {
          const y = sec.getBoundingClientRect().top + window.scrollY - 80;
          if (lenis) lenis.scrollTo(y, { duration: 1.0 });
          else window.scrollTo({ top: y, behavior: 'smooth' });
        }
      } else {
        // 開く: クラス外し、追加分にフェードイン用クラス付与
        galleryGrid.classList.remove('is-collapsed');
        galleryMoreBtn.classList.add('is-open');
        galleryMoreBtn.setAttribute('aria-expanded', 'true');
        if (label) label.textContent = '閉じる';
        // 残りの項目にフェードイン
        const hidden = $$('.gallery-item', galleryGrid).slice(8);
        hidden.forEach((el, i) => {
          el.classList.remove('is-revealed');
          // reflow
          void el.offsetWidth;
          el.style.animationDelay = (i * 0.04) + 's';
          el.classList.add('is-revealed');
        });
      }
    });
  }

  /* ===== Gallery modal ===== */
  const modal = $('#gallery-modal');
  if (modal) {
    const modalImg = modal.querySelector('img');
    const openModal = (src, alt) => {
      modalImg.src = src; modalImg.alt = alt || '';
      modal.classList.add('is-open');
      lenis?.stop();
    };
    const closeModal = () => {
      modal.classList.remove('is-open');
      lenis?.start();
    };
    $$('.gallery-item').forEach((b) => {
      b.addEventListener('click', () => openModal(b.dataset.src, b.dataset.alt));
    });
    modal.querySelector('.gallery-modal-close')?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  /* ===== GSAP ===== */
  if (window.gsap && !reduced) {
    const gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    /* HERO timeline */
    const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    heroTl.from('.nav__inner > *', { y: -16, opacity: 0, duration: .5, stagger: .08, ease: 'power3.out' }, 0);

    const tiles = $$('.hero .tile');
    tiles.forEach((tile, i) => {
      heroTl.fromTo(tile,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: .6, ease: 'power3.out' },
        .1 + i * .05);
    });

    heroTl.from('.center-card', { scale: .92, opacity: 0, duration: .85 }, .7);
    heroTl.from('.center-card__img-label, .center-card__img-tag',
      { opacity: 0, scale: 0, duration: .5, stagger: .12, ease: 'back.out(2)' }, 1.1);
    heroTl.from('.center-card__chip', { x: -16, opacity: 0, duration: .55, ease: 'power3.out' }, 1.2);
    heroTl.from('.hero__title-inner', { y: 60, opacity: 0, duration: .8, stagger: .14, ease: 'expo.out' }, 1.3);
    heroTl.from('.hero__lead', { y: 14, opacity: 0, duration: .65, ease: 'power3.out' }, 1.55);
    heroTl.from('.hero__stat', { scale: 0, opacity: 0, duration: .55, stagger: .12, ease: 'back.out(1.6)' }, 1.65);
    heroTl.from('.hero__ctas .btn', { y: 20, opacity: 0, duration: .55, stagger: .12, ease: 'back.out(1.6)' }, 1.9);

    // hero counter
    $$('.hero__stat-num .count').forEach((el) => {
      const target = parseInt(el.dataset.target, 10);
      const obj = { v: 0 };
      heroTl.to(obj, { v: target, duration: 1.0, ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(obj.v); } }, 1.7);
    });

    /* Hero tile parallax */
    if (window.ScrollTrigger) {
      tiles.forEach((t, i) => {
        const depth = (i % 3) * 12 + 6;
        gsap.to(t.querySelector('img'), {
          yPercent: -depth, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
        });
      });
      gsap.to('.center-card', { yPercent: -5, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    /* Section reveals */
    if (window.ScrollTrigger) {
      const animMap = [
        ['.js-fade-in',    { opacity: 0, y: 40 },              { opacity: 1, y: 0 }],
        ['.js-zoom-in',    { opacity: 0, scale: .92 },         { opacity: 1, scale: 1 }],
        ['.js-slide-left', { opacity: 0, x: -50 },             { opacity: 1, x: 0 }],
        ['.js-slide-right',{ opacity: 0, x: 50 },              { opacity: 1, x: 0 }],
      ];
      animMap.forEach(([sel, from, to]) => {
        $$(sel).forEach((el) => {
          gsap.fromTo(el, from, {
            ...to,
            duration: .85, ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reset' }
          });
        });
      });

      // stagger grids
      $$('.stats-grid, .features-grid, .philosophy-list, .voices-grid, .gallery-grid, .steps-grid, .events-scroll').forEach((grp) => {
        const items = grp.children;
        gsap.fromTo(items,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0,
            duration: .65, ease: 'power3.out', stagger: .08,
            scrollTrigger: { trigger: grp, start: 'top 85%', toggleActions: 'play none none reset' } });
      });
    }

    /* Counter for stats/price */
    if (window.ScrollTrigger) {
      $$('.s-stats .count').forEach((el) => {
        const target = parseInt(el.dataset.target, 10);
        if (!isFinite(target)) return;
        ScrollTrigger.create({
          trigger: el, start: 'top 85%', once: true,
          onEnter: () => {
            const obj = { v: 0 };
            gsap.to(obj, { v: target, duration: 1.2, ease: 'power2.out',
              onUpdate: () => { el.textContent = Math.round(obj.v); } });
          }
        });
      });
    }

    /* Slogan giant text parallax */
    if (window.ScrollTrigger) {
      gsap.to('.slogan-bg', {
        yPercent: -18, ease: 'none',
        scrollTrigger: { trigger: '.slogan', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }

    /* Magnetic CTAs */
    if (matchMedia('(pointer:fine)').matches) {
      $$('.btn, .contact-btn, .nav__cta').forEach((b) => {
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

      /* Mouse parallax on hero deco */
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
    }
  } else {
    /* Reduced motion fallback */
    $$('.js-fade-in, .js-zoom-in, .js-slide-left, .js-slide-right').forEach((el) => {
      el.style.opacity = 1; el.style.transform = 'none';
    });
    $$('.tile').forEach(el => { el.style.opacity = 1; el.style.transform = 'none' });
    $$('.count').forEach(el => {
      const target = el.dataset.target;
      if (target) el.textContent = target;
    });
  }
})();
