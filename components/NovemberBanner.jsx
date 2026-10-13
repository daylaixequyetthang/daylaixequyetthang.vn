'use client';

import { useEffect, useState } from 'react';

const START = new Date('2026-10-10T07:00:00+07:00').getTime();
const END = new Date('2026-11-20T16:45:00+07:00').getTime();

export default function NovemberBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const check = () => setVisible(Date.now() >= START && Date.now() <= END);
    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, []);
  if (!visible) return null;
  return <aside className="qt-nov-banner" aria-label="Chương trình học lái xe 20/11">
    <div className="qt-nov-banner-inner">
      <div className="qt-nov-badge" aria-hidden="true">🎁</div>
      <div className="qt-nov-copy"><strong>Học lái xe B / C1 – Cơ hội trúng 20 triệu đồng!</strong><span>44 giải thưởng • Tri ân 20/11 • Đến 16:45 ngày 20/11/2026</span></div>
      <a href="/20-11">Xem chương trình <span aria-hidden="true">↗</span></a>
    </div>
    <style jsx>{`
      .qt-nov-banner{background:linear-gradient(100deg,#06467e,#0064b5);color:#fff;border-bottom:3px solid #e21d2a;position:relative;z-index:2}
      .qt-nov-banner-inner{max-width:1180px;margin:0 auto;display:flex;align-items:center;gap:18px;padding:15px 22px}
      .qt-nov-badge{font-size:25px;background:#ffffff16;border:1px solid #ffffff20;border-radius:12px;min-width:42px;min-height:42px;display:grid;place-items:center}
      .qt-nov-copy{flex:1;display:flex;flex-direction:column}
      .qt-nov-copy strong{font-size:15px;line-height:1.4}
      .qt-nov-copy span{font-size:12px;color:#d7eaff}
      a{background:#e21d2a;border-radius:40px;color:#fff;white-space:nowrap;padding:11px 18px;font-size:12px;font-weight:800;text-decoration:none}
      @media(max-width:650px){.qt-nov-banner-inner{flex-wrap:wrap;padding:13px 15px;gap:10px}.qt-nov-badge{display:none}.qt-nov-copy{flex:1 1 100%}.qt-nov-copy strong{font-size:14px}.qt-nov-copy span{font-size:11px}.qt-nov-banner-inner a{display:block;text-align:center;width:100%}}
    `}</style>
  </aside>;
}
