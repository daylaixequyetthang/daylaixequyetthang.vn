import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic'; // luôn lấy cấu hình mới nhất, không cache

// Fallback chỉ dùng khi CHƯA cấu hình trong admin.
const FALLBACK = {
  enabled: true,
  segments: [
    { label: 'Voucher 200K', weight: 16, color: '#ff5d73' },
    { label: 'Giảm 300K', weight: 18, color: '#8b2fe6' },
    { label: 'Tặng nón BH', weight: 14, color: '#5b3df5' },
    { label: 'Giảm 500K', weight: 12, color: '#2563ff' },
    { label: 'Tặng tài liệu', weight: 14, color: '#27e0a6' },
    { label: 'Giảm 1 Triệu', weight: 4, color: '#ffb020' },
    { label: 'May mắn lần sau', weight: 8, color: '#6b7191' },
  ],
};

export async function GET() {
  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const sb = supabaseAdmin();
      // maybeSingle: không lỗi khi 0 dòng
      const { data, error } = await sb.from('site_settings').select('value').eq('key', 'wheel').maybeSingle();
      if (error) console.error('wheel-spin read error:', error.message);
      const val = data?.value;
      // Chỉ dùng nếu có segments hợp lệ
      if (val && Array.isArray(val.segments) && val.segments.length > 0) {
        return NextResponse.json(val, { headers: { 'Cache-Control': 'no-store' } });
      }
    }
  } catch (e) {
    console.error('wheel-spin error:', e);
  }
  return NextResponse.json(FALLBACK, { headers: { 'Cache-Control': 'no-store' } });
}
