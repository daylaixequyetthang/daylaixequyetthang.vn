// Gửi thông báo lead về Zalo qua webhook tự dựng (zca-js / n8n / Make...).
// Cấu hình ZALO_WEBHOOK_URL trong .env (URL nhận POST). Bỏ trống = bỏ qua, không lỗi.
// Body POST gửi đi: { text, name, phone, course, prize, source, time }
export async function sendZalo(lead) {
  const url = process.env.ZALO_WEBHOOK_URL;
  if (!url) {
    console.warn('Zalo webhook chưa cấu hình — bỏ qua.');
    return { ok: false, skipped: true };
  }
  const time = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  const text = [
    '🔔 LEAD MỚI — Quyết Thắng',
    lead.name ? `👤 ${lead.name}` : null,
    `📞 ${lead.phone}`,
    lead.course ? `🚗 ${lead.course}` : null,
    lead.prize ? `🎁 ${lead.prize}` : null,
    lead.source ? `📍 Nguồn: ${lead.source}` : null,
    `🕒 ${time}`,
  ].filter(Boolean).join('\n');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, ...lead, time }),
    });
    return { ok: res.ok };
  } catch (e) {
    console.error('Zalo webhook error:', e);
    return { ok: false, error: String(e) };
  }
}
