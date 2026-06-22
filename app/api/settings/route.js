import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireRole } from '@/lib/auth';

// GET ?key=wheel  -> đọc 1 setting (cần đăng nhập)
export async function GET(req) {
  const auth = await requireRole(['admin', 'editor']);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const key = new URL(req.url).searchParams.get('key');
  const sb = supabaseAdmin();
  const { data } = await sb.from('site_settings').select('value').eq('key', key).single();
  return NextResponse.json({ value: data?.value || null });
}

// POST { key, value } -> lưu (chỉ admin)
export async function POST(req) {
  const auth = await requireRole(['admin']);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { key, value } = await req.json();
  if (!['wheel', 'banners', 'social'].includes(key)) {
    return NextResponse.json({ error: 'Key không hợp lệ' }, { status: 400 });
  }
  const sb = supabaseAdmin();
  const { error } = await sb
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
