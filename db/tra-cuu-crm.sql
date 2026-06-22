-- ============================================================
-- CẤP QUYỀN TRA CỨU TỪ 2 BẢNG CRM CÓ SẴN
-- Chạy trong Supabase > SQL Editor.
-- Website chỉ ĐỌC, chỉ các cột cần thiết. KHÔNG đụng học phí/công nợ.
-- ============================================================

-- API dùng SUPABASE_SERVICE_ROLE_KEY (phía server) nên bỏ qua RLS,
-- đọc trực tiếp được crm_students + crm_enrollments mà KHÔNG cần policy.
-- => Nếu 2 bảng đã tồn tại trong cùng project Supabase, KHÔNG cần chạy gì thêm.

-- (TÙY CHỌN) Tạo index để tra cứu nhanh theo SĐT/CCCD:
create index if not exists idx_crm_students_phone on crm_students (phone_normalized);
create index if not exists idx_crm_students_cccd  on crm_students (cccd_raw);
create index if not exists idx_crm_enroll_student on crm_enrollments (student_id);

-- (TÙY CHỌN - AN TOÀN HƠN) Tạo VIEW chỉ phơi bày đúng cột cần,
-- để chắc chắn website không bao giờ chạm tới học phí/công nợ.
-- Nếu muốn dùng view này, đổi tên bảng trong app/api/lookup/route.js
-- từ 'crm_students'/'crm_enrollments' sang view tương ứng.
create or replace view v_tra_cuu_students as
  select student_id, full_name, phone_raw, phone_normalized, cccd_raw
  from crm_students;

create or replace view v_tra_cuu_enrollments as
  select enrollment_id, student_id, license_type, course_name,
         course_opening_date, course_joined_date, registration_date,
         training_status, crm_status
  from crm_enrollments;
