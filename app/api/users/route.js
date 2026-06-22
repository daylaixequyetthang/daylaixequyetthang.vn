import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { requireRole } from '@/lib/auth';

// GET: danh sách user (chỉ admin)
export async function GET() {
  const auth = await requireRole(['admin']);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const sb = supabaseAdmin();
  const { data } = await sb.from('app_users').select('id,email,full_name,role,is_active,created_at').order('created_at');
  return NextResponse.json({ users: data || [] });
}

// POST: tạo tài khoản con (chỉ admin)
export async function POST(req) {
  const auth = await requireRole(['admin']);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { email, password, full_name, role } = await req.json();
  if (!email || !password || !full_name) {
    return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Mật khẩu tối thiểu 6 ký tự' }, { status: 400 });
  }
  const hash = await bcrypt.hash(password, 10);
  const sb = supabaseAdmin();
  const { error } = await sb.from('app_users').insert({
    email: email.toLowerCase().trim(),
    password_hash: hash,
    full_name,
    role: role === 'admin' ? 'admin' : 'editor',
  });
  if (error) {
    const msg = error.message.includes('duplicate') ? 'Email đã tồn tại' : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

// PATCH: bật/tắt tài khoản
export async function PATCH(req) {
  const auth = await requireRole(['admin']);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id, is_active } = await req.json();
  const sb = supabaseAdmin();
  await sb.from('app_users').update({ is_active }).eq('id', id);
  return NextResponse.json({ ok: true });
}
