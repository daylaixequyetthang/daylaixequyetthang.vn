import './globals.css';
import Analytics from '@/components/Analytics';

const SITE = 'https://daylaixequyetthang.vn';

export const metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'Học Lái Xe B, C1, A1 Tại Bình Thuận | Quyết Thắng',
    template: '%s | Quyết Thắng',
  },
  description:
    'Tư vấn học lái xe B, C1, A1, A tại Phan Thiết, La Gi, Bắc Bình. Đăng ký online từ Bình Thuận, Đồng Nai, TP.HCM. Hotline: 084 875 1111.',
  keywords: 'học lái xe Bình Thuận, lái xe Phan Thiết, học lái xe ô tô, bằng B, bằng C1, bằng C, bằng A1, thi GPLX, 600 câu lý thuyết, Quyết Thắng, daylaixequyetthang',
  authors: [{ name: 'Trung tâm Đào tạo Lái Xe Quyết Thắng' }],
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

// Global brand entity; physical branches are marked up only on their own verified pages.
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': SITE + '/#organization',
  name: 'Trung Tâm GDNN Quyết Thắng',
  url: SITE,
  logo: SITE + '/logo.png',
  telephone: '+84848751111',
  sameAs: ['https://facebook.com/daylaixequyetthangbt'],
  areaServed: [
    { '@type': 'Place', name: 'Khu vực Bình Thuận' },
    { '@type': 'AdministrativeArea', name: 'Đồng Nai' },
    { '@type': 'AdministrativeArea', name: 'TP. Hồ Chí Minh' }
  ]
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
