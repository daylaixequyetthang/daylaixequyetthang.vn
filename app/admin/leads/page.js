import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import LeadsTable from './LeadsTable';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  let leads = [];
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const sb = supabaseAdmin();
    const { data } = await sb.from('leads').select('*').order('created_at', { ascending: false }).limit(300);
    leads = data || [];
  }

  return (
    <>
      <div className="adm-h"><h1>Học viên / Lead</h1><span style={{ color: 'var(--muted)' }}>{leads.length} lead</span></div>
      {!process.env.SUPABASE_SERVICE_ROLE_KEY ? (
        <div className="adm-card"><b>⚠️ Chưa kết nối Supabase.</b><p style={{ color: 'var(--muted)', marginTop: 8 }}>Lead vẫn được bắn về Telegram, nhưng cần Supabase để lưu & quản lý tại đây.</p></div>
      ) : (
        <LeadsTable initial={leads} />
      )}
    </>
  );
}
