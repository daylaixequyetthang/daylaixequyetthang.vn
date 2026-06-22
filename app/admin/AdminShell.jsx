'use client';
import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  { href: '/admin', label: 'Tổng quan', icon: '📊' },
  { href: '/admin/leads', label: 'Học viên / Lead', icon: '👥' },
  { href: '/admin/enrollments', label: 'Đơn đặt cọc', icon: '🧾' },
  { href: '/admin/schedules', label: 'Lịch khai giảng/thi', icon: '📅' },
  { href: '/admin/students', label: 'Tiến độ học viên', icon: '🎓' },
  { href: '/admin/posts', label: 'Bài viết SEO/Tin', icon: '📝' },
  { href: '/admin/chatbot', label: 'Trợ lý ảo (chatbot)', icon: '💬' },
  { href: '/admin/settings', label: 'Vòng quay & Banner', icon: '🎡' },
  { href: '/admin/users', label: 'Tài khoản', icon: '🔑', adminOnly: true },
];

export default function AdminShell({ session, children }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="adm">
      <aside className="adm-side">
        <div className="adm-brand"><span className="mk">QT</span><span>Quản trị</span></div>
        <nav className="adm-nav">
          {NAV.filter((n) => !n.adminOnly || session.role === 'admin').map((n) => (
            <a key={n.href} href={n.href} className={pathname === n.href ? 'active' : ''}>
              <span style={{ fontSize: '1.1rem' }}>{n.icon}</span><span>{n.label}</span>
            </a>
          ))}
        </nav>
        <div className="adm-user">
          <b>{session.name}</b>
          <span>{session.role === 'admin' ? 'Quản trị viên' : 'Biên tập viên'}</span>
          <button className="adm-logout" onClick={logout}>Đăng xuất</button>
        </div>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
