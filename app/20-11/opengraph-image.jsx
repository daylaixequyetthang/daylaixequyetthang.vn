import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Quyết Thắng 20/11 – 44 giải thưởng, tổng giá trị 20 triệu đồng';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', padding: '54px 66px',
      color: '#ffffff', background: 'linear-gradient(125deg, #073f79 0%, #0064b5 72%, #0877cc 100%)',
      fontFamily: 'sans-serif',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: 1 }}>TRUNG TÂM GDNN</span>
          <span style={{ fontSize: 52, fontWeight: 900 }}>QUYẾT THẮNG</span>
        </div>
        <div style={{ display: 'flex', background: '#ffffff', padding: '15px 27px', color: '#e21d2a', borderRadius: 16, fontSize: 28, fontWeight: 900 }}>20/11/2026</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
        <span style={{ fontSize: 33, fontWeight: 750 }}>HỌC LÁI CÙNG QUYẾT THẮNG</span>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{ fontSize: 164, fontWeight: 900, letterSpacing: -5 }}>20</span>
          <span style={{ fontSize: 68, fontWeight: 900, marginLeft: 20 }}>TRIỆU ĐỒNG</span>
        </div>
        <span style={{ fontSize: 30, color: '#e9f4ff' }}>TỔNG GIÁ TRỊ 44 GIẢI THƯỞNG</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #ffffff66', paddingTop: 20, fontWeight: 750, fontSize: 26 }}>
        <span>Đăng ký học lái xe hạng B · C1</span>
        <span>084.875.1111</span>
      </div>
    </div>,
    size
  );
}
