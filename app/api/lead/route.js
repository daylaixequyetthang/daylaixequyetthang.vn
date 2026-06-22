import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendTelegram } from '@/lib/telegram';
import { sendZalo } from '@/lib/zalo';

export async function POST(req) {
  try {
    const body = await req.json();
    const phone = String(body.phone || '').replace(/\s+/g, '');

    // validate SĐT VN
    if (!/^0\d{9,10}$/.test(phone)) {
      return NextResponse.json({ ok: false, error: 'Số điện thoại không hợp lệ' }, { status: 400 });
    }

    const lead = {
      name: body.name?.slice(0, 120) || null,
      phone,
      course: body.course?.slice(0, 120) || null,
      source: ['form', 'lucky_wheel', 'popup', 'landing_voucher'].includes(body.source) ? body.source : 'form',
      prize: body.prize?.slice(0, 80) || null,
      note: body.note?.slice(0, 300) || null,
    };

    // 1) lưu DB (nếu đã cấu hình Supabase)
    let saved = null;
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const sb = supabaseAdmin();
      const { data } = await sb.from('leads').insert(lead).select().single();
      saved = data;
    }

    // 2) bắn Telegram + Zalo
    const [tg] = await Promise.all([sendTelegram(lead), sendZalo(lead)]);
    if (saved && tg.ok && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      await supabaseAdmin().from('leads').update({ sent_telegram: true }).eq('id', saved.id);
    }

    return NextResponse.json({ ok: true, telegram: tg.ok });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: 'Lỗi máy chủ' }, { status: 500 });
  }
}
