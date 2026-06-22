'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PostEditor() {
  const router = useRouter();
  const [f, setF] = useState({
    title: '', excerpt: '', content: '', cover_url: '',
    category: 'tin-tuc', meta_title: '', meta_description: '',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const up = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  async function save(status) {
    if (!f.title.trim()) { setErr('Vui lòng nhập tiêu đề.'); return; }
    setErr(''); setSaving(true);
    try {
      const r = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, status }),
      });
      const d = await r.json();
      if (d.ok) router.push('/admin/posts');
      else setErr(d.error || 'Lưu thất bại');
    } catch { setErr('Lỗi kết nối'); }
    setSaving(false);
  }

  return (
    <>
      <div className="adm-h">
        <h1>Viết bài mới</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn" style={{ padding: '11px 18px', background: '#fff', border: '1.5px solid var(--line)', color: 'var(--ink-soft)' }} onClick={() => save('draft')} disabled={saving}>Lưu nháp</button>
          <button className="btn btn-cta" style={{ padding: '11px 20px' }} onClick={() => save('published')} disabled={saving}>{saving ? 'Đang lưu...' : 'Đăng bài'}</button>
        </div>
      </div>

      {err && <div className="login-err" style={{ marginBottom: 16 }}>{err}</div>}

      <div className="adm-row" style={{ alignItems: 'flex-start' }}>
        <div style={{ flex: 2 }}>
          <div className="adm-card">
            <label className="adm-label">Tiêu đề</label>
            <input className="adm-input" value={f.title} onChange={up('title')} placeholder="VD: 5 mẹo thi đậu lý thuyết GPLX ngay lần đầu" />
            <label className="adm-label">Mô tả ngắn (excerpt)</label>
            <input className="adm-input" value={f.excerpt} onChange={up('excerpt')} placeholder="Tóm tắt hiển thị ở danh sách bài viết" />
            <label className="adm-label">Nội dung (hỗ trợ HTML hoặc markdown nhẹ: ## tiêu đề, **in đậm**)</label>
            <textarea className="adm-textarea" value={f.content} onChange={up('content')} placeholder="Viết nội dung bài tại đây..." />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div className="adm-card">
            <label className="adm-label">Chuyên mục</label>
            <select className="adm-select" value={f.category} onChange={up('category')}>
              <option value="tin-tuc">Tin tức</option>
              <option value="kinh-nghiem">Kinh nghiệm</option>
              <option value="luat-moi">Luật mới</option>
              <option value="seo">Bài SEO</option>
            </select>
            <label className="adm-label">Ảnh bìa (URL)</label>
            <input className="adm-input" value={f.cover_url} onChange={up('cover_url')} placeholder="https://..." />
          </div>
          <div className="adm-card">
            <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>SEO</h3>
            <label className="adm-label">Meta title</label>
            <input className="adm-input" value={f.meta_title} onChange={up('meta_title')} placeholder="Để trống = dùng tiêu đề" />
            <label className="adm-label">Meta description</label>
            <textarea className="adm-textarea" style={{ minHeight: 90 }} value={f.meta_description} onChange={up('meta_description')} placeholder="Mô tả cho Google (~155 ký tự)" />
          </div>
        </div>
      </div>
    </>
  );
}
