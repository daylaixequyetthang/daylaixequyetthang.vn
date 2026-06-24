-- ============================================================
-- KIỂM TRA NHANH bảng sale_leads (chạy trong Supabase SQL Editor)
-- ============================================================

-- 1) Bảng sale_leads có tồn tại không? Cấu trúc cột ra sao?
select column_name, data_type
from information_schema.columns
where table_name = 'sale_leads'
order by ordinal_position;
-- Kỳ vọng thấy: record_id (text), owner_code (text), record (jsonb), updated_at (timestamptz)
-- Nếu KHÔNG có dòng nào -> bảng chưa tồn tại trong project này.

-- 2) Có bao nhiêu lead website đã ghi?
select count(*) as tong_lead_website
from sale_leads
where owner_code = 'WEBSITE';

-- 3) Xem 5 lead website mới nhất
select record_id, record->>'name' as ten, record->>'source' as nguon, updated_at
from sale_leads
where owner_code = 'WEBSITE'
order by updated_at desc
limit 5;

-- 4) Thử ghi 1 dòng test (xem có quyền ghi không)
insert into sale_leads (record_id, owner_code, record, updated_at)
values ('WEB-LEAD-TEST-0000', 'WEBSITE', '{"name":"Test ghi thử","source":"Website - Direct"}'::jsonb, now())
on conflict (record_id) do update set updated_at = now();
-- Nếu lệnh này CHẠY OK -> quyền ghi tốt. Nếu LỖI -> đọc thông báo lỗi.

-- 5) Xóa dòng test
delete from sale_leads where record_id = 'WEB-LEAD-TEST-0000';
