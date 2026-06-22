import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function getStats() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const sb = supabaseAdmin();
  const [leads, newLeads, posts, published] = await Promise.all([
    sb.from('leads').select('id', { count: 'exact', head: true }),
    sb.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    sb.from('posts').select('id', { count: 'exact', head: true }),
    sb.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
  ]);
  const recent = await sb.from('leads').select('*').order('created_at', { ascending: false }).limit(8);
  return {
    leads: leads.count || 0,
    newLeads: newLeads.count || 0,
    posts: posts.count || 0,
    published: published.count || 0,
    recent: recent.data || [],
  };
}

export default async function Dashboard() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  const stats = await getStats();

  return (
    <>
      <div className="adm-h"><h1>Tổng quan</h1><span style={{ color: 'var(--muted)' }}>Xin chào, {session.name} 👋</span></div>

      {!stats ? (
        <div className="adm-card">
          <b>⚠️ Chưa kết nối Supabase.</b>
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>Thêm biến môi trường Supabase vào <code>.env</code> rồi chạy <code>db/schema.sql</code> để xem số liệu thật. Xem hướng dẫn trong <code>docs/SETUP.md</code>.</p>
        </div>
      ) : (
        <>
          <div className="adm-stat-grid">
            <div className="adm-stat"><b>{stats.leads}</b><span>Tổng lead</span></div>
            <div className="adm-stat"><b>{stats.newLeads}</b><span>Lead mới chưa gọi</span></div>
            <div className="adm-stat"><b>{stats.published}</b><span>Bài đã đăng</span></div>
            <div className="adm-stat"><b>{stats.posts}</b><span>Tổng bài viết</span></div>
          </div>

          <div className="adm-card">
            <h3 style={{ marginBottom: 16 }}>Lead gần đây</h3>
            <table className="adm-table">
              <thead><tr><th>Họ tên</th><th>SĐT</th><th>Khóa</th><th>Nguồn</th><th>Thời gian</th></tr></thead>
              <tbody>
                {stats.recent.map((l) => (
                  <tr key={l.id}>
                    <td>{l.name || '—'}</td>
                    <td><b>{l.phone}</b></td>
                    <td>{l.course || l.prize || '—'}</td>
                    <td><span className="adm-pill new">{l.source}</span></td>
                    <td>{new Date(l.created_at).toLocaleString('vi-VN')}</td>
                  </tr>
                ))}
                {stats.recent.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)' }}>Chưa có lead nào.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
