import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET ?kind=khai_giang|thi — danh sách lịch sắp tới (công khai)
export async function GET(req) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ schedules: [] });
    }
    const kind = new URL(req.url).searchParams.get('kind');
    const sb = supabaseAdmin();
    let query = sb
      .from('schedules')
      .select('id,kind,course,title,start_date,exam_date,location,slots,registered,status,note')
      .gte('start_date', new Date(Date.now() - 86400000).toISOString().slice(0, 10))
      .order('start_date', { ascending: true })
      .limit(50);
    if (kind) query = query.eq('kind', kind);
    const { data } = await query;
    return NextResponse.json({ schedules: data || [] });
  } catch (e) {
    return NextResponse.json({ schedules: [] });
  }
}
