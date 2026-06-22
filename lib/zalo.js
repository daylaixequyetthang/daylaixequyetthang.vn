// Gửi thông báo lead về Zalo nhóm Sale qua webhook tự dựng (zca-js/n8n/Make).
// ZALO_WEBHOOK_URL trong .env. Bỏ trống = bỏ qua, không lỗi.
// Nhóm Zalo: "Chiến Binh Sales - KPI - Báo Cáo Công Việc". KHÔNG hiển thị SĐT khách.
export async function sendZalo(lead) {
  const url = process.env.ZALO_WEBHOOK_URL;
  if (!url) {
    console.warn('Zalo webhook chưa cấu hình — bỏ qua.');
    return { ok: false, skipped: true };
  }
  const time = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

  let text;
  if (lead.hidePhone) {
    text = [
      '🌐 LEAD WEBSITE MỚI',
      lead.name ? `Khách: ${lead.name}` : null,
      lead.need ? `Hạng/Nhu cầu: ${lead.need}` : null,
      lead.area ? `Khu vực: ${lead.area}` : null,
      lead.office ? `Văn phòng: ${lead.office}` : null,
      `Nguồn: ${lead.sourceLabel || 'Website'}`,
      lead.campaign ? `Chiến dịch: ${lead.campaign}` : null,
      lead.adName ? `Quảng cáo: ${lead.adName}` : null,
      'Trạng thái: Đã tự đẩy vào Lead',
      '👉 Sale vào App CRM để xem SĐT và chăm sóc khách.',
      `🕒 ${time}`,
    ].filter(Boolean).join('\n');
  } else {
    text = [
      '🔔 THÔNG BÁO — Quyết Thắng',
      lead.name ? `Khách: ${lead.name}` : null,
      lead.phone ? `SĐT: ${lead.phone}` : null,
      lead.course ? `Khóa: ${lead.course}` : null,
      lead.note ? lead.note : null,
      `🕒 ${time}`,
    ].filter(Boolean).join('\n');
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // channel "sale" theo đặc tả; không gửi phone khi hidePhone
      body: JSON.stringify({ channel: 'sale', text, ...(lead.hidePhone ? {} : lead), time }),
    });
    return { ok: res.ok };
  } catch (e) {
    console.error('Zalo webhook error:', e);
    return { ok: false, error: String(e) };
  }
}
