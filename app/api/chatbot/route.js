import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Kho QA mặc định (offline) — dùng khi chưa kết nối Supabase.
const FALLBACK_QA = [
  { answer: 'Học phí Hạng B trọn gói 15.500.000đ (áp dụng cả số tự động & số cơ khí), học 2–2,5 tháng. Đã gồm xăng, xe, sân bãi, đường trường DAT và lệ phí thi tốt nghiệp, cam kết không phát sinh.', keywords: ['học phí', 'giá', 'hạng b', 'bao nhiêu', 'tiền', 'phí b'], priority: 10 },
  { answer: 'Hạng C1 (xe tải dưới 3,5 tấn) trọn gói 19.000.000đ, học 3–3,5 tháng. Hạng C (xe tải trên 3,5 tấn) vui lòng liên hệ 084 875 1111 để được báo giá.', keywords: ['c1', 'hạng c', 'xe tải', 'phí c'], priority: 9 },
  { answer: 'Hạng A1 (xe máy) lệ phí 250.000đ/hồ sơ, thi tại Phan Thiết. Hạng A (mô tô phân khối lớn) vui lòng liên hệ 084 875 1111 để được tư vấn.', keywords: ['a1', 'hạng a', 'xe máy', 'mô tô', 'moto'], priority: 8 },
  { answer: 'Hạng B học 2–2,5 tháng; C1 khoảng 3–3,5 tháng là thi tốt nghiệp. Lịch thi sát hạch do Bộ Công an sắp xếp. Bạn xem lịch khai giảng cụ thể tại mục "Tra cứu lịch" trên web nhé.', keywords: ['bao lâu', 'mấy tháng', 'thời gian', 'khi nào thi', 'học mất'], priority: 8 },
  { answer: 'Trung tâm có nhiều văn phòng ghi danh. Một số văn phòng chính: 291 Trần Hưng Đạo (Phan Thiết); 280 Thống Nhất (La Gi); QL1A Phan Hiệp (Bắc Bình). Bạn ghé văn phòng gần nhất, hoặc đăng ký online — gọi 084 875 1111 để được tư vấn nhé.', keywords: ['ở đâu', 'địa chỉ', 'văn phòng', 'chỗ nào', 'khu vực'], priority: 7 },
  { answer: 'Có! Bạn đóng trước 2.000.000đ để giữ chỗ, đóng đủ 50% là vào khóa học, phần còn lại chia nhỏ nhiều lần. Bạn có thể đặt cọc online ngay tại mục "Đăng ký" trên web.', keywords: ['trả góp', 'trả sau', 'cọc', 'giữ chỗ', 'góp', 'trả trước', 'đặt cọc'], priority: 9 },
  { answer: 'Hồ sơ cần: CMND/CCCD, ảnh thẻ và giấy khám sức khỏe (trung tâm hướng dẫn khám). Bạn chỉ cần mang CCCD đến, các bước còn lại trung tâm hỗ trợ trọn gói.', keywords: ['giấy tờ', 'hồ sơ', 'thủ tục', 'cần gì', 'chuẩn bị', 'đăng ký'], priority: 6 },
  { answer: 'Bạn gọi hoặc nhắn Zalo 084 875 1111 để được tư vấn miễn phí, hoặc nhắn Messenger Facebook của trung tâm. Đội tư vấn hỗ trợ cả ngoài giờ hành chính.', keywords: ['số', 'hotline', 'liên hệ', 'zalo', 'gọi', 'messenger', 'tư vấn'], priority: 9 },
  { answer: 'Bạn có thể tra cứu lịch khai giảng, lịch thi và tiến độ học bằng CCCD hoặc số điện thoại tại mục "Tra cứu lịch" trên web. Lịch khai giảng cập nhật hàng tháng.', keywords: ['lịch', 'khai giảng', 'tra cứu', 'tiến độ', 'lịch thi', 'khi nào khai giảng'], priority: 8 },
  { answer: 'Thi xong khoảng 2–3 ngày là bằng đã cập nhật trên ứng dụng VNeTraffic để bạn sử dụng. Bằng cứng sẽ gửi sau theo lịch in phôi của cơ quan công an.', keywords: ['bao lâu có bằng', 'nhận bằng', 'lấy bằng', 'vneTraffic', 'có bằng'], priority: 7 },
  { answer: 'Trung tâm có khóa nâng hạng: nâng B/C1 lên C (10.500.000đ), nâng B lên D2 (11.500.000đ). Liên hệ 084 875 1111 để được tư vấn lộ trình phù hợp.', keywords: ['nâng hạng', 'nâng bằng', 'lên c', 'lên d', 'd2'], priority: 6 },
];

function scoreMatch(text, keywords) {
  const t = text.toLowerCase();
  let score = 0;
  for (const k of keywords || []) {
    if (t.includes(String(k).toLowerCase())) score += 1;
  }
  return score;
}

export async function POST(req) {
  try {
    const { message } = await req.json();
    const text = String(message || '').toLowerCase().trim();
    if (!text) return NextResponse.json({ ok: true, answer: 'Bạn cần hỏi gì về khóa học, học phí hay lịch khai giảng ạ?' });

    let qaList = FALLBACK_QA;
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const sb = supabaseAdmin();
      const { data } = await sb.from('chatbot_qa').select('answer,keywords,priority').eq('is_active', true);
      if (data && data.length) qaList = data;
    }

    let best = null, bestScore = 0;
    for (const qa of qaList) {
      const s = scoreMatch(text, qa.keywords) * 10 + (qa.priority || 0) * 0.1;
      const kwHit = scoreMatch(text, qa.keywords);
      if (kwHit > 0 && s > bestScore) { bestScore = s; best = qa; }
    }

    if (best) {
      return NextResponse.json({ ok: true, answer: best.answer, matched: true });
    }

    // không khớp → câu trả lời mặc định + gợi ý
    return NextResponse.json({
      ok: true, matched: false,
      answer: 'Câu hỏi này mình chưa có sẵn câu trả lời. Bạn để lại số điện thoại hoặc gọi 084 875 1111, đội tư vấn sẽ hỗ trợ ngay nhé! Bạn cũng có thể hỏi về: học phí, thời gian học, địa chỉ, thủ tục hồ sơ, lịch khai giảng.',
      suggestions: ['Học phí hạng B?', 'Học bao lâu thì thi?', 'Trung tâm ở đâu?', 'Thủ tục đăng ký?'],
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Lỗi máy chủ' }, { status: 500 });
  }
}
