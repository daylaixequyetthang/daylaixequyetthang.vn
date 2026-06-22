import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import StudentsClient from './StudentsClient';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  let students = [], schedules = [];
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const sb = supabaseAdmin();
    const [a, b] = await Promise.all([
      sb.from('students').select('*').order('updated_at', { ascending: false }).limit(300),
      sb.from('schedules').select('id,course,title,start_date'),
    ]);
    students = a.data || []; schedules = b.data || [];
  }
  return <StudentsClient initial={students} schedules={schedules} connected={!!process.env.SUPABASE_SERVICE_ROLE_KEY} />;
}
