-- ============================================================
-- QUYẾT THẮNG — Supabase schema
-- Chạy file này trong Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- 1) BẢNG USERS (admin + tài khoản con viết bài)
create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,          -- bcrypt
  full_name text not null,
  role text not null default 'editor',  -- 'admin' | 'editor'
  is_active boolean not null default true,
  created_at timestamptz default now()
);

-- 2) BẢNG POSTS (bài SEO / tin tức)
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,                         -- markdown / html
  cover_url text,
  category text default 'tin-tuc',      -- 'tin-tuc' | 'kinh-nghiem' | 'seo'
  tags text[] default '{}',
  status text default 'draft',          -- 'draft' | 'published'
  meta_title text,
  meta_description text,
  author_id uuid references app_users(id),
  author_name text,
  views int default 0,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_posts_status on posts(status);
create index if not exists idx_posts_slug on posts(slug);

-- 3) BẢNG LEADS (đăng ký học + số từ vòng quay)
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text not null,
  course text,
  source text default 'form',           -- 'form' | 'lucky_wheel' | 'popup'
  prize text,                           -- phần trúng nếu từ vòng quay
  note text,
  status text default 'new',            -- 'new' | 'contacted' | 'won' | 'lost'
  sent_telegram boolean default false,
  created_at timestamptz default now()
);
create index if not exists idx_leads_status on leads(status);
create index if not exists idx_leads_created on leads(created_at desc);

-- 4) BẢNG SETTINGS (cấu hình: tỷ lệ vòng quay, banner, social...)
create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- Giá trị mặc định cho vòng quay (chỉnh tỷ lệ tại admin)
insert into site_settings(key, value) values
('wheel', '{
  "enabled": true,
  "segments": [
    {"label":"Giảm 500K","weight":18,"color":"#2563ff"},
    {"label":"Tặng nón BH","weight":14,"color":"#5b3df5"},
    {"label":"Giảm 300K","weight":18,"color":"#8b2fe6"},
    {"label":"Voucher 200K","weight":16,"color":"#ff5d73"},
    {"label":"Giảm 1 Triệu","weight":4,"color":"#ffb020"},
    {"label":"Tặng tài liệu","weight":14,"color":"#27e0a6"},
    {"label":"Giảm 800K","weight":12,"color":"#0ea5e9"},
    {"label":"May mắn lần sau","weight":4,"color":"#6b7191"}
  ]
}'::jsonb)
on conflict (key) do nothing;

insert into site_settings(key, value) values
('banners', '{
  "items": [
    {"text":"🎓 Lấy bằng trước Tết — đăng ký ngay hôm nay!","active":true},
    {"text":"💳 Học trước trả sau — chỉ 2.000.000đ giữ chỗ","active":true},
    {"text":"⚠️ Dự kiến BỎ thi mô phỏng — đăng ký sớm để hưởng chương trình cũ","active":true},
    {"text":"🏝️ Tặng nghỉ dưỡng Mũi Né 2N1Đ + Đông Trùng Hạ Thảo khi đăng ký B/C1","active":true}
  ]
}'::jsonb)
on conflict (key) do nothing;

insert into site_settings(key, value) values
('social', '{
  "facebook":"https://facebook.com/daylaixequyetthang",
  "youtube":"",
  "tiktok":"",
  "zalo":"https://zalo.me/0848751111",
  "phone":"0848751111"
}'::jsonb)
on conflict (key) do nothing;

-- 5) RLS: bật bảo mật. API server dùng service_role (bỏ qua RLS).
alter table app_users enable row level security;
alter table posts enable row level security;
alter table leads enable row level security;
alter table site_settings enable row level security;

-- Cho phép đọc công khai bài đã publish + settings (cho website)
create policy "public read published posts" on posts
  for select using (status = 'published');
create policy "public read settings" on site_settings
  for select using (true);

-- Lưu ý: thao tác admin (insert/update/delete) đi qua API route dùng
-- SUPABASE_SERVICE_ROLE_KEY nên không cần policy cho client.

-- ============================================================
-- TẠO TÀI KHOẢN ADMIN ĐẦU TIÊN
-- Chạy lệnh dưới SAU KHI đã đặt mật khẩu. Hash bcrypt tạo bằng:
--   node scripts/hash.js "MatKhauCuaBan"
-- rồi dán vào chỗ '<HASH>' bên dưới.
-- ============================================================
-- insert into app_users(email, password_hash, full_name, role) values
-- ('admin@quyetthang.vn', '<HASH>', 'Quản trị viên', 'admin');


-- ============================================================
-- MỞ RỘNG v2: Lịch khai giảng/thi · Tra cứu tiến độ · Đặt cọc · Chatbot
-- Chạy phần này nếu bạn đã chạy schema gốc trước đó.
-- ============================================================

-- 6) LỊCH KHAI GIẢNG & LỊCH THI
create table if not exists schedules (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'khai_giang',   -- 'khai_giang' | 'thi'
  course text not null,                        -- 'Hạng B', 'Hạng C1'...
  title text not null,
  start_date date not null,
  exam_date date,                              -- ngày thi dự kiến (nếu có)
  location text,
  slots int default 0,                         -- chỉ tiêu
  registered int default 0,                    -- đã đăng ký
  status text default 'open',                  -- 'open' | 'almost_full' | 'closed'
  note text,
  created_at timestamptz default now()
);
create index if not exists idx_sched_date on schedules(start_date);

-- 7) HỌC VIÊN (tra cứu tiến độ bằng CCCD/SĐT)
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  cccd text,                                   -- căn cước
  phone text,
  course text,
  schedule_id uuid references schedules(id),
  stage text default 'ho_so',                  -- ho_so|ly_thuyet|cabin|sa_hinh|duong_truong|cho_thi|hoan_thanh
  exam_date date,
  exam_result text,                            -- 'dau' | 'truot' | null
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_students_cccd on students(cccd);
create index if not exists idx_students_phone on students(phone);

-- 8) ĐĂNG KÝ + ĐẶT CỌC (online)
create table if not exists enrollments (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,                   -- mã đơn, VD QT-AB12CD
  full_name text not null,
  phone text not null,
  cccd text,
  course text not null,
  schedule_id uuid references schedules(id),
  deposit_amount int not null default 2000000,
  pay_status text default 'pending',           -- 'pending' | 'paid' | 'cancelled'
  pay_method text default 'vietqr',
  note text,
  created_at timestamptz default now(),
  paid_at timestamptz
);
create index if not exists idx_enroll_code on enrollments(code);
create index if not exists idx_enroll_status on enrollments(pay_status);

-- 9) CHATBOT — kho hỏi đáp (admin thêm/sửa được)
create table if not exists chatbot_qa (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  keywords text[] default '{}',                -- từ khóa để khớp câu hỏi
  category text default 'chung',
  priority int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Cấu hình thanh toán (VietQR) lưu trong site_settings
insert into site_settings(key, value) values
('payment', '{
  "bank_id": "970436",
  "bank_name": "Vietcombank",
  "account_no": "0123456789",
  "account_name": "TRUNG TAM DAO TAO LAI XE QUYET THANG",
  "deposit_default": 2000000,
  "template": "compact2"
}'::jsonb)
on conflict (key) do nothing;

-- RLS cho bảng mới
alter table schedules enable row level security;
alter table students enable row level security;
alter table enrollments enable row level security;
alter table chatbot_qa enable row level security;

-- Công khai: đọc lịch (open) + chatbot active. students/enrollments KHÔNG public (tra cứu qua API server).
create policy "public read schedules" on schedules for select using (true);
create policy "public read chatbot" on chatbot_qa for select using (is_active = true);

-- Dữ liệu mẫu lịch khai giảng
insert into schedules(kind, course, title, start_date, exam_date, location, slots, registered, status) values
('khai_giang','Hạng B','Khai giảng Hạng B khóa tháng tới','2026-07-05','2026-09-15','VP Phan Thiết - 291 Trần Hưng Đạo',40,28,'almost_full'),
('khai_giang','Hạng C1','Khai giảng Hạng C1','2026-07-12',null,'VP Phan Thiết - 291 Trần Hưng Đạo',30,9,'open'),
('khai_giang','Hạng B','Khai giảng Hạng B tại La Gi','2026-07-20','2026-09-28','VP La Gi - 280 Thống Nhất',35,5,'open'),
('thi','Hạng B','Kỳ thi sát hạch Hạng B','2026-07-25',null,'Trung tâm sát hạch Bình Thuận',60,0,'open')
on conflict do nothing;

-- Dữ liệu mẫu chatbot
insert into chatbot_qa(question, answer, keywords, category, priority) values
('Học phí hạng B bao nhiêu?','Học phí Hạng B trọn gói là 15.500.000đ (áp dụng cho cả số tự động và số cơ khí), học 2–2,5 tháng. Đã gồm xăng, xe, sân bãi, đường trường DAT và lệ phí thi tốt nghiệp.', array['học phí','giá','hạng b','bao nhiêu tiền','học phí b'],'hoc_phi',10),
('Học phí hạng C1?','Hạng C1 (xe tải dưới 3,5 tấn) học phí trọn gói 19.000.000đ, học 3–3,5 tháng.', array['c1','xe tải nhỏ','học phí c1'],'hoc_phi',9),
('Học bao lâu thì thi?','Hạng B học khoảng 2–2,5 tháng; Hạng C1 khoảng 3–3,5 tháng là thi tốt nghiệp. Lịch thi sát hạch do Bộ Công an sắp xếp.', array['bao lâu','mấy tháng','thời gian học','khi nào thi'],'thoi_gian',8),
('Trung tâm ở đâu?','Trung tâm có 3 văn phòng: 291 Trần Hưng Đạo (Phan Thiết); 280 Thống Nhất (La Gi); QL1A Phan Hiệp (Bắc Bình).', array['ở đâu','địa chỉ','văn phòng','chỗ nào'],'dia_chi',7),
('Có học trước trả sau không?','Có. Bạn đóng trước 2.000.000đ để giữ chỗ, đóng đủ 50% là vào khóa học. Trung tâm hỗ trợ chia nhỏ học phí.', array['trả góp','trả sau','trả trước','cọc','giữ chỗ','góp'],'thanh_toan',8),
('Cần giấy tờ gì để đăng ký?','Bạn cần: CMND/CCCD, ảnh thẻ, và giấy khám sức khỏe (trung tâm hỗ trợ hướng dẫn khám). Liên hệ 084 875 1111 để được hướng dẫn chi tiết.', array['giấy tờ','hồ sơ','thủ tục','cần gì','đăng ký'],'thu_tuc',6),
('Hotline số mấy?','Bạn gọi hoặc nhắn Zalo số 084 875 1111 để được tư vấn miễn phí nhé!', array['số điện thoại','hotline','liên hệ','zalo','gọi'],'lien_he',9)
on conflict do nothing;
