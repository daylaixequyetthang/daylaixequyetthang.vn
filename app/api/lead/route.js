import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendTelegram } from '@/lib/telegram';
import { sendZalo } from '@/lib/zalo';
import { normalizePhone, buildSaleLeadRecord } from '@/lib/saleLead';

// Ghi lead website vào CRM sale_leads (jsonb), chống trùng theo SĐT,
// bắn Telegram + Zalo nhóm Sale (ẩn SĐT). Lỗi DB KHÔNG chặn việc bắn thông báo.
export async function POST(req) {
  let record = null;
  try {
    const body = await req.json();
    const phoneNorm = normalizePhone(body.phone);

    if (!/^0\d{9,10}$/.test(phoneNorm)) {
      return NextResponse.json({ ok: false, error: 'Số điện thoại không hợp lệ' }, { status: 400 });
    }

    const need = (body.course || body.need || '').slice(0, 120);
    record = buildSaleLeadRecord({
      name: (body.name || '').slice(0, 120),
      phone: phoneNorm,
      need,
      area: (body.area || '').slice(0, 120),
      office: (body.office || '').slice(0, 80),
      note: (body.note || '').slice(0, 400),
      tracking: body.tracking || {},
    });
  } catch (e) {
    console.error('lead parse error:', e);
    return NextResponse.json({ ok: false, error: 'Dữ liệu không hợp lệ' }, { status: 400 });
  }

  // 1) GHI DB — bọc riêng, lỗi ở đây KHÔNG chặn thông báo
  let dbOk = false, dbError = null, isNew = true;
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const sb = supabaseAdmin();
      const recordId = record.id;
      const { data: existing, error: selErr } = await sb
        .from('sale_leads').select('record_id, record').eq('record_id', recordId).limit(1);
      if (selErr) throw selErr;

      if (existing && existing[0]) {
        isNew = false;
        const old = existing[0].record || {};
        const merged = {
          ...old,
          source: record.source, trafficType: record.trafficType, lastContact: record.lastContact,
          history: [
            ...(Array.isArray(old.history) ? old.history : []),
            { date: record.syncedAt, userId: 'WEBSITE', status: old.status || 'Mới', note: 'Khách gửi form lại từ website' },
          ],
        };
        const { error } = await sb.from('sale_leads').update({ record: merged, updated_at: record.syncedAt }).eq('record_id', recordId);
        if (error) throw error;
      } else {
        const { error } = await sb.from('sale_leads').insert({
          record_id: recordId, owner_code: 'WEBSITE', record, updated_at: record.syncedAt,
        });
        if (error) throw error;
      }
      dbOk = true;
    } catch (e) {
      dbError = e?.message || String(e);
      console.error('sale_leads write error:', dbError);
    }
  }

  // 2) THÔNG BÁO — luôn chạy, kể cả khi DB lỗi
  const notif = {
    name: record.name, need: record.need, area: record.area, office: record.office,
    sourceLabel: record.source, campaign: record.campaign, adName: record.adName, hidePhone: true,
  };
  const [tg, zl] = await Promise.allSettled([sendTelegram(notif), sendZalo(notif)]);

  // Luôn trả ok cho khách (form thành công với họ), kèm cờ debug cho mình
  return NextResponse.json({
    ok: true,
    isNew,
    saved: dbOk,
    notified: { telegram: tg.value?.ok || false, zalo: zl.value?.ok || false },
    ...(dbError ? { dbError } : {}),
  });
}
