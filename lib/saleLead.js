// Chuẩn hóa SĐT VN: 084.875.1111 / +84 848 751 111 -> 0848751111
export function normalizePhone(raw) {
  let p = String(raw || '').replace(/[^\d+]/g, '');
  if (p.startsWith('+84')) p = '0' + p.slice(3);
  else if (p.startsWith('84') && p.length >= 11) p = '0' + p.slice(2);
  p = p.replace(/\D/g, '');
  return p;
}

// Phân loại nguồn lead từ tracking (theo tài liệu CRM).
// tracking = { utmSource, utmMedium, fbclid, gclid, adId, campaignId, referrer, ... }
export function classifySource(t = {}) {
  const utmSource = (t.utmSource || '').toLowerCase();
  const utmMedium = (t.utmMedium || '').toLowerCase();
  const ref = (t.referrer || '').toLowerCase();
  const hasMetaAds =
    ['facebook', 'instagram'].includes(utmSource) ||
    utmMedium === 'paid_social' ||
    !!t.fbclid || !!t.adId || !!t.campaignId;

  if (hasMetaAds) {
    return { source: 'Website - Facebook Ads', trafficType: 'paid_meta' };
  }
  if (t.gclid || utmMedium.includes('cpc') || utmMedium.includes('paid_search')) {
    return { source: 'Website - Google Ads', trafficType: 'paid_search' };
  }
  if (ref.includes('google') && !utmMedium.includes('paid')) {
    return { source: 'Website - Google Organic', trafficType: 'organic_search' };
  }
  if (/facebook\.com|l\.facebook\.com|zalo|zalo\.me/.test(ref)) {
    return { source: 'Website - Social Organic', trafficType: 'organic_social' };
  }
  if (!utmSource && !ref && !t.fbclid && !t.gclid) {
    return { source: 'Website - Direct', trafficType: 'direct' };
  }
  if (ref) {
    return { source: 'Website - Referral', trafficType: 'referral' };
  }
  return { source: 'Website', trafficType: '' };
}

// Tạo record sale_leads.record (jsonb) theo đúng đặc tả CRM.
export function buildSaleLeadRecord({ name, phone, need, area, office, note, tracking = {} }) {
  const phoneNorm = normalizePhone(phone);
  const nowISO = new Date().toISOString();
  const today = nowISO.slice(0, 10);
  const cls = classifySource(tracking);

  return {
    id: `WEB-LEAD-PHONE-${phoneNorm}`,
    createdAt: today,
    createdBy: 'WEBSITE',
    name: name || '',
    phone: phoneNorm,
    area: area || '',
    need: need || '',
    office: office || '',
    source: cls.source,
    rawSource: 'website_form',
    status: 'Mới',
    temperature: 'Nóng',
    campaign: tracking.utmCampaign || '',
    campaignId: tracking.campaignId || '',
    adsetName: tracking.adsetName || '',
    adsetId: tracking.adsetId || '',
    adName: tracking.utmContent || tracking.adName || '',
    adId: tracking.adId || '',
    accountId: tracking.accountId || '',
    accountName: tracking.accountName || '',
    utmSource: tracking.utmSource || '',
    utmMedium: tracking.utmMedium || '',
    utmCampaign: tracking.utmCampaign || '',
    utmContent: tracking.utmContent || '',
    utmTerm: tracking.utmTerm || '',
    trafficType: cls.trafficType,
    landingPage: tracking.landingPage || '',
    pageUrl: tracking.pageUrl || '',
    referrer: tracking.referrer || '',
    fbclid: tracking.fbclid || '',
    fbc: tracking.fbc || '',
    fbp: tracking.fbp || '',
    gclid: tracking.gclid || '',
    sessionId: tracking.sessionId || '',
    userAgent: tracking.userAgent || '',
    note: note || 'Khách đăng ký từ website',
    lastContact: today,
    nextFollow: today,
    saleId: '',
    syncedAt: nowISO,
    enrollGrade: '',
    tuition: 0,
    paid: 0,
    revenue: 0,
    enrollDate: '',
    history: [
      { date: nowISO, userId: 'WEBSITE', status: 'Mới', note: 'Lead mới từ website' },
    ],
  };
}
