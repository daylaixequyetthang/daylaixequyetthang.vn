import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireRole, getSession } from '@/lib/auth';

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-').slice(0, 80);
}

// Danh sách bài (admin xem mọi trạng thái)
export async function GET() {
  const auth = await requireRole(['admin', 'editor']);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const sb = supabaseAdmin();
  const { data } = await sb.from('posts').select('*').order('created_at', { ascending: false });
  return NextResponse.json({ posts: data || [] });
}

// Tạo bài mới
export async function POST(req) {
  const auth = await requireRole(['admin', 'editor']);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const s = await getSession();
  const body = await req.json();

  const slug = slugify(body.slug || body.title || '') + '-' + Date.now().toString(36).slice(-4);
  const post = {
    title: body.title,
    slug,
    excerpt: body.excerpt || null,
    content: body.content || '',
    cover_url: body.cover_url || null,
    category: body.category || 'tin-tuc',
    tags: body.tags || [],
    status: body.status === 'published' ? 'published' : 'draft',
    meta_title: body.meta_title || body.title,
    meta_description: body.meta_description || body.excerpt || null,
    author_id: s.sub,
    author_name: s.name,
    published_at: body.status === 'published' ? new Date().toISOString() : null,
  };
  const sb = supabaseAdmin();
  const { data, error } = await sb.from('posts').insert(post).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, post: data });
}
