import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// ============================================================
// TRA CỨU KHÓA HỌC — dùng 2 bảng CRM:
//   crm_students     (student_id, full_name, phone_raw, phone_normalized, cccd_raw)
//   crm_enrollments  (enrollment_id, student_id, license_type, course_name,
//                     course_opening_date, course_joined_date, registration_date,
//                     training_status, crm_status)
// Join: crm_students.student_id = crm_enrollments.student_id
// Input: SĐT -> so với phone_normalized | CCCD -> so với cccd_raw (đã bỏ ký tự không phải số)
// KHÔNG lấy: học phí, công nợ, payment_status, tuition_total, amount_paid_old, debt...
// ============================================================

// Chuẩn hóa SĐT VN về dạng phone_normalized (bỏ khoảng trắng, +84 -> 0).
function normalizePhone(s) {
  let p = String(s || '').replace(/[^\d+]/g, '');
  if (p.startsWith('+84')) p = '0' + p.slice(3);
  else if (p.startsWith('84') && p.length >= 11) p = '0' + p.slice(2);
  return p.replace(/\D/g, '');
}
// Chỉ giữ số (dùng cho CCCD).
function digitsOnly(s) {
  return String(s || '').replace(/\D/g, '');
}

export async function POST(req) {
  try {
    const { q } = await req.json();
    const raw = String(q || '').trim();
    const digits = digitsOnly(raw);

    if (digits.length < 8) {
      return NextResponse.json(
        { ok: false, error: 'Vui lòng nhập số điện thoại hoặc CCCD hợp lệ.' },
        { status: 400 }
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { ok: false, error: 'Hiện chưa tra cứu trực tuyến được. Vui lòng gọi 084 875 1111 để được hỗ trợ ngay.' },
        { status: 503 }
      );
    }

    const sb = supabaseAdmin();

    // Đoán đầu vào: 9-11 số dạng SĐT, hoặc 12 số dạng CCCD. Thử cả 2 để chắc chắn.
    const phone = normalizePhone(raw);
    const conditions = [];
    if (phone.length >= 9 && phone.length <= 11) conditions.push(`phone_normalized.eq.${phone}`);
    // CCCD: so khớp theo chuỗi số (cccd_raw có thể chứa ký tự, ta so cả raw lẫn digits)
    conditions.push(`cccd_raw.eq.${raw}`);
    if (digits !== raw) conditions.push(`cccd_raw.eq.${digits}`);

    const { data: students, error: sErr } = await sb
      .from('crm_students')
      .select('student_id, full_name, phone_raw, phone_normalized, cccd_raw')
      .or(conditions.join(','))
      .limit(1);

    if (sErr) {
      console.error('crm_students error:', sErr);
      return NextResponse.json({ ok: false, error: 'Lỗi truy vấn dữ liệu.' }, { status: 500 });
    }

    const student = students?.[0];
    if (!student) {
      return NextResponse.json({
        ok: true,
        found: false,
        message:
          'Chưa tìm thấy hồ sơ với thông tin này. Có thể hồ sơ chưa được cập nhật lên hệ thống — vui lòng liên hệ 084 875 1111 để được hỗ trợ.',
      });
    }

    // Lấy hồ sơ đăng ký (khóa học) mới nhất của học viên
    const { data: enrolls } = await sb
      .from('crm_enrollments')
      .select('enrollment_id, license_type, course_name, course_opening_date, course_joined_date, registration_date, training_status, crm_status')
      .eq('student_id', student.student_id)
      .order('registration_date', { ascending: false })
      .limit(1);

    const enroll = enrolls?.[0] || null;

    // Ngày khóa: ưu tiên joined -> opening -> registration
    const courseDate =
      enroll?.course_joined_date || enroll?.course_opening_date || enroll?.registration_date || null;

    return NextResponse.json({
      ok: true,
      found: true,
      student: {
        name: maskName(student.full_name),
        phone: student.phone_raw || student.phone_normalized || null,
        cccd: maskCccd(student.cccd_raw),
        licenseType: enroll?.license_type || null,
        courseName: enroll?.course_name || null,
        courseDate,
        trainingStatus: enroll?.training_status || null,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: 'Lỗi máy chủ' }, { status: 500 });
  }
}

// Che bớt tên để bảo vệ riêng tư: "Nguyễn Văn An" -> "Nguyễn V. A."
function maskName(name) {
  const parts = String(name || '').trim().split(/\s+/);
  if (parts.length <= 1) return name;
  return parts.map((p, i) => (i === 0 ? p : (p[0] || '') + '.')).join(' ');
}
// Che bớt CCCD: chỉ hiện 4 số cuối -> "********1234"
function maskCccd(cccd) {
  const d = String(cccd || '').replace(/\D/g, '');
  if (d.length < 4) return cccd || null;
  return '*'.repeat(Math.max(0, d.length - 4)) + d.slice(-4);
}
