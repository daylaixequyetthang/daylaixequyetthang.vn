import './globals.css';
import Analytics from '@/components/Analytics';

const SITE = 'https://daylaixequyetthang.vn';

export const metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'Trung Tâm Đào Tạo Lái Xe Quyết Thắng | Học lái xe A1, A, B, C1, C tại Bình Thuận',
    template: '%s | Lái Xe Quyết Thắng',
  },
  description:
    '18 năm đào tạo lái xe mô tô, ô tô, xe tải tại Bình Thuận. Học phí trọn gói, cam kết không phát sinh. Hạng B 15.500.000đ, C1 19.000.000đ. Hotline/Zalo: 084 875 1111.',
  keywords: 'học lái xe Bình Thuận, lái xe Phan Thiết, học lái xe ô tô, bằng B, bằng C1, bằng C, bằng A1, thi GPLX, 600 câu lý thuyết, Quyết Thắng, daylaixequyetthang',
  authors: [{ name: 'Trung tâm Đào tạo Lái Xe Quyết Thắng' }],
  alternates: { canonical: SITE },
  openGraph: {
    title: 'Lái Xe Quyết Thắng — Học lái xe tại Bình Thuận',
    description: 'Học phí trọn gói, tỷ lệ đậu cao, khai giảng hàng tháng. Thi thử 600 câu miễn phí.',
    url: SITE,
    siteName: 'Lái Xe Quyết Thắng',
    locale: 'vi_VN',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Trung tâm Lái Xe Quyết Thắng Bình Thuận' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lái Xe Quyết Thắng — Học lái xe tại Bình Thuận',
    description: 'Học phí trọn gói, khai giảng hàng tháng. Thi thử 600 câu miễn phí.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

// Schema dữ liệu có cấu trúc — giúp Google hiểu đây là trường dạy lái xe ở Bình Thuận.
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'DrivingSchool',
  name: 'Trung tâm Đào tạo Lái Xe Quyết Thắng',
  description: 'Trung tâm đào tạo và sát hạch lái xe mô tô, ô tô, xe tải tại Bình Thuận. Hơn 18 năm kinh nghiệm.',
  url: SITE,
  telephone: '+84848751111',
  areaServed: 'Bình Thuận',
  address: [
    { '@type': 'PostalAddress', streetAddress: '291 Trần Hưng Đạo', addressLocality: 'Phan Thiết', addressRegion: 'Bình Thuận', addressCountry: 'VN' },
    { '@type': 'PostalAddress', streetAddress: '280 Thống Nhất', addressLocality: 'La Gi', addressRegion: 'Bình Thuận', addressCountry: 'VN' },
    { '@type': 'PostalAddress', streetAddress: 'QL1A, Phan Hiệp', addressLocality: 'Bắc Bình', addressRegion: 'Bình Thuận', addressCountry: 'VN' },
  ],
  sameAs: ['https://facebook.com/daylaixequyetthangbt'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      </head>
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
