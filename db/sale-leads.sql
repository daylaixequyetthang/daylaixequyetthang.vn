-- ============================================================
-- BẢNG sale_leads — lead website ghi chung vào CRM
-- (Theo tài liệu "Cơ chế ghi Lead từ website vào Supabase CRM")
-- Nếu bảng đã tồn tại trong CRM của bạn, KHÔNG cần chạy lại.
-- ============================================================
create table if not exists sale_leads (
  record_id   text primary key,
  owner_code  text,
  record      jsonb,
  updated_at  timestamptz default now()
);
create index if not exists idx_sale_leads_updated on sale_leads (updated_at desc);

-- (Tuy chon) bang luu lich su message form website
create table if not exists sale_messages (
  record_id   text primary key,
  owner_code  text,
  record      jsonb,
  updated_at  timestamptz default now()
);

-- Website dung SERVICE_ROLE_KEY (server) nen bo qua RLS - ghi duoc ngay.
-- KHONG de frontend ghi truc tiep; moi ghi deu qua /api/lead (backend).
