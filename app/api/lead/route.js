import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendTelegram } from '@/lib/telegram';
import { sendZalo } from '@/lib/zalo';
import { normalizePhone, buildSaleLeadRecord } from '@/lib/saleLead';

// Ghi lead website vào bảng CRM sale_leads (jsonb), chống trùng theo SĐT,
// và bắn thông báo Telegram + Zalo nhóm Sale (KHÔNG hiển thị SĐT khách).
export async function POST(req) {
  try {
    const body = await req.json();
    const phoneNorm = normalizePhone(body.phone);

    if (!/^0\d{9,10}$/.test(phoneNorm)) {
      return NextResponse.json({ ok: false, error: 'Số điện thoại không hợp lệ' }, { status: 400 });
    }

    const need = (body.course || body.need || '').slice(0, 120);
    const record = buildSaleLeadRecord({
      name: (body.name || '').slice(0, 120),
      phone: phoneNorm,
      need,
      area: (body.area || '').slice(0, 120),
      office: (body.office || '').slice(0, 80),
      note: (body.note || '').slice(0, 400),
      tracking: body.tracking || {},
    });

    let isNew = true;
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const sb = supabaseAdmin();
      const recordId = record.id; // WEB-LEAD-PHONE-xxxx

      // Chống trùng: kiểm tra đã có lead cùng SĐT chưa
      const { data: existing } = await sb
        .from('sale_leads')
        .select('record_id, record')
        .eq('record_id', recordId)
        .limit(1);

      if (existing && existing[0]) {
        // Đã có -> thêm 1 dòng history + cập nhật nguồn mới, KHÔNG tạo mới
        isNew = false;
        const old = existing[0].record || {};
        const merged = {
          ...old,
          source: record.source,
          trafficType: record.trafficType,
          lastContact: record.lastContact,
          history: [
            ...(Array.isArray(old.history) ? old.history : []),
            { date: record.syncedAt, userId: 'WEBSITE', status: old.status || 'Mới', note: 'Khách gửi form lại từ website' },
          ],
        };
        await sb.from('sale_leads').update({ record: merged, updated_at: record.syncedAt }).eq('record_id', recordId);
      } else {
        // Tạo lead mới
        await sb.from('sale_leads').insert({
          record_id: recordId,
          owner_code: 'WEBSITE',
          record,
          updated_at: record.syncedAt,
        });
      }
    }

    // Thông báo nhóm Sale — KHÔNG hiển thị SĐT (theo đặc tả)
    const notif = {
      name: record.name,
      need: record.need,
      area: record.area,
      office: record.office,
      sourceLabel: record.source,
      campaign: record.campaign,
      adName: record.adName,
      hidePhone: true,
    };
    await Promise.allSettled([sendTelegram(notif), sendZalo(notif)]);

    return NextResponse.json({ ok: true, isNew });
  } catch (e) {
    console.error('lead error:', e);
    return NextResponse.json({ ok: false, error: 'Lỗi máy chủ' }, { status: 500 });
  }
}
