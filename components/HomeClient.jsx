'use client';
import './home.css';
import { useState } from 'react';
import Reveal from './Reveal';
import LeadForm from './LeadForm';
import LuckyWheel from './LuckyWheel';
import ChatBot from './ChatBot';
import {
  COURSES, UPGRADES, STEPS, FEATURES, FAQS, OFFICES, BANNERS, SOCIAL,
  PHONE, PHONE_DISPLAY, ZALO, MESSENGER, REVIEWS, GOOGLE_REVIEW_URL, GOOGLE_MAPS_MAIN,
} from '@/lib/data';

const FEAT_ICONS = ['🛡️', '🚗', '🎯', '🤝', '📅', '📍'];
const FEAT_GRADS = [
  'var(--grad-hero)', 'var(--grad-mint)', 'var(--grad-violet)',
  'linear-gradient(135deg,#ff5d73,#ffb020)', 'linear-gradient(135deg,#0ea5e9,#5b3df5)', 'var(--grad-cta)',
];
const AV_GRADS = ['var(--grad-hero)', 'var(--grad-mint)', 'var(--grad-cta)'];

export default function HomeClient() {
  const [wheel, setWheel] = useState(false);
  const [menu, setMenu] = useState(false);
  const banners = BANNERS;

  return (
    <>
      {/* HEADER */}
      <header className="hdr">
        <div className="hdr-in">
          <a href="#top" className="brand">
            <img src="/logo.png" alt="Logo Quyết Thắng" className="mk-logo" />
            <span>Học Lái Xe Quyết Thắng<small>Đào tạo lái xe · Bình Thuận</small></span>
          </a>
          <nav className="nav">
            <a href="#why">Vì sao chọn</a>
            <a href="#courses">Học phí</a>
            <a href="/tra-cuu">Tra cứu lịch</a>
            <a href="/thi-thu">Thi thử 600 câu</a>
            <a href="/tin-tuc">Tin tức</a>
            <a href="#contact">Liên hệ</a>
          </nav>
          <div className="hdr-cta">
            <a href={`tel:${PHONE}`} className="hphone">{PHONE_DISPLAY}<small>Hotline / Zalo</small></a>
            <a href="/dang-ky" className="btn btn-blue" style={{ padding: '11px 20px' }}>Đăng ký</a>
            <button className="burger" aria-label="Menu" onClick={() => setMenu((m) => !m)}><span /><span /><span /></button>
          </div>
        </div>
        <nav className={`mmenu ${menu ? 'open' : ''}`} onClick={() => setMenu(false)}>
          <a href="#why">Vì sao chọn</a>
          <a href="#courses">Học phí</a>
          <a href="/tra-cuu">Tra cứu lịch</a>
          <a href="/thi-thu">Thi thử 600 câu</a>
          <a href="/tin-tuc">Tin tức</a>
          <a href="#contact">Liên hệ</a>
          <a href="/dang-ky">Đăng ký & đặt cọc</a>
        </nav>
      </header>

      {/* BANNER MARQUEE */}
      <div className="marq">
        <div className="marq-track">
          {[...banners, ...banners].map((b, i) => <span key={i}>{b}</span>)}
        </div>
      </div>

      {/* HERO */}
      <section className="hero" id="top">
        <div className="hero-blob b1" /><div className="hero-blob b2" />
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow on-dark">18 năm · 35.000+ học viên</span>
            <h1>Học lái xe A1, A, B, C1, C tại Bình Thuận cùng <span className="grad-text-blue">Quyết Thắng</span></h1>
            <p className="lead">Học phí trọn gói, cam kết không phát sinh — đã gồm xăng, xe, giáo viên, sân bãi, đường trường DAT và lệ phí thi tốt nghiệp.</p>
            <div className="hero-cta">
              <a href="#dangky" className="btn btn-light">Nhận tư vấn & báo giá</a>
              <a href={`tel:${PHONE}`} className="btn btn-ghost">📞 Gọi {PHONE_DISPLAY}</a>
            </div>
            <div className="trust">
              <div className="t"><b>18</b><span>năm kinh nghiệm</span></div>
              <div className="t"><b>35.000+</b><span>học viên đã cấp bằng</span></div>
              <div className="t"><b>3</b><span>văn phòng ghi danh</span></div>
            </div>
          </div>
          <div className="hero-card-wrap"><LeadForm onSpin={() => setWheel(true)} /></div>
        </div>
      </section>

      {/* WHY */}
      <section className="sec" id="why">
        <div className="wrap">
          <Reveal className="sec-head">
            <span className="eyebrow">Vì sao chọn Quyết Thắng</span>
            <h2>Đào tạo bài bản, học phí minh bạch, đậu là có bằng</h2>
            <p>Hơn 18 năm tiên phong đào tạo lái xe tại Bình Thuận, là trung tâm đào tạo lái xe uy tín được nhiều học viên tin tưởng.</p>
          </Reveal>
          <div className="feat-grid">
            {FEATURES.map((f, i) => (
              <Reveal key={i} delay={i * 70} className="feat">
                <div className="ic" style={{ background: FEAT_GRADS[i] }}>{FEAT_ICONS[i]}</div>
                <h3>{f.t}</h3><p>{f.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section className="sec courses" id="courses">
        <div className="wrap">
          <Reveal className="sec-head">
            <span className="eyebrow">Học Phí</span>
            <h2>Chọn hạng bằng phù hợp với bạn</h2>
            <p>Học phí trọn gói, đã cập nhật theo khung GPLX mới. Liên hệ để nhận báo giá & ưu đãi mới nhất.</p>
          </Reveal>
          <div className="course-grid">
            {COURSES.map((c, i) => (
              <Reveal key={i} delay={i * 70} className={`course ${c.popular ? 'pop' : ''}`}>
                {c.popular && <span className="tag">Phổ biến nhất</span>}
                <div className="top" style={{ background: c.grad }}>
                  <div className="cls">{c.cls}</div><div className="name">{c.name}</div>
                </div>
                <div className="body">
                  <div className="price">{c.price}{c.unit && <small>{c.unit}</small>}</div>
                  <ul>{c.points.map((p, j) => <li key={j}><i>✓</i> {p}</li>)}</ul>
                  <a href="#dangky" className={`btn ${c.popular ? 'btn-cta' : 'btn-blue'}`}>Đăng ký {c.cls}</a>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="upgrade">
            <h3>🔼 Nâng hạng giấy phép lái xe</h3>
            <div className="up-grid">
              {UPGRADES.map((u, i) => <div key={i} className="u"><b>{u.price}</b><span>{u.desc}</span></div>)}
            </div>
          </Reveal>

          <p className="note">Liên hệ <b>{PHONE_DISPLAY}</b> để được tư vấn và nhận báo giá chính xác nhất theo từng hạng.</p>
        </div>
      </section>

      {/* PROCESS */}
      <section className="sec" id="process">
        <div className="wrap">
          <Reveal className="sec-head">
            <span className="eyebrow">Lộ trình 7 bước</span>
            <h2>Từ đăng ký đến cầm bằng lái xe</h2>
            <p>Lộ trình linh hoạt cho người học online và chủ động sắp xếp thời gian.</p>
          </Reveal>
          <div className="steps">
            {STEPS.map((s, i) => (
              <Reveal key={i} delay={i * 60} className="step">
                <div className="num">{String(i + 1).padStart(2, '0')}</div>
                <h3>{s.t}</h3><p>{s.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* OFFER */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="offer">
            <div>
              <h2>Ưu đãi đăng ký khóa mới</h2>
              <p>Đăng ký hạng B hoặc C1 thời điểm này nhận nhiều ưu đãi hấp dẫn. Học trước trả sau — chỉ 2.000.000đ giữ chỗ. Quay số ngay để nhận thêm ưu đãi học phí!</p>
              <div className="tags"><span>🎓 Lấy bằng trước Tết</span><span>💳 Học trước trả sau</span><span>🎡 Quay số trúng ưu đãi</span></div>
            </div>
            <button className="btn btn-light" onClick={() => setWheel(true)}>🎡 Quay số nhận ưu đãi</button>
          </Reveal>
        </div>
      </section>

      {/* TEST APP CTA */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="testapp">
            <div>
              <h2>📝 Thi thử 600 câu lý thuyết GPLX</h2>
              <p>Luyện ngay bộ 600 câu hỏi sát hạch mới nhất, đánh dấu 60 câu điểm liệt. Học tới đâu, kiểm tra tới đó — miễn phí.</p>
            </div>
            <a href="/thi-thu" className="btn btn-light">Vào thi thử ngay</a>
          </Reveal>
        </div>
      </section>

      {/* TRA CỨU + ĐĂNG KÝ ONLINE */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="dual-grid">
            <Reveal className="dual-card lookup">
              <span className="dual-ic">📅</span>
              <h3>Tra cứu lịch & tiến độ</h3>
              <p>Xem lịch khai giảng, lịch thi sát hạch sắp tới. Học viên tra cứu tiến độ học bằng CCCD hoặc số điện thoại.</p>
              <a href="/tra-cuu" className="btn btn-light">Tra cứu ngay</a>
            </Reveal>
            <Reveal delay={90} className="dual-card enroll">
              <span className="dual-ic">🧾</span>
              <h3>Đăng ký & đặt cọc online</h3>
              <p>Giữ chỗ khóa sắp khai giảng bằng cách đặt cọc qua mã QR — không cần đến văn phòng. Cọc trừ vào học phí.</p>
              <a href="/dang-ky" className="btn btn-light">Đăng ký & đặt cọc</a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {REVIEWS.length > 0 && (
      <section className="sec" id="review">
        <div className="wrap">
          <Reveal className="sec-head">
            <span className="eyebrow">Học viên nói gì</span>
            <h2>Hơn 35.000 học viên đã tin tưởng</h2>
          </Reveal>
          <div className="tst-grid">
            {REVIEWS.slice(0, 6).map((t, i) => (
              <Reveal key={i} delay={i * 80} className="tst">
                <div className="stars">{'★'.repeat(t.stars || 5)}</div>
                <p>"{t.text}"</p>
                <div className="who"><span className="av" style={{ background: AV_GRADS[i % AV_GRADS.length] }}>{t.avatar}</span><div><b>{t.name}</b><span>{t.role}</span></div></div>
              </Reveal>
            ))}
          </div>
          {GOOGLE_REVIEW_URL && (
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener" className="btn btn-ghost">⭐ Xem & viết đánh giá trên Google</a>
            </div>
          )}
        </div>
      </section>
      )}

      {/* FAQ */}
      <section className="sec" id="faq">
        <div className="wrap">
          <Reveal className="sec-head"><span className="eyebrow">Hỏi đáp</span><h2>Những câu hỏi thường gặp</h2></Reveal>
          <div className="faq">
            {FAQS.map((f, i) => (
              <Reveal key={i} delay={i * 40}><details className="qa"><summary>{f.q}</summary><div className="a">{f.a}</div></details></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="sec" id="contact">
        <div className="wrap">
          <Reveal className="sec-head"><span className="eyebrow">Liên hệ</span><h2>Đăng ký online — tư vấn tận nơi</h2></Reveal>
          <div className="contact-grid">
            <Reveal className="contact-card">
              <h3>Đăng ký online nhanh chóng</h3>
              <p style={{ color: 'var(--muted)', marginBottom: 16, lineHeight: 1.6 }}>
                Bạn không cần đến tận nơi — để lại số điện thoại hoặc nhắn Zalo/Messenger, đội ngũ Quyết Thắng tư vấn và hỗ trợ hồ sơ tận tình. Có thể đặt cọc giữ chỗ online qua mã QR.
              </p>
              <div className="office"><i>📞</i><span><b>{PHONE_DISPLAY}</b> — Hotline / Zalo</span></div>
              <div className="office"><i>⏰</i><span>Khai giảng hàng tháng · Hỗ trợ cả ngoài giờ</span></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
                <a href="/dang-ky" className="btn btn-cta" style={{ padding: '11px 20px' }}>Đăng ký online</a>
                <a href={ZALO} target="_blank" rel="noopener" className="btn btn-ghost" style={{ padding: '11px 20px' }}>Nhắn Zalo</a>
              </div>
            </Reveal>
            <Reveal className="contact-card" delay={80}>
              <h3>Gửi yêu cầu tư vấn nhanh</h3>
              <LeadForm onSpin={() => setWheel(true)} />
            </Reveal>
          </div>

          {/* 3 văn phòng - map nhỏ + chỉ đường (phụ, không phải trọng tâm) */}
          <div className="off-wrap">
            <h3 className="off-title">3 văn phòng ghi danh trực tiếp <span>(nếu bạn muốn đến tận nơi)</span></h3>
            <div className="off-grid">
              {OFFICES.map((o, i) => (
                <div key={i} className="off-card">
                  <div className="off-info">
                    <b>{o.name}</b>
                    <span><i>📍</i> {o.address}</span>
                  </div>
                  <a href={o.maps} target="_blank" rel="noopener" className="off-dir">🧭 Chỉ đường</a>
                </div>
              ))}
            </div>
            <div className="off-map">
              <iframe
                title="Bản đồ Trung tâm Lái Xe Quyết Thắng"
                src="https://www.google.com/maps?q=Trung+t%C3%A2m+%C4%91%C3%A0o+t%E1%BA%A1o+l%C3%A1i+xe+Quy%E1%BA%BFt+Th%E1%BA%AFng+Phan+Thi%E1%BA%BFt&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FINAL */}
      <section className="final">
        <div className="final-blob" style={{ right: '-100px', top: '-80px' }} />
        <div className="final-blob" style={{ left: '-90px', bottom: '-120px', animationDelay: '-3s' }} />
        <div className="wrap">
          <span className="eyebrow on-dark">Sẵn sàng cầm vô lăng?</span>
          <h2 style={{ marginTop: 14 }}>Đăng ký khóa học lái xe hôm nay</h2>
          <p>Để lại số điện thoại, đội ngũ Quyết Thắng sẽ tư vấn lịch học và học phí ưu đãi nhất cho bạn.</p>
          <div className="hero-cta" style={{ justifyContent: 'center' }}>
            <a href="#dangky" className="btn btn-light">Đăng ký giữ chỗ</a>
            <a href={`tel:${PHONE}`} className="btn btn-ghost">📞 {PHONE_DISPLAY}</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ft">
        <div className="wrap">
          <div className="ft-grid">
            <div>
              <a href="#top" className="brand" style={{ color: '#fff', marginBottom: 14 }}>
                <img src="/logo.png" alt="Logo Quyết Thắng" className="mk-logo" /><span style={{ color: '#fff' }}>Học Lái Xe Quyết Thắng<small style={{ color: '#6f739a' }}>Đào tạo lái xe · Bình Thuận</small></span>
              </a>
              <p>Đào tạo lái xe mô tô, ô tô, xe tải các hạng tại Bình Thuận. Hơn 18 năm uy tín, học phí trọn gói, tỷ lệ đậu cao.</p>
              <div className="ft-social">
                {SOCIAL.facebook && <a href={SOCIAL.facebook} aria-label="Facebook" target="_blank" rel="noopener">f</a>}
                {SOCIAL.messenger && <a href={SOCIAL.messenger} aria-label="Messenger" target="_blank" rel="noopener">✉</a>}
                {SOCIAL.youtube && <a href={SOCIAL.youtube} aria-label="YouTube" target="_blank" rel="noopener">▶</a>}
                {SOCIAL.tiktok && <a href={SOCIAL.tiktok} aria-label="TikTok" target="_blank" rel="noopener">♪</a>}
                <a href={ZALO} aria-label="Zalo" target="_blank" rel="noopener">Z</a>
              </div>
            </div>
            <div><h4>Khóa học</h4><ul>
              <li><a href="#courses">Hạng B – ô tô con</a></li>
              <li><a href="#courses">Hạng C1 – xe tải nhỏ</a></li>
              <li><a href="#courses">Hạng C – xe tải</a></li>
              <li><a href="#courses">Hạng A1, A – mô tô</a></li>
              <li><a href="#courses">Nâng hạng C, D2</a></li>
            </ul></div>
            <div><h4>Liên kết</h4><ul>
              <li><a href="/tra-cuu">Tra cứu lịch & tiến độ</a></li>
              <li><a href="/dang-ky">Đăng ký & đặt cọc</a></li>
              <li><a href="/thi-thu">Thi thử 600 câu</a></li>
              <li><a href="/cap-nhat-quy-dinh">Cập nhật quy định thi GPLX</a></li>
              <li><a href="/tin-tuc">Tin tức & kinh nghiệm</a></li>
              <li><a href="#faq">Câu hỏi thường gặp</a></li>
            </ul></div>
            <div><h4>Liên hệ</h4>
              <ul>
                <li>📞 <a href={`tel:${PHONE}`}><b style={{ color: '#fff' }}>{PHONE_DISPLAY}</b></a></li>
                {OFFICES.map((o, i) => <li key={i}>📍 {o.address}</li>)}
              </ul>
            </div>
          </div>
          <div className="ft-bottom">
            <span>© {new Date().getFullYear()} Trung tâm Đào tạo Lái xe Quyết Thắng. Mọi quyền được bảo lưu.</span>
            <span className="ft-links">
              <a href="/chinh-sach-bao-mat">Chính sách quyền riêng tư</a>
              <span className="ft-dot">·</span>
              daylaixequyetthang.vn
            </span>
          </div>
        </div>
      </footer>

      {/* STICKY + FLOAT + WHEEL */}
      <div className="sticky-cta">
        <a href="/uu-dai-he" className="c1">🎁 Ưu đãi hè</a>
        <a href="/dang-ky" className="c2">Đăng Ký Ngay</a>
      </div>
      <button className="float-wheel" onClick={() => setWheel(true)} aria-label="Quay số trúng thưởng">🎡</button>

      {/* Cụm nút liên hệ nổi bên phải */}
      <div className="float-contact">
        <a className="fc-btn fc-call" href={`tel:${PHONE}`} aria-label="Gọi điện">
          <span className="fc-ic">📞</span><span className="fc-tip">Gọi ngay</span>
        </a>
        <a className="fc-btn fc-mess" href={MESSENGER} target="_blank" rel="noopener" aria-label="Chat Messenger">
          <span className="fc-ic">💬</span><span className="fc-tip">Messenger</span>
        </a>
        <a className="fc-btn fc-zalo" href={ZALO} target="_blank" rel="noopener" aria-label="Chat Zalo">
          <span className="fc-ic">Zalo</span><span className="fc-tip">Chat Zalo</span>
        </a>
      </div>

      <LuckyWheel open={wheel} onClose={() => setWheel(false)} />
      <ChatBot />
    </>
  );
}
