'use client';
// Thu thập thông tin tracking nguồn truy cập (UTM, fbclid, referrer...).
// Lưu vào localStorage ngay lần đầu vào web, để khi gửi form vẫn còn.

const KEY = 'qt_tracking';

export function captureTracking() {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    const q = (k) => url.searchParams.get(k) || '';
    const incoming = {
      utmSource: q('utm_source'),
      utmMedium: q('utm_medium'),
      utmCampaign: q('utm_campaign'),
      utmContent: q('utm_content'),
      utmTerm: q('utm_term'),
      campaignId: q('campaign_id'),
      adsetId: q('adset_id'),
      adId: q('ad_id'),
      fbclid: q('fbclid'),
      gclid: q('gclid'),
      landingPage: url.pathname + url.search,
      pageUrl: window.location.href,
      referrer: document.referrer || '',
      userAgent: navigator.userAgent || '',
      sessionId: getSessionId(),
      fbp: getCookie('_fbp'),
      fbc: getCookie('_fbc'),
    };
    const existing = readStored();
    // Chỉ ghi đè khi có giá trị mới (giữ nguồn đầu tiên nếu lần sau vào trực tiếp)
    const merged = { ...existing };
    for (const [k, v] of Object.entries(incoming)) {
      if (v && (!existing[k] || ['pageUrl', 'landingPage', 'referrer'].includes(k))) merged[k] = v;
      else if (!existing[k]) merged[k] = v;
    }
    window.localStorage.setItem(KEY, JSON.stringify(merged));
  } catch {}
}

export function getTracking() {
  if (typeof window === 'undefined') return {};
  return readStored();
}

function readStored() {
  try { return JSON.parse(window.localStorage.getItem(KEY) || '{}'); } catch { return {}; }
}
function getCookie(name) {
  try {
    const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return m ? m[2] : '';
  } catch { return ''; }
}
function getSessionId() {
  try {
    let s = window.sessionStorage.getItem('qt_sid');
    if (!s) { s = 'S' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); window.sessionStorage.setItem('qt_sid', s); }
    return s;
  } catch { return ''; }
}
