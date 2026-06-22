import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import UsersClient from './UsersClient';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  if (session.role !== 'admin') {
    return <div className="adm-card"><b>Chỉ quản trị viên mới quản lý được tài khoản.</b></div>;
  }

  let users = [];
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const sb = supabaseAdmin();
    const { data } = await sb.from('app_users').select('id,email,full_name,role,is_active,created_at').order('created_at');
    users = data || [];
  }
  return <UsersClient initial={users} connected={!!process.env.SUPABASE_SERVICE_ROLE_KEY} />;
}
