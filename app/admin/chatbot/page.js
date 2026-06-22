import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import ChatbotClient from './ChatbotClient';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  let items = [];
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { data } = await supabaseAdmin().from('chatbot_qa').select('*').order('priority', { ascending: false });
    items = data || [];
  }
  return <ChatbotClient initial={items} connected={!!process.env.SUPABASE_SERVICE_ROLE_KEY} />;
}
