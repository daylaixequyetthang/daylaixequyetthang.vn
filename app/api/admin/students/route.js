import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireRole } from '@/lib/auth';

export async function POST(req) {
  const auth = await requireRole(['admin', 'editor']);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const b = await req.json();
  const sb = supabaseAdmin();
  const row = {
    full_name: b.full_name, cccd: b.cccd || null, phone: b.phone || null,
    course: b.course || null, schedule_id: b.schedule_id || null,
    stage: b.stage || 'ho_so', exam_date: b.exam_date || null,
    exam_result: b.exam_result || null, note: b.note || null,
    updated_at: new Date().toISOString(),
  };
  if (b.id) {
    const { error } = await sb.from('students').update(row).eq('id', b.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  } else {
    const { error } = await sb.from('students').insert(row);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req) {
  const auth = await requireRole(['admin']);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await req.json();
  await supabaseAdmin().from('students').delete().eq('id', id);
  return NextResponse.json({ ok: true });
}
