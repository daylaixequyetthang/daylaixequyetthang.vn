import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';

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
        <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="adm-table">
            <thead><tr><th>Tiêu đề</th><th>Chuyên mục</th><th>Tác giả</th><th>Trạng thái</th><th>Lượt xem</th><th></th></tr></thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td><b>{p.title}</b></td>
                  <td>{p.category}</td>
                  <td>{p.author_name}</td>
                  <td><span className={`adm-pill ${p.status}`}>{p.status === 'published' ? 'Đã đăng' : 'Nháp'}</span></td>
                  <td>{p.views || 0}</td>
                  <td>
                    {p.status === 'published' && <a href={`/tin-tuc/${p.slug}`} target="_blank" style={{ color: 'var(--blue)', fontWeight: 600 }}>Xem →</a>}
                  </td>
                </tr>
              ))}
              {posts.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: 30 }}>Chưa có bài viết. Bấm "Viết bài mới" để bắt đầu.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
