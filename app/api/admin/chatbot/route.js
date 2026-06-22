import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireRole } from '@/lib/auth';

export async function POST(req) {
  const auth = await requireRole(['admin', 'editor']);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const b = await req.json();
  const sb = supabaseAdmin();
  const keywords = Array.isArray(b.keywords)
    ? b.keywords
    : String(b.keywords || '').split(',').map((k) => k.trim().toLowerCase()).filter(Boolean);
  const row = {
    question: b.question, answer: b.answer, keywords,
    category: b.category || 'chung', priority: Number(b.priority) || 0,
    is_active: b.is_active !== false,
  };
  if (b.id) {
    const { error } = await sb.from('chatbot_qa').update(row).eq('id', b.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  } else {
    const { error } = await sb.from('chatbot_qa').insert(row);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req) {
  const auth = await requireRole(['admin']);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await req.json();
  await supabaseAdmin().from('chatbot_qa').delete().eq('id', id);
  return NextResponse.json({ ok: true });
}
