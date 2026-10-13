'use client';

import { useEffect, useState } from 'react';
import { captureTracking, getTracking } from '@/lib/tracking';
import { trackEvent } from '@/lib/track';

const START = new Date('2026-10-10T07:00:00+07:00').getTime();
const END = new Date('2026-11-20T16:45:00+07:00').getTime();
const PRIZES = [
  { name: 'GIẢI NHẤT', qty: 1, each: 3000000, cls: 'first' },
  { name: 'GIẢI NHÌ', qty: 2, each: 2000000, cls: 'second' },
  { name: 'GIẢI BA', qty: 3, each: 1000000, cls: 'third' },
  { name: 'GIẢI TƯ', qty: 8, each: 500000, cls: '' },
  { name: 'KHUYẾN KHÍCH', qty: 30, each: 200000, cls: '' },
];
const COURSES = ['Hạng B – số tự động', 'Hạng B – số sàn', 'Hạng C1 – xe tải'];
const OFFICES = ['Phan Thiết', 'La Gi', 'Bắc Bình', 'Cần được tư vấn'];
const money = n => new Intl.NumberFormat('vi-VN').format(n) + 'đ';
const pad = n => String(n).padStart(2, '0');

function useCountdown() {
  const [time, setTime] = useState(null);
  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const phase = now < START ? 'upcoming' : now > END ? 'ended' : 'active';
      const target = phase === 'upcoming' ? START : END;
      let seconds = Math.max(0, Math.ceil((target - now) / 1000));
      const days = Math.floor(seconds / 86400); seconds %= 86400;
      const hours = Math.floor(seconds / 3600); seconds %= 3600;
      const minutes = Math.floor(seconds / 60); seconds %= 60;
      setTime({ phase, days, hours, minutes, seconds });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);
  return time;
}

function PrizeCard({ prize }) {
  return <article className={'qt20-prize ' + (prize.cls || '')}>
    <span className="qt20-prize-icon" aria-hidden="true">{String(prize.qty).padStart(2, '0')}</span>
    <span className="qt20-prize-name">{prize.name}</span>
    <strong>{money(prize.each)}</strong>
    <small>Giá trị mỗi giải</small>
  </article>;
}

export default function NovemberCampaign() {
  const time = useCountdown();
  const ended = time?.phase === 'ended';
  const [form, setForm] = useState({ name: '', phone: '', course: COURSES[0], office: OFFICES[0], consent: false });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    captureTracking();
    trackEvent('ViewContent', { content_name: 'Quyet Thang 20-11-2026', content_category: 'Campaign' });
  }, []);

  function change(field, value) {
    setForm(previous => ({ ...previous, [field]: value }));
    if (status === 'error') { setStatus('idle'); setError(''); }
  }

  async function submit(event) {
    event.preventDefault();
    if (status === 'sending') return;
    const phone = form.phone.replace(/[\s.\-]/g, '');
    if (form.name.trim().length < 2) { setStatus('error'); setError('Vui lòng nhập đầy đủ họ và tên.'); return; }
    if (!/^0\d{9}$/.test(phone)) { setStatus('error'); setError('Vui lòng kiểm tra lại số điện thoại 10 số.'); return; }
    if (!form.consent) { setStatus('error'); setError('Vui lòng đồng ý để trung tâm liên hệ tư vấn.'); return; }

    setStatus('sending');
    setError('');
    try {
      const tracking = getTracking();
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(), phone, course: form.course, need: form.course, office: form.office,
          note: ended
            ? 'Yêu cầu tư vấn sau khi chương trình 20/11/2026 kết thúc.'
            : 'Quan tâm chương trình 20/11/2026. Chỉ đăng ký tư vấn; chưa cấp mã dự thưởng.',
          tracking: {
            ...tracking,
            utmCampaign: tracking.utmCampaign || 'quyet_thang_20_11_2026',
            landingPage: '/20-11',
            pageUrl: window.location.href,
          },
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Không gửi được thông tin.');
      if (!result.saved && !result.notified?.telegram && !result.notified?.zalo) {
        throw new Error('Trung tâm chưa xác nhận nhận được yêu cầu. Vui lòng gọi hotline.');
      }
      trackEvent('Lead', { content_name: 'Landing 20/11 – tư vấn khóa B/C1', course: form.course });
      setStatus('success');
    } catch (e) {
      setStatus('error');
      setError(e.message || 'Lỗi kết nối, vui lòng gọi 084 875 1111.');
    }
  }

  return <div className="qt20">
    <header className="qt20-header">
      <div className="qt20-wrap qt20-header-in">
        <a className="qt20-logo" href="/" aria-label="Về trang chủ Quyết Thắng">
          <img src="/logo.png" alt="Logo Trung Tâm GDNN Quyết Thắng" width="52" height="52" />
          <span>TRUNG TÂM GDNN <strong>QUYẾT THẮNG</strong></span>
        </a>
        <nav aria-label="Điều hướng chương trình"><a href="#giai-thuong">Giải thưởng</a><a href="#dieu-kien">Điều kiện</a><a href="#hoi-dap">Hỏi đáp</a></nav>
        <a className="qt20-top-cta" href="#dang-ky">Đăng ký tư vấn ↗</a>
      </div>
    </header>

    <main>
      <section className="qt20-hero" aria-labelledby="qt20-title">
        <div className="qt20-orb qt20-orb-a" aria-hidden="true" /><div className="qt20-orb qt20-orb-b" aria-hidden="true" />
        <div className="qt20-wrap qt20-hero-grid">
          <div className="qt20-hero-copy">
            <p className="qt20-pill">TRI ÂN NGÀY NHÀ GIÁO VIỆT NAM 20/11</p>
            <h1 id="qt20-title">HỌC LÁI XE <span>CÙNG QUYẾT THẮNG</span></h1>
            <p className="qt20-kicker">ĐĂNG KÝ HẠNG B / C1 • NHẬN MÃ DỰ THƯỞNG KHI ĐỦ ĐIỀU KIỆN</p>
            <div className="qt20-amount"><span>TỔNG GIÁ TRỊ 44 GIẢI THƯỞNG</span><strong>20 <small>TRIỆU</small></strong><b>ĐỒNG</b></div>
            <p className="qt20-lead">Đăng ký học lái xe <strong>hạng B hoặc C1</strong>, hoàn tất hồ sơ và thanh toán tối thiểu 50% học phí để nhận mã dự thưởng.</p>
            <div className="qt20-actions"><a className="qt20-btn qt20-btn-red" href="#dang-ky">Nhận tư vấn chương trình <span aria-hidden="true">→</span></a><a className="qt20-btn qt20-btn-white" href="#giai-thuong">Xem giải thưởng</a></div>
            <p className="qt20-dates">07:00 ngày 10/10 – 16:45 ngày 20/11/2026 (GMT+7)</p>
          </div>
          <div className="qt20-art" aria-hidden="true">
            <div className="qt20-art-ring" />
            <div className="qt20-ticket qt20-ticket-back"><b>TRI ÂN 20/11</b><span>QUYẾT THẮNG</span></div>
            <div className="qt20-ticket qt20-ticket-main">
              <div className="qt20-ticket-overline">HỌC LÁI XE • CƠ HỘI TRÚNG THƯỞNG</div>
              <div className="qt20-gift"><span>🎁</span></div>
              <strong>44</strong><b>GIẢI MAY MẮN</b>
              <div className="qt20-ticket-line" />
              <small>01 mã dự thưởng cho mỗi học viên đủ điều kiện</small>
            </div>
            <div className="qt20-float qt20-float-one"><span>🏆 01 GIẢI NHẤT</span><b>3.000.000đ</b></div>
            <div className="qt20-float qt20-float-two">✦ Đăng ký học B / C1 ✦</div>
          </div>
        </div>
      </section>

      <section className="qt20-countdown" aria-label="Thời gian chương trình"><div className="qt20-wrap qt20-countdown-inner">
        <div><strong>{ended ? 'Chương trình đã kết thúc' : time?.phase === 'upcoming' ? 'Chương trình sắp bắt đầu' : 'Chương trình đang diễn ra'}</strong><span>{ended ? 'Anh/chị vẫn có thể đăng ký tư vấn khóa học B, C1.' : 'Hạn cuối: 16:45 ngày 20/11/2026 (giờ Việt Nam)'}</span></div>
        {!ended && <div className="qt20-timer">
          {[[time?.days,'Ngày'],[time?.hours,'Giờ'],[time?.minutes,'Phút'],[time?.seconds,'Giây']].map(([n,label]) =>
            <div className="qt20-timer-unit" key={label}><b>{n == null ? '--' : pad(n)}</b><small>{label}</small></div>
          )}
        </div>}
      </div></section>

      <section className="qt20-section qt20-prizes" id="giai-thuong">
        <div className="qt20-wrap"><div className="qt20-section-heading"><h2>44 giải thưởng. <span>Tổng giá trị 20 triệu đồng.</span></h2><p>5 hạng giải. Số tiền bên dưới là giá trị của từng giải.</p></div>
          <div className="qt20-prize-grid">{PRIZES.map(p => <PrizeCard prize={p} key={p.name} />)}</div>
          <div className="qt20-total"><span>Tổng cộng</span><strong>44 GIẢI</strong><strong>20.000.000đ</strong></div>
        </div>
      </section>

      <section className="qt20-section qt20-rules" id="dieu-kien">
        <div className="qt20-wrap"><div className="qt20-section-heading"><h2>Đủ điều kiện, <span>nhận mã dự thưởng.</span></h2><p>Điền biểu mẫu trên website chỉ để nhận tư vấn, không tự động cấp mã.</p></div>
          <div className="qt20-steps">
            <article><span>01</span><div><h3>Đăng ký hạng B hoặc C1</h3><p>Đăng ký trong thời gian chương trình và hoàn tất hồ sơ học lái xe hợp lệ.</p></div></article>
            <article><span>02</span><div><h3>Thanh toán tối thiểu 50% học phí</h3><p>Trung tâm đối soát học phí thực tế trước khi xác nhận đủ điều kiện tham gia.</p></div></article>
            <article><span>03</span><div><h3>Nhận 01 mã dự thưởng</h3><p>Mỗi học viên đủ điều kiện được cấp 01 mã dự thưởng theo số CCCD để tham gia quay số.</p></div></article>
          </div>
          <p className="qt20-note"><b>Lưu ý:</b> Không cung cấp CCCD trên biểu mẫu tư vấn này. Việc quay số, công bố và trao giải thực hiện theo thể lệ chính thức của chương trình.</p>
        </div>
      </section>

      <section className="qt20-story"><div className="qt20-wrap qt20-story-grid">
        <img src="/anh/student-1.jpg" alt="Hình ảnh học viên tại Trung tâm GDNN Quyết Thắng" loading="lazy" />
        <div><h2>Vững tay lái.<br/><span>Sáng tương lai.</span></h2><p>Chọn khóa học phù hợp, luyện tập bài bản cùng Quyết Thắng, thêm cơ hội tham gia chương trình tri ân 20/11.</p><div className="qt20-tags"><span>Hạng B – Ô tô con</span><span>Hạng C1 – Xe tải</span></div><a href="#dang-ky">Tìm khóa học phù hợp →</a></div>
      </div></section>

      <section className="qt20-section qt20-register" id="dang-ky"><div className="qt20-wrap qt20-register-grid">
        <div><h2>Hành trình cầm lái <span>bắt đầu từ đây.</span></h2><p>Để lại thông tin, đội ngũ Quyết Thắng sẽ tư vấn khóa học B hoặc C1 và hướng dẫn thủ tục tham gia chương trình.</p>
          <div className="qt20-contact"><a href="tel:0848751111">📞 Gọi ngay <strong>084.875.1111</strong></a><a href="https://zalo.me/0848751111" target="_blank" rel="noopener noreferrer">💬 Chat với <strong>Zalo Quyết Thắng ↗</strong></a></div>
          <p className="qt20-register-note">{ended ? 'Chương trình quay số đã kết thúc. Biểu mẫu tiếp tục nhận yêu cầu tư vấn học lái xe.' : 'Biểu mẫu này không tự động cấp mã dự thưởng. Trung tâm sẽ xác minh hồ sơ và thanh toán trước khi cấp mã.'}</p>
        </div>
        <div className="qt20-form-card">
          {status === 'success' ? <div className="qt20-success" role="status"><span>✓</span><h3>Đã tiếp nhận yêu cầu tư vấn</h3><p>Trung tâm sẽ liên hệ qua số điện thoại đã cung cấp. <b>Đây chưa phải mã dự thưởng.</b></p><a href="tel:0848751111" className="qt20-btn qt20-btn-red">Liên hệ ngay</a></div> :
          <form onSubmit={submit}><h3>Đăng ký nhận thông tin</h3>
            <label htmlFor="qt20-name">Họ và tên *</label><input required id="qt20-name" autoComplete="name" maxLength={120} value={form.name} onChange={e=>change('name',e.target.value)} placeholder="Nguyễn Văn A" />
            <label htmlFor="qt20-phone">Số điện thoại / Zalo *</label><input required id="qt20-phone" type="tel" autoComplete="tel-national" inputMode="tel" maxLength={20} value={form.phone} onChange={e=>change('phone',e.target.value)} placeholder="09xx xxx xxx" />
            <label htmlFor="qt20-course">Khóa học quan tâm</label><select id="qt20-course" value={form.course} onChange={e=>change('course',e.target.value)}>{COURSES.map(course=><option key={course} value={course}>{course}</option>)}</select>
            <label htmlFor="qt20-office">Khu vực tư vấn</label><select id="qt20-office" value={form.office} onChange={e=>change('office',e.target.value)}>{OFFICES.map(office=><option key={office} value={office}>{office}</option>)}</select>
            <label className="qt20-consent"><input type="checkbox" checked={form.consent} onChange={e=>change('consent',e.target.checked)} /><span>Tôi đồng ý để Trung tâm liên hệ tư vấn theo <a href="/chinh-sach-bao-mat" target="_blank" rel="noopener noreferrer">Chính sách quyền riêng tư</a>.</span></label>
            <div role="status" aria-live="polite">{error && <p role="alert" className="qt20-error">{error}</p>}{status==='sending' && <p className="qt20-form-progress">Đang gửi yêu cầu, vui lòng chờ...</p>}</div>
            <button disabled={status==='sending'} aria-busy={status==='sending'} className="qt20-btn qt20-btn-red qt20-submit" type="submit">{status==='sending'?'Đang gửi...':'Gửi yêu cầu tư vấn →'}</button>
            <p className="qt20-form-note">Không nhập CCCD • Không tự động cấp mã dự thưởng</p>
          </form>}
        </div>
      </div></section>

      <section className="qt20-section qt20-faq" id="hoi-dap"><div className="qt20-wrap qt20-faq-inner"><div className="qt20-section-heading"><h2>Những điều cần biết <span>trước khi tham gia</span></h2></div>
        <details><summary>Ai được tham gia chương trình?</summary><p>Học viên đăng ký học lái xe ô tô hạng B hoặc C1 tại Quyết Thắng trong thời gian từ 07:00 ngày 10/10/2026 đến 16:45 ngày 20/11/2026, có hồ sơ hợp lệ và đã thanh toán tối thiểu 50% học phí.</p></details>
        <details><summary>Điền form trên website có nhận mã dự thưởng không?</summary><p>Không. Đây là biểu mẫu tư vấn. Mã dự thưởng được cấp khi Trung tâm đã đối soát hồ sơ hợp lệ và thanh toán đủ điều kiện.</p></details>
        <details><summary>Một người có được nhiều mã dự thưởng không?</summary><p>Mỗi học viên đủ điều kiện nhận 01 mã dự thưởng theo số CCCD.</p></details>
        <details><summary>Khi nào quay số và nhận giải?</summary><p>Thời gian quay, cách công bố và trao giải sẽ được nêu trong thể lệ chính thức do Trung tâm ban hành. Liên hệ hotline 084.875.1111 để được cập nhật.</p></details>
      </div></section>
    </main>

    <footer className="qt20-footer"><div className="qt20-wrap qt20-footer-inner"><div><strong>TRUNG TÂM GDNN QUYẾT THẮNG</strong><p>Vững tay lái – Sáng tương lai</p><a href="/">daylaixequyetthang.vn</a></div><div><p>Hotline <a href="tel:0848751111">084.875.1111</a></p><p>Phan Thiết · La Gi · Bắc Bình</p><a href="/chinh-sach-bao-mat">Chính sách quyền riêng tư</a></div></div><div className="qt20-wrap qt20-footnote">Chương trình quay số may mắn áp dụng theo thể lệ chính thức. Hoàn tất biểu mẫu tư vấn không đồng nghĩa được cấp mã hay trúng thưởng.</div></footer>
    <div className="qt20-bottom"><a href="tel:0848751111">Gọi tư vấn</a><a href="#dang-ky">Đăng ký B / C1 →</a></div>
  </div>;
}
