# Hướng dẫn cài đặt — Web Lái Xe Quyết Thắng

Nền tảng: **Next.js 14 + Supabase + Telegram**, deploy lên **Vercel** (miễn phí).

---

## 0. Cần chuẩn bị
- Tài khoản [Supabase](https://supabase.com) (miễn phí)
- Tài khoản [Vercel](https://vercel.com) (miễn phí)
- 1 Bot Telegram (tạo qua @BotFather)
- Node.js 18+ nếu chạy thử ở máy

---

## 1. Cài đặt ở máy (tùy chọn, để chạy thử)
```bash
npm install
cp .env.example .env      # rồi điền các giá trị (xem bước 2,3,4)
npm run dev               # mở http://localhost:3000
```

---

## 2. Tạo database Supabase
1. Vào supabase.com → **New project** → đặt tên, chọn region Singapore.
2. Vào **SQL Editor** → **New query** → dán toàn bộ nội dung file `db/schema.sql` → **Run**.
3. Vào **Project Settings → API**, lấy 3 giá trị điền vào `.env`:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role key (bí mật!)

---

## 3. Tạo Telegram Bot (nhận lead)
1. Mở Telegram, nhắn **@BotFather** → `/newbot` → đặt tên → nhận **token**.
   - Điền `TELEGRAM_BOT_TOKEN` trong `.env`.
2. Lấy Chat ID:
   - Tạo 1 nhóm, thêm bot vào, gửi 1 tin bất kỳ.
   - Mở: `https://api.telegram.org/bot<TOKEN>/getUpdates`
   - Tìm `"chat":{"id":-100xxxxxxxxx}` → đó là `TELEGRAM_CHAT_ID`.
3. Test: vào website điền form đăng ký → tin nhắn sẽ về nhóm Telegram.

---

## 4. Tạo khóa bảo mật đăng nhập
```bash
# Tạo chuỗi ngẫu nhiên cho AUTH_SECRET
openssl rand -base64 32
```
Dán kết quả vào `AUTH_SECRET` trong `.env`.

---

## 5. Tạo tài khoản admin đầu tiên
```bash
node scripts/hash.js "MatKhauAdminCuaBan"
```
Copy chuỗi hash in ra, rồi vào Supabase **SQL Editor** chạy:
```sql
insert into app_users(email, password_hash, full_name, role) values
('admin@quyetthang.vn', '<DÁN_HASH_VÀO_ĐÂY>', 'Quản trị viên', 'admin');
```
Giờ đăng nhập tại `/admin/login`.

> Sau khi đăng nhập admin, vào **Tài khoản** để tạo thêm tài khoản con cho nhân viên viết bài (không cần dùng SQL nữa).

---

## 6. Deploy lên Vercel
1. Đẩy code lên GitHub (1 repo riêng).
2. Vercel → **Add New → Project** → chọn repo.
3. Mục **Environment Variables**: thêm tất cả biến trong `.env` (cả Supabase, Telegram, AUTH_SECRET).
4. **Deploy**. Vài phút sau có link `*.vercel.app`.
5. Trỏ tên miền `daylaixequyetthang.vn`: Vercel → **Domains** → thêm domain → cập nhật DNS theo hướng dẫn.

---

## 7. Quản trị hằng ngày
- `/admin` — tổng quan, lead gần đây
- `/admin/leads` — danh sách lead, đánh dấu đã gọi / đã chốt
- `/admin/posts` — viết bài SEO, tin tức
- `/admin/settings` — **chỉnh tỷ lệ vòng quay**, sửa banner chạy, link mạng xã hội
- `/admin/users` — tạo tài khoản con cho nhân viên

---

## Cấu trúc thư mục
```
app/            # các trang (trang chủ, thi thử, tin tức, admin) + API
components/      # giao diện trang chủ, form, vòng quay
lib/             # supabase, auth, telegram, dữ liệu khóa học, câu hỏi
db/schema.sql    # tạo bảng Supabase
scripts/hash.js  # tạo mật khẩu admin
docs/            # tài liệu
```

## Nạp đủ 600 câu hỏi thi thử
File `lib/questions.js` hiện có 20 câu mẫu. Tải bộ 600 câu chính thức của Bộ Công an,
map vào đúng định dạng `{ id, q, options, answer, critical, topic }` rồi thay mảng `QUESTIONS`.
Đánh dấu `critical: true` cho 60 câu điểm liệt.

---

## 8. Dùng tên miền riêng (daylaixequyetthang.vn) trên Vercel
Vercel cho dùng domain mua ở bất kỳ đâu (Mắt Bão, PA Vietnam, GoDaddy...):
1. Vercel → Project → **Settings → Domains** → nhập `daylaixequyetthang.vn`.
2. Vercel hiện 2 cách trỏ DNS — chọn 1:
   - **A record**: tạo bản ghi A `@` → `76.76.21.21`, và CNAME `www` → `cname.vercel-dns.com`
   - hoặc đổi **nameserver** sang Vercel (Vercel hướng dẫn trực tiếp).
3. Chờ DNS cập nhật (vài phút–vài giờ). SSL https Vercel tự cấp miễn phí.

## 9. Câu hỏi thi thử có HÌNH ẢNH (biển báo, sa hình)
Bộ 600 câu có nhiều câu cần hình. Cách thêm:
1. Đặt file ảnh vào thư mục `public/questions/` (VD `cau-101.png`).
2. Trong `lib/questions.js`, thêm trường `image` cho câu đó:
   ```js
   { id: 101, topic: 'Biển báo', q: 'Biển nào...?',
     image: '/questions/cau-101.png',
     options: [...], answer: 0, critical: false },
   ```
3. Câu không có hình thì bỏ trường `image`. Giao diện tự hiển thị ảnh khi có.
   (File mẫu: `public/questions/bien-bao-mau.svg`, `sa-hinh-mau.svg`.)

---

## 10. Mạng xã hội & nút liên hệ (đã tích hợp)
Trang web đã có sẵn:
- **Nút Gọi** (📞 084 875 1111) — nổi góc phải + nhiều nơi trong trang.
- **Nút Zalo chat** — mở zalo.me/0848751111.
- **Nút Messenger** — mở m.me/daylaixequyetthangbt (chat trực tiếp Fanpage).
- **Chatbot tự động** — trả lời học phí, lịch, thủ tục 24/7; admin tự thêm câu trả lời tại /admin/chatbot.
- Footer có icon Facebook, Messenger, Zalo.

### Thêm YouTube / TikTok (nếu có)
Mở file `lib/data.js`, điền link vào `SOCIAL`:
```js
export const SOCIAL = {
  facebook: 'https://facebook.com/daylaixequyetthangbt',
  messenger: 'https://m.me/daylaixequyetthangbt',
  youtube: 'https://youtube.com/@kenh-cua-ban',   // điền vào đây
  tiktok: 'https://tiktok.com/@kenh-cua-ban',      // điền vào đây
  zalo: ZALO,
};
```
Icon sẽ tự hiện ở footer khi có link.

### (Nâng cao) Chèn bong bóng Messenger chính chủ của Facebook
Nếu muốn bong bóng chat Messenger "thật" của Facebook (Customer Chat Plugin) thay vì nút m.me:
1. Vào Fanpage → Meta Business Suite → Cài đặt → Plugin chat.
2. Lấy đoạn mã nhúng, dán vào `app/layout.js` trước thẻ đóng body.
3. Cần xác minh quyền sở hữu domain trong cài đặt Fanpage.
Hiện web đang dùng nút m.me đơn giản, không cần cấu hình — bấm là mở Messenger ngay.

---

## 11. Bộ 600 câu hỏi thật (ĐÃ NẠP)
App đã nạp đầy đủ 600 câu hỏi chính thức của Cục CSGT Bộ Công an (Hà Nội 2025, áp dụng 01/6/2025), trích trực tiếp từ tài liệu PDF gốc:
- 600/600 câu kèm đáp án đúng (lấy từ phần gạch chân trong tài liệu gốc, chính xác 100%).
- 279 ảnh biển báo và sa hình trong public/questions/ (cau-N.png).
- 6 chương: Khái niệm và quy tắc (1-180), Văn hóa đạo đức (181-205), Kỹ thuật lái xe (206-263), Cấu tạo sửa chữa (264-300), Biển báo (301-485), Sa hình (486-600).
- Đề thi thử: 35 câu / 22 phút / đúng tối thiểu 32 câu (chuẩn hạng B).

### Câu điểm liệt - cần đối chiếu
Tài liệu PDF gốc KHÔNG đánh số 60 câu điểm liệt. App đang đánh dấu thận trọng 15 câu chắc chắn (nồng độ cồn, ma túy, hành vi nghiêm cấm). Để đủ 60 câu: lấy danh sách 60 số câu điểm liệt chính thức, mở lib/questions.js, thêm critical: true vào các câu theo id.

### Sửa câu hỏi
Toàn bộ câu nằm trong lib/questions.js, mỗi câu 1 dòng dễ tìm theo id. Sửa text, answer (0-based) hoặc image trực tiếp.

---

## 12. Tin tức (30 bài đã nạp sẵn) & Đánh giá học viên

### Bài viết tin tức
Website đã có sẵn 30 bài viết (kinh nghiệm, hướng dẫn, kiến thức luật) trong file lib/posts.js, hiển thị ngay không cần Supabase. Trang /tin-tuc và sitemap đã tự động gồm các bài này.
- Sửa/thêm bài: mở lib/posts.js, mỗi bài có slug, title, excerpt, category, content (Markdown nhẹ: ## tiêu đề, - gạch đầu dòng, **đậm**).
- Khi kết nối Supabase và đăng bài qua admin, dữ liệu DB sẽ được ưu tiên hiển thị thay cho bài tĩnh.
- Lưu ý: các số liệu học phí/luật trong bài mang tính tham khảo tại thời điểm viết, nên rà lại khi quy định thay đổi.

### Đánh giá học viên (REVIEW) - CẦN THAY BẰNG REVIEW THẬT
Mục "Học viên nói gì" trên trang chủ hiện dùng review MẪU (đánh dấu "(mẫu)") trong lib/data.js (mảng REVIEWS).
KHÔNG nên để review giả lâu dài: vi phạm quy định quảng cáo trung thực (Nghị định 38), và mất uy tín nếu khách phát hiện.
Cách lấy review thật:
1. Xin phép vài học viên cũ cho trích cảm nhận + tên (hoặc tên viết tắt) → điền vào REVIEWS.
2. Hoặc chụp màn hình bình luận thật trên Facebook fanpage.
3. Tốt nhất: dùng đánh giá Google Maps thật. Điền link vào GOOGLE_REVIEW_URL trong lib/data.js để hiện nút "Xem & viết đánh giá trên Google" — khách bấm vào xem review thật + tự đánh giá.
Nếu chưa có review thật, có thể để REVIEWS = [] (mảng rỗng) thì mục này tự ẩn, tránh dùng review giả.

---

## 13. Văn phòng (map + chỉ đường) & Review Google

### 3 văn phòng + bản đồ
Website tập trung tuyển sinh ONLINE; phần 3 văn phòng đặt phụ ở mục Liên hệ, mỗi văn phòng có nút Chỉ đường trỏ tới Google Maps thật (Phan Thiet, La Gi, Bac Binh). Link gắn trong lib/data.js (OFFICES, mỗi VP có trường maps). Có 1 bản đồ Google nhúng nhỏ; bản đồ hiển thị khi chạy trên Vercel (preview nội bộ có thể báo chặn google.com, bình thường).

### Review Google thật (KHONG dung review gia)
Muc Hoc vien noi gi co nut "Xem & viet danh gia tren Google" tro toi Google Maps that (GOOGLE_REVIEW_URL trong lib/data.js). Cac the review tren trang van la MAU (ghi ro "Hoc vien (mau)"). Nen thay bang cam nhan that cua hoc vien hoac de REVIEWS = [] de an. KHONG copy noi dung review cua nguoi khac tu Google dan vao web (ban quyen + quyen rieng tu) - cach dung la dan link toi Google nhu da lam.

---

## 14. SEO (đã tối ưu sẵn - không cần Yoast)

Lưu ý: Yoast SEO là plugin của WordPress, KHÔNG dùng cho web Next.js này. Các chức năng tương đương đã được code sẵn:
- Metadata (title, description, keywords) cho mọi trang, có template tiêu đề.
- metadataBase + canonical: đúng khi share link, tránh trùng lặp.
- Open Graph + Twitter Card + ảnh og-image.png: hiển thị đẹp khi share lên Facebook/Zalo.
- Favicon (app/icon.png) hiện trên tab trình duyệt.
- Dữ liệu có cấu trúc (Schema.org): DrivingSchool (trung tâm + 3 địa chỉ + hotline), ItemList khóa học, FAQPage (trang cập nhật quy định). Giúp Google hiển thị thông tin phong phú.
- sitemap.xml (36 URL gồm 30 bài) + robots.txt (chặn /admin, /api).
- lang="vi", tốc độ tải nhanh (Next.js render sẵn).

### Việc CẦN làm sau khi deploy lên Vercel
1. Đăng ký Google Search Console (search.google.com/search-console), xác minh domain, gửi sitemap: https://daylaixequyetthang.vn/sitemap.xml
2. Tạo Google Business Profile cho 3 văn phòng (rất quan trọng cho tìm kiếm địa phương "học lái xe Bình Thuận").
3. Kiểm tra schema bằng: search.google.com/test/rich-results
4. Thay og-image.png bằng ảnh thật của trung tâm nếu muốn (kích thước 1200x630).

---

## 15. Meta Pixel (Facebook) & Google Analytics

### Meta Pixel - ĐÃ GẮN SẴN
Pixel ID 1311091366692533 đã tích hợp trong components/Analytics.jsx, chạy trên mọi trang. Không cần làm gì thêm. Để đổi ID, sửa biến META_PIXEL_ID trong file đó.

### Google Analytics (GA4) - CHỈ CẦN ĐIỀN MÃ
1. Vào analytics.google.com tạo property GA4, lấy mã đo lường dạng G-XXXXXXXXXX.
2. Điền vào biến môi trường NEXT_PUBLIC_GA_ID:
   - Local: thêm dòng NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX vào file .env
   - Vercel: vào Settings > Environment Variables, thêm NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX
3. Deploy lại. GA tự kích hoạt. Nếu để trống, GA bị bỏ qua (web vẫn chạy).

### Sự kiện chuyển đổi đã gắn (conversion)
Ngoài PageView, web tự bắn sự kiện khi khách hành động (đo hiệu quả quảng cáo):
- Khách để lại SĐT (form tư vấn) -> sự kiện Lead.
- Khách tạo đơn đặt cọc -> sự kiện Lead + InitiateCheckout (kèm giá trị 2.000.000đ).
Các sự kiện này hiện trong Meta Events Manager và Google Analytics, dùng để tối ưu quảng cáo Facebook/Google.

Mẹo: sau khi deploy, cài tiện ích "Meta Pixel Helper" trên Chrome để kiểm tra Pixel chạy đúng.

---

## 16. Quyen rieng tu (chuan Facebook/Google)

Chay Meta Pixel + Google Analytics bat buoc phai cong bo viec thu thap du lieu. Da them:
- Trang Chinh sach quyen rieng tu: /chinh-sach-bao-mat (neu ro thu thap gi, dung Meta Pixel + Google Analytics, quyen nguoi dung, lien he). Da them vao sitemap.
- Link Chinh sach quyen rieng tu o footer moi trang.
- Banner thong bao cookie (components/CookieNotice.jsx): thong bao + link chinh sach + nut Da hieu. Banner CHI thong bao, KHONG chan tracking (Pixel/GA chay ngay khi tai trang). Phu hop khach Viet Nam.

Sua noi dung: mo app/chinh-sach-bao-mat/page.js (thong tin trung tam da dien san).
Luu y: neu sau nay co nhieu khach EU, nen nang len co che xin dong y TRUOC khi tracking (GDPR).

---

## 17. Landing page quang cao (Voucher Mui Ne)

URL: /uu-dai-he - trang one-product chay quang cao. KHONG hien menu, KHONG index Google (noindex), KHONG vao sitemap. Co form dat coc -> ma don + QR VietQR. Khi dat coc: ban thong bao ca Telegram VA Zalo, kem ghi chu Voucher Mui Ne, nguon landing_voucher. Da gan Pixel/GA: ViewContent, Lead, InitiateCheckout.

Bat Zalo: tao ZALO_WEBHOOK_URL trong .env (webhook zca-js/n8n/Make nhan POST). De trong = chi ban Telegram.
Sua noi dung: app/uu-dai-he/VoucherClient.jsx

### Kich thuoc anh that - landing /uu-dai-he
- Anh hero (resort Mui Ne / khoa hoc): 1200 x 700 px (ngang), JPG/WebP. Cho dat: div data-img="hero".
- Anh hoc vien da dang ky: 4 anh VUONG 800 x 800 px. Cho dat: div data-img="student-1" den student-4.
Cach gan: thay div data-img bang the img src="/anh/ten.jpg" trong app/uu-dai-he/VoucherClient.jsx, dat anh vao public/anh/.

### Tinh nang landing chuyen doi
- 2 nut rieng: De lai SDT (chi luu lead) va Dat coc giu cho (tao QR). Ca 2 ban Telegram + Zalo.
- Bo dem nguoc tu dong toi cuoi thang hien tai (khong phai sua code moi thang).
- 3 san pham: B tu dong / B co khi / C1 (15.5tr / 15.5tr / 19tr). Bam Xem chi tiet -> popup chi tiet.
- Quy trinh 6 buoc tu dang ky den lay bang.
