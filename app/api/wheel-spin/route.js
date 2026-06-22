import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Trả cấu hình vòng quay (đọc từ settings, có fallback mặc định).
const FALLBACK = {
  enabled: true,
  segments: [
    { label: 'Giảm 500K', weight: 18, color: '#2563ff' },
    { label: 'Tặng nón BH', weight: 14, color: '#5b3df5' },
    { label: 'Giảm 300K', weight: 18, color: '#8b2fe6' },
    { label: 'Voucher 200K', weight: 16, color: '#ff5d73' },
    { label: 'Giảm 1 Triệu', weight: 4, color: '#ffb020' },
    { label: 'Tặng tài liệu', weight: 14, color: '#27e0a6' },
    { label: 'Giảm 800K', weight: 12, color: '#0ea5e9' },
    { label: 'May mắn lần sau', weight: 4, color: '#6b7191' },
  ],
};

export async function GET() {
  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const sb = supabaseAdmin();
      const { data } = await sb.from('site_settings').select('value').eq('key', 'wheel').single();
      if (data?.value) return NextResponse.json(data.value);
    }
  } catch (e) {
    /* fallthrough */
  }
  return NextResponse.json(FALLBACK);
}
