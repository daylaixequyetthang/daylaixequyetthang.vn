'use client';
import { useEffect, useState } from 'react';
import { captureTracking, getTracking } from '@/lib/tracking';
import { trackEvent } from '@/lib/track';

export default function SeoConsultForm({ area = '', course = 'Hạng B', heading = 'Nhận tư vấn đăng ký online' }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [chosen, setChosen] = useState(course);
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState('idle');
  const [message, setMessage] = useState('');
  useEffect(() => { captureTracking(); }, []);
  async function submit(e) {
    e.preventDefault();
    if (state === 'sending') return;
    const clean = phone.replace(/[\s.\-]/g, '');
    if (name.trim().length < 2 || !/^0\d{9}$/.test(clean) || !consent) {
      setState('error'); setMessage('Vui lòng nhập họ tên, số điện thoại hợp lệ và đồng ý để trung tâm liên hệ.'); return;
    }
    setState('sending'); setMessage('');
    try {
      const r = await fetch('/api/lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(), phone: clean, course: chosen, need: chosen,
          area, source: 'form',
          note: 'Tư vấn online theo trang SEO khu vực / khóa học; chưa tạo hồ sơ nhập học hay xác nhận điểm đào tạo.',
          tracking: { ...getTracking(), landingPage: window.location.pathname, pageUrl: window.location.href }
        })
      });
      const data = await r.json();
      if (!r.ok || !data.ok || (!data.saved && !data.notified?.telegram && !data.notified?.zalo)) {
        throw new Error('Chưa xác nhận tiếp nhận yêu cầu. Vui lòng gọi hotline 084 875 1111.');
      }
      trackEvent('Lead', { content_name: 'Tư vấn SEO online', content_category: chosen, area });
      setState('success');
    } catch (err) { setState('error'); setMessage(err.message || 'Không thể gửi yêu cầu lúc này.'); }
  }
  if (state === 'success') return <section className="seo-form seo-success" role="status"><h2>Đã tiếp nhận yêu cầu tư vấn</h2><p>Quyết Thắng sẽ liên hệ theo số điện thoại anh/chị cung cấp. Địa điểm và lịch học sẽ được trao đổi trước khi đăng ký chính thức.</p><a href="tel:0848751111">Gọi 084 875 1111</a></section>;
  return <form className="seo-form" onSubmit={submit} aria-label="Đăng ký tư vấn học lái xe online">
    <h2>{heading}</h2>
    <p>Để lại thông tin để được hướng dẫn hồ sơ, khóa học và nơi tham gia đào tạo phù hợp. Không cần nhập CCCD hoặc thanh toán ở bước này.</p>
    <label htmlFor="seo-name">Họ và tên</label>
    <input id="seo-name" autoComplete="name" required maxLength={100} value={name} onChange={e=>setName(e.target.value)} placeholder="Nguyễn Văn A" />
    <label htmlFor="seo-phone">Số điện thoại / Zalo</label>
    <input id="seo-phone" autoComplete="tel-national" type="tel" inputMode="tel" required maxLength={20} value={phone} onChange={e=>setPhone(e.target.value)} placeholder="09xx xxx xxx" />
    <label htmlFor="seo-course">Khóa học quan tâm</label>
    <select id="seo-course" value={chosen} onChange={e=>setChosen(e.target.value)}>
      {['Hạng B','Hạng C1','Hạng A1','Hạng A','Nâng hạng C / D2','Chưa rõ – cần tư vấn'].map(v=><option value={v} key={v}>{v}</option>)}
    </select>
    <label className="seo-consent"><input type="checkbox" required checked={consent} onChange={e=>setConsent(e.target.checked)} /><span>Tôi đồng ý để Quyết Thắng sử dụng thông tin đã cung cấp nhằm liên hệ tư vấn khóa học theo <a href="/chinh-sach-bao-mat">chính sách quyền riêng tư</a>.</span></label>
    {state==='error' && <p className="seo-alert" role="alert">{message}</p>}
    {state==='sending' && <p role="status">Đang gửi yêu cầu...</p>}
    <button type="submit" disabled={state==='sending'} aria-busy={state==='sending'}>{state==='sending'?'Đang gửi...':'Gửi yêu cầu tư vấn'}</button>
    <small>Thông tin chỉ phục vụ việc liên hệ tư vấn. Xem <a href="/chinh-sach-bao-mat">chính sách quyền riêng tư</a>.</small>
  </form>;
}
