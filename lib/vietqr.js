// Tạo mã QR chuyển khoản theo chuẩn VietQR (img.vietqr.io — miễn phí, không cần key).
// Doc: https://www.vietqr.io/danh-sach-api/link-tao-ma-qr/

export function buildVietQRUrl({ bankId, accountNo, accountName, amount, addInfo, template = 'compact2' }) {
  const base = `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png`;
  const params = new URLSearchParams();
  if (amount) params.set('amount', String(amount));
  if (addInfo) params.set('addInfo', addInfo);
  if (accountName) params.set('accountName', accountName);
  return `${base}?${params.toString()}`;
}

// Mã đơn dạng QT-XXXXXX (dễ đọc khi chuyển khoản)
export function genOrderCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `QT${s}`;
}
