import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireRole } from '@/lib/auth';

export async function POST(req) {
  const auth = await requireRole(['admin', 'editor']);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id, status } = await req.json();
  if (!['new', 'contacted', 'won', 'lost'].includes(status)) {
    return NextResponse.json({ error: 'Trạng thái không hợp lệ' }, { status: 400 });
  }
  const sb = supabaseAdmin();
  await sb.from('leads').update({ status }).eq('id', id);
  return NextResponse.json({ ok: true });
}
