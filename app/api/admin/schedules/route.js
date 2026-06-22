import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireRole } from '@/lib/auth';

export async function POST(req) {
  const auth = await requireRole(['admin', 'editor']);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const b = await req.json();
  const sb = supabaseAdmin();
  const row = {
    kind: b.kind === 'thi' ? 'thi' : 'khai_giang',
    course: b.course, title: b.title,
    start_date: b.start_date, exam_date: b.exam_date || null,
    location: b.location || null, slots: Number(b.slots) || 0,
    registered: Number(b.registered) || 0, status: b.status || 'open', note: b.note || null,
  };
  if (b.id) {
    const { error } = await sb.from('schedules').update(row).eq('id', b.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  } else {
    const { error } = await sb.from('schedules').insert(row);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req) {
  const auth = await requireRole(['admin']);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await req.json();
  const sb = supabaseAdmin();
  await sb.from('schedules').delete().eq('id', id);
  return NextResponse.json({ ok: true });
}
