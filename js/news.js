/* ============================================================
   IBC お知らせ — microCMS 連携
   ★ 設定はこの CONFIG だけ書き換えればOK ★
   ------------------------------------------------------------
   SERVICE_DOMAIN : microCMS のサービスID（xxxx.microcms.io の xxxx 部分）
   API_KEY        : microCMS の API-KEY（読み取り専用キーでOK）
   ENDPOINT       : APIのエンドポイント名（例: news）
   ============================================================ */
const CONFIG = {
  SERVICE_DOMAIN: 'YOUR_SERVICE',   // ← ここを書き換える
  API_KEY:        'YOUR_API_KEY',   // ← ここを書き換える
  ENDPOINT:       'news',
  LIMIT:          6,                // 表示する最大件数
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
    // セレクト/テキストどちらでも拾えるように
    const c = item.category;
    if (!c) return '';
    if (Array.isArray(c)) return c[0] || '';
    return c;
  };

  const escapeHtml = (s) => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const render = (items) => {
    if (!items.length) {
      if (emptyEl) emptyEl.textContent = '現在お知らせはありません。';
      return;
    }
    listEl.innerHTML = items.map((item) => {
      const cat   = pickCategory(item);
      const catCls = CATEGORY_STYLE[cat] || 'is-info';
      const date  = fmtDate(item.publishedAt || item.createdAt || item.date);
      const title = escapeHtml(item.title || '（無題）');
      const body  = item.body || '';   // microCMSリッチエディタはHTML
      return `
        <article class="news-card">
          <div class="news-card__meta">
            <time class="news-card__date">${date}</time>
            ${cat ? `<span class="news-card__cat ${catCls}">${escapeHtml(cat)}</span>` : ''}
          </div>
          <h3 class="news-card__title">${title}</h3>
          ${body ? `<div class="news-card__body">${body}</div>` : ''}
        </article>`;
    }).join('');
  };

  const url = `https://${CONFIG.SERVICE_DOMAIN}.microcms.io/api/v1/${CONFIG.ENDPOINT}?limit=${CONFIG.LIMIT}&orders=-publishedAt`;

  fetch(url, { headers: { 'X-MICROCMS-API-KEY': CONFIG.API_KEY } })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => render(data.contents || []))
    .catch((err) => {
      console.error('[news] 取得エラー:', err);
      if (emptyEl) emptyEl.textContent = 'お知らせの読み込みに失敗しました。';
    });
})();
