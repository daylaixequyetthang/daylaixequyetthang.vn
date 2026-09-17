'use client';
import Script from 'next/script';

// ============================================================
// MÃ THEO DÕI: Meta Pixel (Facebook) + Google Analytics (GA4)
// ============================================================
// - 2 Meta Pixel ID đang chạy song song bên dưới (cả 2 cùng nhận dữ liệu mỗi lượt xem trang).
// - Google Analytics: điền mã đo lường GA4 (dạng G-XXXXXXX) vào biến môi trường
//   NEXT_PUBLIC_GA_ID trong file .env (hoặc trong phần Environment Variables của Vercel).
//   Nếu chưa điền, GA tự bỏ qua, không ảnh hưởng web.

const META_PIXEL_IDS = ['1311091366692533', '1089379270101872'];
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export default function Analytics() {
  return (
    <>
      {/* ===== Meta Pixel (Facebook) — chạy song song nhiều pixel ===== */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          ${META_PIXEL_IDS.map((id) => `fbq('init', '${id}');`).join('\n          ')}
          fbq('track', 'PageView');
        `}
      </Script>
      {META_PIXEL_IDS.map((id) => (
        <noscript key={id}>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      ))}

      {/* ===== Google Analytics (GA4) — chỉ chạy khi đã điền NEXT_PUBLIC_GA_ID ===== */}
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}
    </>
  );
}
