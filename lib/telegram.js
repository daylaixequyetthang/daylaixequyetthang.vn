// Gửi thông báo lead/SĐT về Telegram.
// Cần TELEGRAM_BOT_TOKEN và TELEGRAM_CHAT_ID trong .env
export async function sendTelegram(lead) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn('Telegram chưa cấu hình — bỏ qua gửi.');
    return { ok: false, skipped: true };
  }

  const lines = [
    '🔔 *LEAD MỚI — Quyết Thắng*',
    '',
    lead.name ? `👤 Họ tên: ${esc(lead.name)}` : null,
    `📞 SĐT: \`${esc(lead.phone)}\``,
    lead.course ? `🚗 Khóa: ${esc(lead.course)}` : null,
    lead.prize ? `🎁 Trúng: ${esc(lead.prize)}` : null,
    `📍 Nguồn: ${sourceLabel(lead.source)}`,
    `🕒 ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
  ].filter(Boolean);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join('\n'),
        parse_mode: 'Markdown',
      }),
    });
    const data = await res.json();
    return { ok: data.ok === true, data };
  } catch (e) {
    console.error('Telegram error:', e);
    return { ok: false, error: String(e) };
  }
}

function sourceLabel(s) {
  return { form: 'Form đăng ký', lucky_wheel: '🎡 Vòng quay', popup: 'Popup' }[s] || s || 'web';
}
function esc(t) {
  return String(t).replace(/[_*`[\]]/g, '\\$&');
}
