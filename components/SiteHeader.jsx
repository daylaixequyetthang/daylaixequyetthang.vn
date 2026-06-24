'use client';
import { useState } from 'react';
import { PHONE, PHONE_DISPLAY } from '@/lib/data';

// Header dùng chung cho mọi trang (trang chủ + trang con).
// home=true: link section dạng #why (cùng trang). home=false: dạng /#why (về trang chủ).
export default function SiteHeader({ home = false }) {
  const [menu, setMenu] = useState(false);
  const h = (anchor) => (home ? `#${anchor}` : `/#${anchor}`);

  return (
    <header className="hdr">
      <div className="hdr-in">
        <a href={home ? '#top' : '/'} className="brand">
          <img src="/logo.png" alt="Logo Quyết Thắng" className="mk-logo" />
          <span>Dạy Lái Xe Quyết Thắng<small>Đào tạo lái xe các hạng</small></span>
        </a>
        <nav className="nav">
          <a href={h('why')}>Vì sao chọn</a>
          <a href={h('courses')}>Học phí</a>
          <a href="/tra-cuu">Tra cứu lịch</a>
          <a href="/thi-thu">Thi thử 600 câu</a>
          <a href="/tin-tuc">Tin tức</a>
          <a href={h('lien-he')}>Liên hệ</a>
        </nav>
        <div className="hdr-cta">
          <a href={`tel:${PHONE}`} className="hphone">{PHONE_DISPLAY}<small>Hotline / Zalo</small></a>
          <a href="/dang-ky" className="btn btn-blue" style={{ padding: '11px 20px' }}>Đăng ký</a>
          <button className="burger" aria-label="Menu" onClick={() => setMenu((m) => !m)}><span /><span /><span /></button>
        </div>
      </div>
      <nav className={`mmenu ${menu ? 'open' : ''}`} onClick={() => setMenu(false)}>
        <a href={h('why')}>Vì sao chọn</a>
        <a href={h('courses')}>Học phí</a>
        <a href="/tra-cuu">Tra cứu lịch</a>
        <a href="/thi-thu">Thi thử 600 câu</a>
        <a href="/tin-tuc">Tin tức</a>
        <a href={h('lien-he')}>Liên hệ</a>
        <a href="/dang-ky">Đăng ký & đặt cọc</a>
      </nav>
    </header>
  );
}
