import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const LOGO = 'https://raw.githubusercontent.com/daylaixequyetthang/daylaixequyetthang.vn/main/public/logo.png';

export async function GET() {
  let logo = null;
  try {
    const response = await fetch(LOGO, { next: { revalidate: 86400 } });
    if (response.ok) logo = await response.arrayBuffer();
  } catch {
    // The text wordmark remains visible if the logo cannot be fetched.
  }

  return new ImageResponse(
    <div style={{
      display: 'flex', position: 'relative', overflow: 'hidden',
      width: '100%', height: '100%',
      background: 'linear-gradient(125deg, #063D77 0%, #0064B5 74%, #0879CA 100%)',
      color: '#FFFFFF', fontFamily: 'sans-serif'
    }}>
      <div style={{
        position: 'absolute', width: 440, height: 440, borderRadius: 440,
        border: '34px solid rgba(255,255,255,0.06)',
        right: -155, top: -190, display: 'flex'
      }} />
      <div style={{
        position: 'absolute', bottom: -90, right: -95, width: 440, height: 280,
        borderRadius: 190, border: '25px solid rgba(226,29,42,0.8)', display: 'flex'
      }} />

      <div style={{
        position: 'absolute', top: 34, left: 52, display: 'flex',
        alignItems: 'center', gap: 20
      }}>
        {logo && <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 94, height: 94, background: '#FFFFFF',
          borderRadius: 18
        }}><img src={logo} width="77" height="77" style={{ objectFit: 'contain' }} /></div>}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: 21, fontWeight: 700 }}>TRUNG TÂM GDNN</span>
          <span style={{ fontSize: 40, fontWeight: 900 }}>QUYẾT THẮNG</span>
        </div>
      </div>

      <div style={{
        position: 'absolute', top: 171, left: 54,
        display: 'flex', background: '#E21D2A', borderRadius: 22,
        padding: '7px 19px', color: '#FFFFFF',
        fontWeight: 800, fontSize: 18
      }}>TRI ÂN NGÀY NHÀ GIÁO VIỆT NAM 20/11</div>

      <div style={{
        position: 'absolute', top: 247, left: 54,
        display: 'flex', flexDirection: 'column', width: 715
      }}>
        <span style={{ fontWeight: 900, fontSize: 51, letterSpacing: -1.5, lineHeight: 1.1 }}>HỌC LÁI CÙNG</span>
        <span style={{ fontWeight: 900, fontSize: 50, letterSpacing: -1.5, lineHeight: 1.15 }}>QUYẾT THẮNG</span>
        <span style={{ fontWeight: 800, fontSize: 21, color: '#D6EAFF', marginTop: 16 }}>TỔNG GIÁ TRỊ 44 GIẢI THƯỞNG</span>
        <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 7 }}>
          <span style={{ fontWeight: 900, fontSize: 113, letterSpacing: -3.5, lineHeight: 1 }}>20</span>
          <span style={{ fontWeight: 900, fontSize: 41, marginLeft: 15 }}>TRIỆU ĐỒNG</span>
        </div>
      </div>

      <div style={{
        position: 'absolute', right: 60, top: 168, width: 288, height: 342,
        transform: 'rotate(8deg)', display: 'flex',
        background: '#c31e2a', borderRadius: 22
      }} />
      <div style={{
        position: 'absolute', right: 63, top: 163, width: 288, height: 338,
        transform: 'rotate(-7deg)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '24px 18px',
        background: '#FFFFFF', border: '6px solid #EBF5FF',
        borderRadius: 22, color: '#073E76',
        boxShadow: '0 18px 40px rgba(0,19,52,0.35)'
      }}>
        <span style={{ fontWeight: 900, fontSize: 15, letterSpacing: 1.3 }}>VÉ DỰ THƯỞNG</span>
        <span style={{ marginTop: 22, fontSize: 18, color: '#E21D2A', fontWeight: 800 }}>CHƯƠNG TRÌNH 20/11</span>
        <span style={{ fontSize: 108, fontWeight: 900, lineHeight: 1.05, color: '#E21D2A', marginTop: 8 }}>44</span>
        <span style={{ fontSize: 25, fontWeight: 900 }}>GIẢI MAY MẮN</span>
        <div style={{ borderTop: '2px dashed #AFCDE8', width: 230, display: 'flex', marginTop: 20 }} />
        <span style={{ fontSize: 14, fontWeight: 800, color: '#547393', marginTop: 14 }}>HẠNG B • C1</span>
      </div>

      <div style={{
        position: 'absolute', bottom: 22, left: 53, right: 52,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', background: '#FFFFFF', borderRadius: 14,
        padding: '13px 21px', color: '#07437D',
        fontWeight: 800, fontSize: 18
      }}>
        <span>10/10 – 20/11/2026</span>
        <span>084.875.1111</span>
        <span>daylaixequyetthang.vn</span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=86400',
      }
    }
  );
}
