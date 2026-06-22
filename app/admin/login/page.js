'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const d = await r.json();
      if (d.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setErr(d.error || 'Đăng nhập thất bại');
      }
    } catch {
      setErr('Lỗi kết nối máy chủ');
    }
    setLoading(false);
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <h1>Đăng nhập quản trị</h1>
        <p>Hệ thống quản lý Lái Xe Quyết Thắng</p>
        {err && <div className="login-err">{err}</div>}
        <label className="adm-label">Email</label>
        <input className="adm-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@quyetthang.vn" required />
        <label className="adm-label">Mật khẩu</label>
        <input className="adm-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        <button className="btn btn-blue" type="submit" style={{ width: '100%', marginTop: 6 }} disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
        <p style={{ marginTop: 18, fontSize: '.82rem' }}>
          <a href="/" style={{ color: 'var(--blue)' }}>← Về trang chủ</a>
        </p>
      </form>
    </div>
  );
}
