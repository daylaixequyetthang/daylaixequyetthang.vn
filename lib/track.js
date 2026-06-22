// Bắn sự kiện tới Meta Pixel + Google Analytics một cách an toàn.
// Gọi trackEvent('Lead') khi khách để lại SĐT, trackEvent('Purchase', {value, currency}) khi đặt cọc...
// Nếu Pixel/GA chưa tải hoặc chưa cấu hình, hàm tự bỏ qua, không gây lỗi.

export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window.fbq === 'function') window.fbq('track', name, params);
  } catch {}
  try {
    if (typeof window.gtag === 'function') {
      // map vài tên sự kiện Meta sang tên GA4 thông dụng
      const gaName = { Lead: 'generate_lead', Purchase: 'purchase', Contact: 'contact' }[name] || name.toLowerCase();
      window.gtag('event', gaName, params);
    }
  } catch {}
}
