import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const STAGE_LABEL = {
  ho_so: 'Hồ sơ & khám sức khỏe',
  ly_thuyet: 'Học lý thuyết',
  cabin: 'Cabin mô phỏng',
  sa_hinh: 'Thực hành sa hình',
  duong_truong: 'Đường trường (DAT)',
  cho_thi: 'Chờ thi sát hạch',
  hoan_thanh: 'Hoàn thành — đã cấp bằng',
};
const STAGE_ORDER = ['ho_so', 'ly_thuyet', 'cabin', 'sa_hinh', 'duong_truong', 'cho_thi', 'hoan_thanh'];

// POST { q } — q là CCCD hoặc SĐT. Trả về tiến độ học viên + lịch thi.
export async function POST(req) {
  try {
    const { q } = await req.json();
    const key = String(q || '').replace(/\s+/g, '');
    if (key.length < 8) {
      return NextResponse.json({ ok: false, error: 'Vui lòng nhập CCCD hoặc số điện thoại hợp lệ.' }, { status: 400 });
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ ok: false, error: 'Hiện chưa tra cứu trực tuyến được. Vui lòng gọi 084 875 1111 để được hỗ trợ ngay.' }, { status: 503 });
    }

    const sb = supabaseAdmin();
    const { data: students } = await sb
      .from('students')
      .select('full_name,course,stage,exam_date,exam_result,note,schedule_id')
      .or(`cccd.eq.${key},phone.eq.${key}`)
      .limit(1);

    const student = students?.[0];
    if (!student) {
      return NextResponse.json({
        ok: true, found: false,
        message: 'Chưa tìm thấy hồ sơ với thông tin này. Có thể hồ sơ chưa được cập nhật lên hệ thống — vui lòng liên hệ 084 875 1111 để được hỗ trợ.',
      });
    }

    let schedule = null;
    if (student.schedule_id) {
      const { data: s } = await sb.from('schedules').select('title,start_date,exam_date,location').eq('id', student.schedule_id).single();
      schedule = s;
    }

    const idx = STAGE_ORDER.indexOf(student.stage);
    const progress = idx >= 0 ? Math.round(((idx + 1) / STAGE_ORDER.length) * 100) : 0;

    return NextResponse.json({
      ok: true, found: true,
      student: {
        name: maskName(student.full_name),
        course: student.course,
        stage: student.stage,
        stageLabel: STAGE_LABEL[student.stage] || student.stage,
        stageIndex: idx,
        stages: STAGE_ORDER.map((s) => ({ key: s, label: STAGE_LABEL[s] })),
        progress,
        examDate: student.exam_date || schedule?.exam_date || null,
        examResult: student.exam_result,
        note: student.note,
        schedule,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: 'Lỗi máy chủ' }, { status: 500 });
  }
}

// che bớt tên để bảo vệ riêng tư: "Nguyễn Văn An" -> "Nguyễn V. A."
function maskName(name) {
  const parts = String(name).trim().split(/\s+/);
  if (parts.length <= 1) return name;
  return parts.map((p, i) => (i === 0 ? p : p[0] + '.')).join(' ');
}
