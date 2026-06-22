import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import PostEditor from '../../new/PostEditor';

export const dynamic = 'force-dynamic';

export default async function EditPostPage({ params }) {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return <div className="adm-card"><b>⚠️ Chưa kết nối Supabase.</b><p style={{ color: 'var(--muted)', marginTop: 8 }}>Cần Supabase để sửa bài viết.</p></div>;
  }

  const sb = supabaseAdmin();
  const { data: post } = await sb.from('posts').select('*').eq('id', params.id).single();

  if (!post) {
    return <div className="adm-card"><b>Không tìm thấy bài viết này.</b><p style={{ marginTop: 8 }}><a href="/admin/posts" style={{ color: 'var(--blue)' }}>← Về danh sách bài viết</a></p></div>;
  }

  return <PostEditor initial={post} />;
}
