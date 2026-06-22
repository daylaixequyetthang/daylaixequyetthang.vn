import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import PostsTable from './PostsTable';

export const dynamic = 'force-dynamic';

export default async function PostsPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  let posts = [];
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const sb = supabaseAdmin();
    const { data } = await sb.from('posts').select('*').order('created_at', { ascending: false });
    posts = data || [];
  }

  return (
    <>
      <div className="adm-h">
        <h1>Bài viết SEO / Tin tức</h1>
        <a href="/admin/posts/new" className="btn btn-cta" style={{ padding: '11px 20px' }}>+ Viết bài mới</a>
      </div>

      {!process.env.SUPABASE_SERVICE_ROLE_KEY ? (
        <div className="adm-card"><b>⚠️ Chưa kết nối Supabase.</b><p style={{ color: 'var(--muted)', marginTop: 8 }}>Cần Supabase để lưu bài viết.</p></div>
      ) : (
        <PostsTable posts={posts} />
      )}
    </>
  );
}
