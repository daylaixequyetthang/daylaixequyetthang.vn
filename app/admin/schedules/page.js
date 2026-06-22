import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import SchedulesClient from './SchedulesClient';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  let items = [];
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { data } = await supabaseAdmin().from('schedules').select('*').order('start_date', { ascending: true });
    items = data || [];
  }
  return <SchedulesClient initial={items} connected={!!process.env.SUPABASE_SERVICE_ROLE_KEY} />;
}
