import './admin.css';
import { getSession } from '@/lib/auth';
import AdminShell from './AdminShell';

export const metadata = { title: 'Quản trị | Quyết Thắng' };
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }) {
  const session = await getSession();
  // Chưa đăng nhập: render thẳng (trang /admin/login hiển thị form).
  // Đã đăng nhập: bọc trong giao diện quản trị có sidebar.
  if (!session) return <>{children}</>;
  return <AdminShell session={session}>{children}</AdminShell>;
}
