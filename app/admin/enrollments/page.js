import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import EnrollmentsClient from './EnrollmentsClient';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  let items = [];
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { data } = await supabaseAdmin().from('enrollments').select('*').order('created_at', { ascending: false }).limit(300);
    items = data || [];
  }
  return <EnrollmentsClient initial={items} connected={!!process.env.SUPABASE_SERVICE_ROLE_KEY} />;
}
