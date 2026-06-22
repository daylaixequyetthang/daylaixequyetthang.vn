import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireRole } from '@/lib/auth';

// Đổi trạng thái đơn cọc (paid/cancelled)
export async function POST(req) {
  const auth = await requireRole(['admin', 'editor']);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id, pay_status } = await req.json();
  if (!['pending', 'paid', 'cancelled'].includes(pay_status)) {
    return NextResponse.json({ error: 'Trạng thái không hợp lệ' }, { status: 400 });
  }
  const sb = supabaseAdmin();
  const update = { pay_status };
  if (pay_status === 'paid') update.paid_at = new Date().toISOString();
  await sb.from('enrollments').update(update).eq('id', id);
  return NextResponse.json({ ok: true });
}
