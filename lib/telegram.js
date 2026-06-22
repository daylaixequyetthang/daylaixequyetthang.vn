// Gửi thông báo lead về Telegram.
// Cần TELEGRAM_BOT_TOKEN và TELEGRAM_CHAT_ID trong .env
export async function sendTelegram(lead) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn('Telegram chưa cấu hình — bỏ qua gửi.');
    return { ok: false, skipped: true };
  }

  const time = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  let lines;

  if (lead.hidePhone) {
    // Mẫu thông báo nhóm Sale — KHÔNG hiển thị SĐT khách
    lines = [
      '🌐 *LEAD WEBSITE MỚI*',
      '',
      lead.name ? `Khách: ${esc(lead.name)}` : null,
      lead.need ? `Hạng/Nhu cầu: ${esc(lead.need)}` : null,
      lead.area ? `Khu vực: ${esc(lead.area)}` : null,
      lead.office ? `Văn phòng: ${esc(lead.office)}` : null,
      `Nguồn: ${esc(lead.sourceLabel || 'Website')}`,
      lead.campaign ? `Chiến dịch: ${esc(lead.campaign)}` : null,
      lead.adName ? `Quảng cáo: ${esc(lead.adName)}` : null,
      'Trạng thái: Đã tự đẩy vào Lead',
      '',
      '👉 Sale vào App CRM để xem SĐT và chăm sóc khách.',
      `🕒 ${time}`,
    ].filter(Boolean);
  } else {
    // Thông báo nội bộ thường (đặt cọc...) — vẫn có thể kèm note
    lines = [
      '🔔 *THÔNG BÁO — Quyết Thắng*',
      '',
      lead.name ? `👤 Họ tên: ${esc(lead.name)}` : null,
      lead.phone ? `📞 SĐT: \`${esc(lead.phone)}\`` : null,
      lead.course ? `🚗 Khóa: ${esc(lead.course)}` : null,
      lead.source ? `📍 Nguồn: ${esc(lead.source)}` : null,
      lead.note ? `📝 ${esc(lead.note)}` : null,
      `🕒 ${time}`,
    ].filter(Boolean);
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: lines.join('\n'), parse_mode: 'Markdown' }),
    });
    const data = await res.json();
    return { ok: data.ok === true, data };
  } catch (e) {
    console.error('Telegram error:', e);
    return { ok: false, error: String(e) };
  }
}

function esc(t) {
  return String(t).replace(/[_*`[\]]/g, '\\$&');
}
