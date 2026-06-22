'use client';
import { useState } from 'react';

export default function UsersClient({ initial, connected }) {
  const [users, setUsers] = useState(initial);
  const [f, setF] = useState({ full_name: '', email: '', password: '', role: 'editor' });
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  async function create() {
    if (!connected) { setMsg('⚠️ Chưa kết nối Supabase.'); return; }
    setMsg(''); setSaving(true);
    try {
      const r = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(f),
      });
      const d = await r.json();
      if (d.ok) {
        setMsg('✅ Đã tạo tài khoản!');
        setUsers((u) => [...u, { ...f, id: Math.random(), is_active: true, created_at: new Date().toISOString() }]);
        setF({ full_name: '', email: '', password: '', role: 'editor' });
      } else setMsg('❌ ' + (d.error || 'Lỗi'));
    } catch { setMsg('❌ Lỗi kết nối'); }
    setSaving(false);
  }

  async function toggle(id, is_active) {
    setUsers((u) => u.map((x) => (x.id === id ? { ...x, is_active } : x)));
    await fetch('/api/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, is_active }) });
  }

  return (
    <>
      <div className="adm-h"><h1>Tài khoản</h1>{msg && <span style={{ fontWeight: 600 }}>{msg}</span>}</div>

      <div className="adm-row" style={{ alignItems: 'flex-start' }}>
        <div className="adm-card" style={{ flex: 1 }}>
          <h3 style={{ marginBottom: 16 }}>+ Tạo tài khoản con</h3>
          <p style={{ color: 'var(--muted)', fontSize: '.88rem', marginBottom: 16 }}>Tài khoản "Biên tập viên" chỉ viết bài SEO/tin tức và xem lead. "Quản trị viên" toàn quyền.</p>
          <label className="adm-label">Họ tên</label>
          <input className="adm-input" value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} placeholder="Nguyễn Văn B" />
          <label className="adm-label">Email đăng nhập</label>
          <input className="adm-input" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="bientap@quyetthang.vn" />
          <label className="adm-label">Mật khẩu</label>
          <input className="adm-input" type="text" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} placeholder="Tối thiểu 6 ký tự" />
          <label className="adm-label">Vai trò</label>
          <select className="adm-select" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}>
            <option value="editor">Biên tập viên (viết bài)</option>
            <option value="admin">Quản trị viên (toàn quyền)</option>
          </select>
          <button className="btn btn-cta" style={{ width: '100%' }} onClick={create} disabled={saving}>{saving ? 'Đang tạo...' : 'Tạo tài khoản'}</button>
        </div>

        <div className="adm-card" style={{ flex: 2, padding: 0, overflow: 'hidden' }}>
          <table className="adm-table">
            <thead><tr><th>Họ tên</th><th>Email</th><th>Vai trò</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td><b>{u.full_name}</b></td>
                  <td>{u.email}</td>
                  <td><span className={`adm-pill ${u.role === 'admin' ? 'won' : 'new'}`}>{u.role === 'admin' ? 'Quản trị' : 'Biên tập'}</span></td>
                  <td><span className={`adm-pill ${u.is_active ? 'published' : 'draft'}`}>{u.is_active ? 'Hoạt động' : 'Đã khóa'}</span></td>
                  <td>
                    <button className="btn" style={{ padding: '6px 12px', fontSize: '.8rem', background: u.is_active ? 'rgba(255,93,115,.14)' : 'rgba(39,224,166,.16)', color: u.is_active ? '#d83a52' : '#0a8f63', border: 0 }} onClick={() => toggle(u.id, !u.is_active)}>
                      {u.is_active ? 'Khóa' : 'Mở'}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: 30 }}>Chưa có tài khoản nào ngoài admin gốc.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
