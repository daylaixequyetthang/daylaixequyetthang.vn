import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendTelegram } from '@/lib/telegram';
import { sendZalo } from '@/lib/zalo';
import { buildVietQRUrl, genOrderCode } from '@/lib/vietqr';

// Cấu hình thanh toán mặc định (fallback khi chưa có Supabase).
const FALLBACK_PAY = {
  // STK thật của trung tâm. LƯU Ý: bank_id cần đúng mã ngân hàng (xem ghi chú dưới).
  bank_id: process.env.PAY_BANK_ID || '970418', // 970418 = BIDV (đoán theo STK 611x). Đổi nếu sai.
  bank_name: process.env.PAY_BANK_NAME || 'BIDV',
  account_no: process.env.PAY_ACCOUNT_NO || '6110370681',
  account_name: process.env.PAY_ACCOUNT_NAME || 'CONG TY CO PHAN TONG HOP QUYET THANG',
  deposit_default: 2000000,
  template: 'compact2',
};

async function getPaymentConfig(sb) {
  if (!sb) return FALLBACK_PAY;
  const { data } = await sb.from('site_settings').select('value').eq('key', 'payment').single();
  return data?.value || FALLBACK_PAY;
}

// POST: tạo đơn đăng ký + đặt cọc, trả về mã đơn + ảnh QR
export async function POST(req) {
  try {
    const body = await req.json();
    const phone = String(body.phone || '').replace(/\s+/g, '');
    const name = (body.full_name || '').trim();
    const course = (body.course || '').trim();
    const promo = (body.promo || '').trim(); // VD: "Voucher nghỉ dưỡng Mũi Né"
    const src = (body.source || 'form').trim();

    if (!name || name.length < 2) return NextResponse.json({ ok: false, error: 'Vui lòng nhập họ tên.' }, { status: 400 });
    if (!/^0\d{9,10}$/.test(phone)) return NextResponse.json({ ok: false, error: 'Số điện thoại không hợp lệ.' }, { status: 400 });
    if (!course) return NextResponse.json({ ok: false, error: 'Vui lòng chọn khóa học.' }, { status: 400 });

    const sb = process.env.SUPABASE_SERVICE_ROLE_KEY ? supabaseAdmin() : null;
    const pay = await getPaymentConfig(sb);
    const code = genOrderCode();
    const deposit = Number(body.deposit_amount) || pay.deposit_default || 2000000;
    const addInfo = `${code} ${phone}`;

    const qrUrl = buildVietQRUrl({
      bankId: pay.bank_id,
      accountNo: pay.account_no,
      accountName: pay.account_name,
      amount: deposit,
      addInfo,
      template: pay.template || 'compact2',
    });

    // Lưu đơn
    if (sb) {
      await sb.from('enrollments').insert({
        code, full_name: name, phone, cccd: body.cccd || null, course,
        schedule_id: body.schedule_id || null, deposit_amount: deposit,
        pay_status: 'pending', pay_method: 'vietqr', note: body.note || null,
      });
      // tăng số đăng ký của lịch
      if (body.schedule_id) {
        await sb.rpc('noop').catch(() => {}); // tránh lỗi nếu chưa có rpc
      }
      // lưu thành lead luôn
      await sb.from('leads').insert({ name, phone, course, source: 'form', note: `Đơn cọc ${code}` }).then(() => {}).catch(() => {});
    }

    // Báo Telegram + Zalo
    const noteMsg = `🧾 ĐƠN ĐẶT CỌC ${code} — cọc ${deposit.toLocaleString('vi-VN')}đ (chờ thanh toán)${promo ? `\n🎁 Ưu đãi: ${promo}` : ''}`;
    const notif = { name, phone, course, source: promo ? `${src} (${promo})` : src, note: noteMsg };
    await Promise.allSettled([sendTelegram(notif), sendZalo(notif)]);

    return NextResponse.json({
      ok: true,
      order: {
        code, deposit, addInfo,
        bank_name: pay.bank_name, account_no: pay.account_no, account_name: pay.account_name,
        qrUrl,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: 'Lỗi máy chủ, vui lòng thử lại.' }, { status: 500 });
  }
}
