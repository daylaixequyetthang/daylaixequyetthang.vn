import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireRole } from '@/lib/auth';

const ALLOWED = ['Mới', 'Đã gọi', 'Đang tư vấn', 'Đã chốt', 'Không liên hệ được'];

// Cập nhật trạng thái lead trong sale_leads (record jsonb) + ghi history.
export async function POST(req) {
  const auth = await requireRole(['admin', 'editor']);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id, status } = await req.json(); // id = record_id
  if (!ALLOWED.includes(status)) {
    return NextResponse.json({ error: 'Trạng thái không hợp lệ' }, { status: 400 });
  }

  const sb = supabaseAdmin();
  const { data: row } = await sb.from('sale_leads').select('record').eq('record_id', id).single();
  if (!row) return NextResponse.json({ error: 'Không tìm thấy lead' }, { status: 404 });

  const nowISO = new Date().toISOString();
  const rec = row.record || {};
  const updated = {
    ...rec,
    status,
    lastContact: nowISO.slice(0, 10),
    history: [
      ...(Array.isArray(rec.history) ? rec.history : []),
      { date: nowISO, userId: auth.user?.email || 'admin', status, note: `Cập nhật trạng thái: ${status}` },
    ],
  };
  await sb.from('sale_leads').update({ record: updated, updated_at: nowISO }).eq('record_id', id);
  return NextResponse.json({ ok: true });
}
