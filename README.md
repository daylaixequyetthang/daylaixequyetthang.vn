# Web Lái Xe Quyết Thắng

Nền tảng web cho Trung tâm Đào tạo Lái xe Quyết Thắng (Bình Thuận):
landing page chuyển đổi cao, vòng quay ưu đãi, app thi thử 600 câu,
CMS viết bài SEO/tin tức, quản lý lead, bắn lead về Telegram.

**Stack:** Next.js 14 · Supabase · Telegram · Vercel

## Bắt đầu
Xem hướng dẫn đầy đủ trong [`docs/SETUP.md`](docs/SETUP.md).

```bash
npm install
cp .env.example .env   # điền biến môi trường
npm run dev
```

## Tính năng
- 🎨 Landing page gradient, animation, banner chạy
- 🎡 Vòng quay ưu đãi — **chỉnh tỷ lệ trúng tại admin**
- 📝 App thi thử 600 câu (chế độ thi & ôn tập, điểm liệt)
- 🔐 Đăng nhập admin + tài khoản con viết bài SEO/tin tức
- 📨 Lead bắn về Telegram (mở rộng Zalo — xem `docs/ZALO.md`)
- 📊 Quản lý lead, đánh dấu đã gọi / đã chốt
