import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { createSession } from '@/lib/auth';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ ok: false, error: 'Thiếu email hoặc mật khẩu' }, { status: 400 });
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ ok: false, error: 'Server chưa cấu hình Supabase' }, { status: 500 });
    }

    const sb = supabaseAdmin();
    const { data: user } = await sb
      .from('app_users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .eq('is_active', true)
      .single();

    if (!user) {
      return NextResponse.json({ ok: false, error: 'Sai tài khoản hoặc mật khẩu' }, { status: 401 });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return NextResponse.json({ ok: false, error: 'Sai tài khoản hoặc mật khẩu' }, { status: 401 });
    }

    await createSession(user);
    return NextResponse.json({ ok: true, role: user.role, name: user.full_name });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: 'Lỗi máy chủ' }, { status: 500 });
  }
}
