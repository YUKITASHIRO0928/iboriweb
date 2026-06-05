/* ============================================================
   IBC お知らせ — microCMS 連携
   ★ 設定はこの CONFIG だけ書き換えればOK ★
   ------------------------------------------------------------
   SERVICE_DOMAIN : microCMS のサービスID（xxxx.microcms.io の xxxx 部分）
   API_KEY        : microCMS の API-KEY（読み取り専用キーでOK）
   ENDPOINT       : APIのエンドポイント名（例: news）
   ============================================================ */
const CONFIG = {
  SERVICE_DOMAIN: 'iboribad',                                  // microCMS サービスID
  API_KEY:        'uYKwF3ZhlurT8pmFvMTWU948ZZzQ7At9v8VE',      // 読み取り専用 API-KEY
  ENDPOINT:       'news',
  LIMIT:          8,                // 表示する最大件数
};

(() => {
  const listEl  = document.getElementById('news-list');
  const emptyEl = document.getElementById('news-empty');
  if (!listEl) return;

  // 設定がまだプレースホルダーのままなら、セクションごと隠す
  if (CONFIG.SERVICE_DOMAIN === 'YOUR_SERVICE' || CONFIG.API_KEY === 'YOUR_API_KEY') {
    const section = document.getElementById('news');
    if (section) section.style.display = 'none';
    return;
  }

  const CATEGORY_STYLE = {
    'お知らせ':   'is-info',
    '大会結果':   'is-result',
    'イベント':   'is-event',
    '募集':       'is-recruit',
  };

  const fmtDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d)) return '';
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  const pickCategory = (item) => {
    const c = item.category;
    if (!c) return '';
    if (Array.isArray(c)) return c[0] || '';
    return c;
  };

  const escapeHtml = (s) => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // 本文HTMLからプレーンテキスト抜粋を作る（一覧用）
  const excerpt = (html, len = 70) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    const text = (tmp.textContent || '').replace(/\s+/g, ' ').trim();
    return text.length > len ? text.slice(0, len) + '…' : text;
  };

  let items = [];

  /* ---------- モーダル制御 ---------- */
  const modal     = document.getElementById('news-modal');
  const mDate     = document.getElementById('news-modal-date');
  const mCat      = document.getElementById('news-modal-cat');
  const mTitle    = document.getElementById('news-modal-title');
  const mBody     = document.getElementById('news-modal-body');
  let lastFocused = null;

  const openModal = (idx) => {
    const item = items[idx];
    if (!item || !modal) return;
    lastFocused = document.activeElement;
    const cat = pickCategory(item);
    mDate.textContent = fmtDate(item.publishedAt || item.createdAt);
    if (cat) {
      mCat.textContent = cat;
      mCat.className = 'news-modal__cat ' + (CATEGORY_STYLE[cat] || 'is-info');
      mCat.style.display = '';
    } else {
      mCat.style.display = 'none';
    }
    mTitle.textContent = item.title || '（無題）';
    mBody.innerHTML = item.body || '';
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.news-modal__close');
    if (closeBtn) closeBtn.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  };

  if (modal) {
    modal.querySelectorAll('[data-news-close]').forEach((el) => {
      el.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  /* ---------- 一覧描画 ---------- */
  const render = () => {
    if (!items.length) {
      if (emptyEl) emptyEl.textContent = '現在お知らせはありません。';
      return;
    }
    listEl.innerHTML = items.map((item, i) => {
      const cat    = pickCategory(item);
      const catCls = CATEGORY_STYLE[cat] || 'is-info';
      const date   = fmtDate(item.publishedAt || item.createdAt);
      const title  = escapeHtml(item.title || '（無題）');
      const ex     = escapeHtml(excerpt(item.body));
      return `
        <button class="news-card" type="button" data-idx="${i}">
          <div class="news-card__meta">
            <time class="news-card__date">${date}</time>
            ${cat ? `<span class="news-card__cat ${catCls}">${escapeHtml(cat)}</span>` : ''}
          </div>
          <h3 class="news-card__title">${title}</h3>
          ${ex ? `<p class="news-card__excerpt">${ex}</p>` : ''}
          <span class="news-card__more">詳しく見る →</span>
        </button>`;
    }).join('');

    listEl.querySelectorAll('.news-card').forEach((btn) => {
      btn.addEventListener('click', () => openModal(parseInt(btn.dataset.idx, 10)));
    });
  };

  const url = `https://${CONFIG.SERVICE_DOMAIN}.microcms.io/api/v1/${CONFIG.ENDPOINT}?limit=${CONFIG.LIMIT}&orders=-publishedAt`;

  fetch(url, { headers: { 'X-MICROCMS-API-KEY': CONFIG.API_KEY } })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => { items = data.contents || []; render(); })
    .catch((err) => {
      console.error('[news] 取得エラー:', err);
      if (emptyEl) emptyEl.textContent = 'お知らせの読み込みに失敗しました。';
    });
})();
