'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PostsTable({ posts }) {
  const router = useRouter();
  const [list, setList] = useState(posts);
  const [busy, setBusy] = useState('');

  async function del(id, title) {
    if (!confirm(`Xóa bài "${title}"? Hành động này không thể hoàn tác.`)) return;
    setBusy(id);
    try {
      const r = await fetch(`/api/posts?id=${id}`, { method: 'DELETE' });
      const d = await r.json();
      if (d.ok) setList((l) => l.filter((p) => p.id !== id));
      else alert(d.error || 'Xóa thất bại');
    } catch { alert('Lỗi kết nối'); }
    setBusy('');
  }

  return (
    <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
      <table className="adm-table">
        <thead><tr><th>Tiêu đề</th><th>Chuyên mục</th><th>Trạng thái</th><th>Lượt xem</th><th style={{ textAlign: 'right' }}>Thao tác</th></tr></thead>
        <tbody>
          {list.map((p) => (
            <tr key={p.id}>
              <td><b>{p.title}</b></td>
              <td>{p.category}</td>
              <td><span className={`adm-pill ${p.status}`}>{p.status === 'published' ? 'Đã đăng' : 'Nháp'}</span></td>
              <td>{p.views || 0}</td>
              <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                {p.status === 'published' && (
                  <a href={`/tin-tuc/${p.slug}`} target="_blank" style={{ color: 'var(--muted)', fontWeight: 600, marginRight: 14 }}>Xem</a>
                )}
                <a href={`/admin/posts/${p.id}/edit`} style={{ color: 'var(--blue)', fontWeight: 700, marginRight: 14 }}>Sửa</a>
                <button onClick={() => del(p.id, p.title)} disabled={busy === p.id}
                  style={{ background: 'none', border: 0, color: '#d83a52', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: '.92rem' }}>
                  {busy === p.id ? '...' : 'Xóa'}
                </button>
              </td>
            </tr>
          ))}
          {list.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: 30 }}>Chưa có bài viết. Bấm "Viết bài mới" để bắt đầu.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
