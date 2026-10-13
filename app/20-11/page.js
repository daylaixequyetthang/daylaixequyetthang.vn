import './november.css';
import NovemberCampaign from './NovemberCampaign';

const SITE = 'https://daylaixequyetthang.vn';

export const metadata = {
  title: '20/11/2026 – Học lái xe B, C1, cơ hội trúng 20 triệu đồng',
  description: 'Chương trình tri ân 20/11/2026 tại Trung Tâm GDNN Quyết Thắng: 44 giải thưởng với tổng giá trị 20 triệu đồng. Dành cho học viên hạng B, C1 đáp ứng đủ điều kiện.',
  alternates: { canonical: SITE + '/20-11' },
  openGraph: {
    title: 'Học lái xe B, C1 – Cơ hội trúng 20 triệu đồng | Quyết Thắng 20/11',
    description: '44 giải thưởng, tổng giá trị 20 triệu đồng. Tham gia chương trình 10/10 – 20/11/2026 theo điều kiện dự thưởng.',
    url: SITE + '/20-11',
    siteName: 'Trung Tâm GDNN Quyết Thắng',
    locale: 'vi_VN',
    type: 'website',
    images: [{ url: 'https://daylaixequyetthang.vn/20-11/facebook-cover-2026', secureUrl: 'https://daylaixequyetthang.vn/20-11/facebook-cover-2026', width: 1200, height: 630, type: 'image/png', alt: 'Quyết Thắng 20/11 – 44 giải thưởng, tổng giá trị 20 triệu đồng' }],
  },
  twitter: { card: 'summary_large_image', title: 'Quyết Thắng 20/11 – Tổng giải thưởng 20 triệu đồng', images: ['https://daylaixequyetthang.vn/20-11/facebook-cover-2026'] },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <NovemberCampaign />;
}
