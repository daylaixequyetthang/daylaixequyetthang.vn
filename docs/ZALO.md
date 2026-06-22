# Thêm thông báo Zalo (giai đoạn 2)

Hiện lead bắn về **Telegram**. Khi muốn bắn thêm về **Zalo**, có 2 hướng:

## Cách A — Zalo OA (chính thức, khuyên dùng lâu dài)
1. Đăng ký Zalo Official Account: https://oa.zalo.me
2. Tạo Zalo App trên https://developers.zalo.me, lấy `access_token`.
3. Dùng API `https://openapi.zalo.me/v3.0/oa/message` để gửi tin cho người quản lý.
4. Cần người dùng từng tương tác với OA (theo chính sách Zalo).

## Cách B — Zalo cá nhân qua zca-js (không chính thức)
Bạn đã quen `zca-js`. Có thể dựng 1 service Node nhỏ riêng:
1. Service đăng nhập Zalo cá nhân bằng cookie (`zca-js`).
2. Mở 1 endpoint nội bộ, ví dụ `POST /notify` nhận `{ phone, course }`.
3. Đặt URL đó vào `.env` → `ZALO_WEBHOOK_URL`.
4. Sửa `lib/telegram.js` (hoặc tạo `lib/zalo.js`) để gọi thêm webhook này trong `app/api/lead/route.js`.

> Lưu ý: cách B không chính thức, tài khoản có thể bị hạn chế. Cân nhắc dùng cho nội bộ, số lượng vừa phải.

## Gợi ý code thêm vào app/api/lead/route.js
```js
// sau khi gửi Telegram:
if (process.env.ZALO_WEBHOOK_URL) {
  fetch(process.env.ZALO_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  }).catch(() => {});
}
```
