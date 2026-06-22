import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import SettingsClient from './SettingsClient';

export const dynamic = 'force-dynamic';

async function load(key, fallback) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return fallback;
  const sb = supabaseAdmin();
  const { data } = await sb.from('site_settings').select('value').eq('key', key).single();
  return data?.value || fallback;
}

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  if (session.role !== 'admin') {
    return <div className="adm-card"><b>Chỉ quản trị viên mới chỉnh được cấu hình này.</b></div>;
  }

  const wheel = await load('wheel', { enabled: true, segments: [] });
  const banners = await load('banners', { items: [] });
  const social = await load('social', {});
  const payment = await load('payment', {
    bank_id: '970418', bank_name: 'BIDV', account_no: '6110370681',
    account_name: 'CONG TY CO PHAN TONG HOP QUYET THANG', deposit_default: 2000000, template: 'compact2',
  });
  const connected = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  return <SettingsClient wheel={wheel} banners={banners} social={social} payment={payment} connected={connected} />;
}
