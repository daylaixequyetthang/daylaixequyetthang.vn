'use client';
import { useState, useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/track';

const PROMO = 'Voucher nghỉ dưỡng Mũi Né 2N1Đ cho 2 người';

// 3 sản phẩm cho trang chuyển đổi
const PRODUCTS = [
  {
    id: 'b-auto',
    cls: 'Hạng B',
    name: 'Số tự động',
    sub: 'Ô tô con đến 8 chỗ',
    price: '15.500.000đ',
    badge: 'Phổ biến nhất',
    color: 'linear-gradient(135deg,#2563ff,#8b2fe6)',
    short: ['Dễ học, dễ đậu', 'Học 2 – 2,5 tháng', 'Phù hợp lái xe gia đình'],
    detail: {
      desc: 'Khóa học lái xe ô tô con số tự động — lựa chọn dễ nhất cho người mới. Không lo chết máy, đề-pa nhẹ nhàng, lái trong phố thoải mái.',
      includes: ['Học phí trọn gói, cam kết không phát sinh', 'Đã gồm xăng, xe tập, sân bãi', 'Học lý thuyết 600 câu + phần mềm ôn thi', 'Thực hành sa hình + đường trường DAT đầy đủ', 'Lệ phí thi tốt nghiệp tại trung tâm'],
      time: '2 – 2,5 tháng', target: 'Người lái xe gia đình, đi làm trong phố',
    },
  },
  {
    id: 'b-manual',
    cls: 'Hạng B',
    name: 'Số cơ khí (số sàn)',
    sub: 'Ô tô con đến 8 chỗ',
    price: '15.500.000đ',
    badge: 'Lái được mọi xe',
    color: 'linear-gradient(135deg,#0ea5e9,#2563ff)',
    short: ['Lái được cả số sàn & tự động', 'Học 2 – 2,5 tháng', 'Linh hoạt khi thuê/mượn xe'],
    detail: {
      desc: 'Khóa học lái xe ô tô con số cơ khí (số sàn). Học khó hơn một chút nhưng lái được mọi loại xe, linh hoạt cho công việc và cuộc sống.',
      includes: ['Học phí trọn gói, cam kết không phát sinh', 'Đã gồm xăng, xe tập, sân bãi', 'Học lý thuyết 600 câu + phần mềm ôn thi', 'Thực hành sa hình + đường trường DAT đầy đủ', 'Lệ phí thi tốt nghiệp tại trung tâm'],
      time: '2 – 2,5 tháng', target: 'Người muốn lái được mọi loại xe',
    },
  },
  {
    id: 'c1',
    cls: 'Hạng C1',
    name: 'Xe tải nhỏ',
    sub: 'Xe tải dưới 7,5 tấn',
    price: '19.000.000đ',
    badge: 'Mở nghề lái xe',
    color: 'linear-gradient(135deg,#27e0a6,#0ea5e9)',
    short: ['Lái xe tải dịch vụ', 'Học 3 – 3,5 tháng', 'Cơ hội nghề nghiệp tốt'],
    detail: {
      desc: 'Khóa học lái xe tải hạng C1 (xe tải dưới 7,5 tấn). Mở ra cơ hội nghề nghiệp lái xe tải, giao hàng, dịch vụ vận chuyển.',
      includes: ['Học phí trọn gói, cam kết không phát sinh', 'Đã gồm xăng, xe tập, sân bãi', 'Học lý thuyết 600 câu + phần mềm ôn thi', 'Thực hành sa hình + đường trường DAT đầy đủ', 'Lệ phí thi tốt nghiệp tại trung tâm'],
      time: '3 – 3,5 tháng', target: 'Người muốn làm nghề lái xe tải',
    },
  },
];

const STEPS = [
  { i: '📝', t: 'Đăng ký & nộp hồ sơ', d: 'Mang CCCD, ảnh thẻ, khám sức khỏe. Trung tâm hỗ trợ hoàn thiện hồ sơ.' },
  { i: '📚', t: 'Học lý thuyết', d: 'Ôn 600 câu hỏi, luyện đề thi thử trên web đến khi chắc chắn.' },
  { i: '🚗', t: 'Học thực hành', d: 'Tập sa hình trong sân + lái đường trường DAT đủ giờ, đủ km.' },
  { i: '🎯', t: 'Thi tốt nghiệp', d: 'Kiểm tra tại trung tâm trước khi dự thi sát hạch.' },
  { i: '🏆', t: 'Thi sát hạch', d: 'Thi lý thuyết, sa hình, đường trường tại sân sát hạch.' },
  { i: '🎫', t: 'Nhận bằng + voucher', d: 'Thi đậu 2-3 ngày có bằng trên VNeTraffic. Nhận voucher nghỉ dưỡng!' },
];

function useCountdown() {
  // Đếm ngược tới cuối tháng hiện tại (tự động, không cần sửa code mỗi tháng).
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      let diff = Math.max(0, Math.floor((end - now) / 1000));
      const d = Math.floor(diff / 86400); diff -= d * 86400;
      const h = Math.floor(diff / 3600); diff -= h * 3600;
      const m = Math.floor(diff / 60); const s = diff - m * 60;
      setLeft({ d, h, m, s });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return left;
}

export default function VoucherClient() {
  const [mode, setMode] = useState(null); // null | 'lead' | 'deposit'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState(PRODUCTS[0].cls + ' – ' + PRODUCTS[0].name);
  const [status, setStatus] = useState('idle');
  const [order, setOrder] = useState(null);
  const [msg, setMsg] = useState('');
  const [popup, setPopup] = useState(null);
  const [seats] = useState(7);
  const left = useCountdown();
  const formRef = useRef(null);

  useEffect(() => { trackEvent('ViewContent', { content_name: PROMO }); }, []);

  function openForm(m, presetCourse) {
    setMode(m); setStatus('idle'); setMsg(''); setOrder(null);
    if (presetCourse) setCourse(presetCourse);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60);
  }

  async function submit(e) {
    e.preventDefault();
    const p = phone.replace(/\s+/g, '');
    if (name.trim().length < 2) { setStatus('err'); setMsg('Vui lòng nhập họ tên.'); return; }
    if (!/^0\d{9,10}$/.test(p)) { setStatus('err'); setMsg('Số điện thoại chưa đúng, vui lòng kiểm tra lại.'); return; }
    setStatus('sending'); setMsg('');

    try {
      if (mode === 'lead') {
        // chỉ để lại SĐT
        const r = await fetch('/api/lead', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone: p, course, source: 'landing_voucher', note: 'Quan tâm ' + PROMO }),
        });
        const d = await r.json();
        if (d.ok) { trackEvent('Lead', { content_name: PROMO }); setStatus('lead_done'); }
        else { setStatus('err'); setMsg(d.error || 'Có lỗi, vui lòng thử lại.'); }
      } else {
        // đặt cọc
        const r = await fetch('/api/enroll', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ full_name: name, phone: p, course, promo: PROMO, source: 'landing_voucher' }),
        });
        const d = await r.json();
        if (d.ok) {
          trackEvent('Lead', { content_name: PROMO });
          trackEvent('InitiateCheckout', { value: d.order?.deposit || 2000000, currency: 'VND' });
          setOrder(d.order); setStatus('deposit_done');
        } else { setStatus('err'); setMsg(d.error || 'Có lỗi, vui lòng thử lại.'); }
      }
    } catch {
      setStatus('err'); setMsg('Không gửi được. Vui lòng gọi 084 875 1111.');
    }
  }

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="lp">
      {/* HERO */}
      <header className="lp-hero">
        <div className="lp-badge">🎁 ƯU ĐÃI CÓ HẠN TRONG THÁNG</div>
        <h1>Học Lái Xe <span>Tặng Du Lịch Hè</span></h1>
        <p className="lp-sub">
          Đăng ký khóa học lái xe tại <b>Quyết Thắng</b> — nhận ngay <b>voucher nghỉ dưỡng 2 ngày 1 đêm
          tại Resort Mũi Né</b> cho 2 người. Vừa có bằng lái, vừa có kỳ nghỉ bên biển!
        </p>

        {/* ẢNH THẬT HERO */}
        <div className="lp-hero-img">
          <img src="/anh/hero.jpg" alt="Học lái xe Quyết Thắng tặng voucher nghỉ dưỡng Mũi Né" />
        </div>

        <div className="lp-hero-cta">
          <button onClick={() => openForm('deposit')} className="lp-btn-main">🎫 Đặt cọc giữ chỗ – Nhận voucher</button>
          <button onClick={() => openForm('lead')} className="lp-btn-ghost">📞 Để lại SĐT tư vấn</button>
        </div>
        <div className="lp-trust"><span>⭐ 18 năm uy tín</span><span>·</span><span>35.000+ học viên</span><span>·</span><span>Bình Thuận</span></div>
      </header>

      {/* COUNTDOWN */}
      <div className="lp-countdown">
        <span className="lp-cd-label">🔥 Ưu đãi voucher kết thúc sau:</span>
        <div className="lp-cd-boxes">
          {[['Ngày', left.d], ['Giờ', left.h], ['Phút', left.m], ['Giây', left.s]].map(([lb, v]) => (
            <div key={lb} className="lp-cd-box"><b>{pad(v)}</b><span>{lb}</span></div>
          ))}
        </div>
        <span className="lp-cd-seats">Chỉ còn <b>{seats}</b> suất nhận voucher</span>
      </div>

      {/* VOUCHER CARD */}
      <section className="lp-sec">
        <div className="lp-voucher">
          <div className="lp-v-left">
            <div className="lp-v-tag">QUÀ TẶNG ĐẶC BIỆT</div>
            <h2>Voucher nghỉ dưỡng Resort Mũi Né</h2>
            <ul className="lp-v-list">
              <li>🏖️ Resort <b>nằm sát biển</b> — bước chân là xuống tắm biển</li>
              <li>🏊 <b>Hồ bơi</b> view biển thư giãn</li>
              <li>🍳 <b>Ăn sáng</b> miễn phí cho 2 người</li>
              <li>🛏️ Nghỉ dưỡng <b>2 ngày 1 đêm</b> trọn vẹn</li>
              <li>👫 Dành cho <b>2 người</b> — đi cùng người thương</li>
            </ul>
            <p className="lp-v-note">
              * Voucher áp dụng ngày thường, không áp dụng cuối tuần, ngày lễ, tết. Voucher trao khi
              hoàn tất đăng ký khóa học. Mỗi học viên nhận 1 voucher.
            </p>
          </div>
          <div className="lp-v-right">
            <div className="lp-v-stamp">FREE</div>
            <p>Tặng kèm khi<br/>đăng ký khóa học</p>
          </div>
        </div>
      </section>

      {/* BẢNG GIÁ 3 SẢN PHẨM */}
      <section className="lp-sec">
        <h2 className="lp-h2">Bảng giá khóa học</h2>
        <p className="lp-h2-sub">Học phí trọn gói — cam kết không phát sinh. Bấm vào khóa để xem chi tiết.</p>
        <div className="lp-products">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="lp-prod">
              <div className="lp-prod-top" style={{ background: p.color }}>
                <span className="lp-prod-badge">{p.badge}</span>
                <div className="lp-prod-cls">{p.cls}</div>
                <div className="lp-prod-name">{p.name}</div>
                <div className="lp-prod-sub">{p.sub}</div>
              </div>
              <div className="lp-prod-body">
                <div className="lp-prod-price">{p.price}<span>/ trọn gói</span></div>
                <ul>{p.short.map((s, i) => <li key={i}>✓ {s}</li>)}</ul>
                <button className="lp-prod-detail" onClick={() => setPopup(p)}>Xem chi tiết</button>
                <button className="lp-prod-cta" onClick={() => openForm('deposit', p.cls + ' – ' + p.name)}>Đặt cọc giữ chỗ</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QUY TRÌNH */}
      <section className="lp-sec">
        <h2 className="lp-h2">Quy trình từ đăng ký đến lấy bằng</h2>
        <div className="lp-steps">
          {STEPS.map((s, i) => (
            <div key={i} className="lp-step">
              <div className="lp-step-i">{s.i}</div>
              <div className="lp-step-num">Bước {i + 1}</div>
              <b>{s.t}</b>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ẢNH HỌC VIÊN ĐÃ ĐĂNG KÝ */}
      <section className="lp-sec">
        <h2 className="lp-h2">Học viên đã tin tưởng Quyết Thắng</h2>
        <div className="lp-gallery">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="lp-gal-item">
              <img src={`/anh/student-${n}.jpg`} alt={`Học viên Quyết Thắng ${n}`} loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* FORM (hiện khi bấm CTA) */}
      {mode && (
        <section className="lp-sec" ref={formRef}>
          <div className="lp-form-wrap">
            {status === 'deposit_done' ? (
              <div className="lp-done">
                <div className="lp-done-ico">✅</div>
                <h2>Đã tạo đơn giữ chỗ!</h2>
                <p>Quét mã QR để đặt cọc <b>{(order.deposit || 2000000).toLocaleString('vi-VN')}đ</b>. Voucher Mũi Né được trao khi hoàn tất.</p>
                <div className="lp-qr"><img src={order.qrUrl} alt="Mã QR chuyển khoản đặt cọc" /></div>
                <div className="lp-pay">
                  <div><span>Ngân hàng</span><b>{order.bank_name}</b></div>
                  <div><span>Số tài khoản</span><b>{order.account_no}</b></div>
                  <div><span>Chủ tài khoản</span><b>{order.account_name}</b></div>
                  <div><span>Nội dung CK</span><b className="hl">{order.addInfo}</b></div>
                  <div><span>Mã đơn</span><b className="hl">{order.code}</b></div>
                </div>
                <p className="lp-done-note">⚠️ Giữ đúng nội dung chuyển khoản để trung tâm xác nhận nhanh. Sau khi chuyển, trung tâm gọi xác nhận và gửi voucher.</p>
                <a href="tel:0848751111" className="lp-btn-ghost dark">📞 Cần hỗ trợ? Gọi 084 875 1111</a>
              </div>
            ) : status === 'lead_done' ? (
              <div className="lp-done">
                <div className="lp-done-ico">🎉</div>
                <h2>Đã nhận thông tin!</h2>
                <p>Cảm ơn bạn. Trung tâm sẽ gọi lại tư vấn trong ít phút. Muốn giữ chỗ ngay và nhận voucher?</p>
                <button className="lp-submit" onClick={() => openForm('deposit', course)}>🎫 Đặt cọc giữ chỗ ngay</button>
              </div>
            ) : (
              <>
                <div className="lp-form-head">
                  <h2>{mode === 'deposit' ? 'Đặt cọc giữ chỗ & nhận voucher' : 'Để lại số điện thoại tư vấn'}</h2>
                  <p>{mode === 'deposit'
                    ? <>Đặt cọc chỉ <b>2.000.000đ</b> (trừ vào học phí) — giữ chỗ + nhận voucher ngay.</>
                    : <>Để lại SĐT, trung tâm gọi tư vấn miễn phí. Chưa cần đặt cọc.</>}</p>
                </div>
                <form className="lp-form" onSubmit={submit}>
                  <label>Họ và tên *</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" />
                  <label>Số điện thoại / Zalo *</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xx xxx xxx" inputMode="tel" />
                  <label>Khóa muốn học *</label>
                  <select value={course} onChange={(e) => setCourse(e.target.value)}>
                    {PRODUCTS.map((p) => <option key={p.id}>{p.cls + ' – ' + p.name}</option>)}
                  </select>
                  <button type="submit" className="lp-submit" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Đang gửi...' : (mode === 'deposit' ? '🎫 Đặt cọc & nhận voucher' : '📞 Gửi yêu cầu tư vấn')}
                  </button>
                  {status === 'err' && <p className="lp-err">{msg}</p>}
                  {mode === 'deposit'
                    ? <p className="lp-form-note">Đặt cọc giữ chỗ được trừ vào học phí. Trung tâm gọi xác nhận trong ít phút.</p>
                    : <p className="lp-form-note">Hoặc bấm <button type="button" className="lp-inline-link" onClick={() => setMode('deposit')}>đặt cọc giữ chỗ ngay</button> để nhận voucher liền.</p>}
                </form>
              </>
            )}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="lp-foot">
        <b>Trung tâm Đào tạo Lái Xe Quyết Thắng</b>
        <p>Hotline / Zalo: <a href="tel:0848751111">084 875 1111</a> · Phan Thiết – La Gi – Bắc Bình, Bình Thuận</p>
        <p className="lp-foot-links"><a href="/">Trang chủ</a> · <a href="/chinh-sach-bao-mat">Chính sách quyền riêng tư</a></p>
        <p className="lp-foot-fine">
          * Chương trình tặng voucher áp dụng có thời hạn, số lượng có hạn. Voucher nghỉ dưỡng áp dụng
          ngày thường, không áp dụng cuối tuần, ngày lễ, tết. Trung tâm có quyền điều chỉnh chương trình.
        </p>
      </footer>

      {/* POPUP CHI TIẾT SẢN PHẨM */}
      {popup && (
        <div className="lp-modal" onClick={() => setPopup(null)}>
          <div className="lp-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="lp-modal-x" onClick={() => setPopup(null)} aria-label="Đóng">✕</button>
            <div className="lp-modal-top" style={{ background: popup.color }}>
              <div className="lp-modal-cls">{popup.cls} – {popup.name}</div>
              <div className="lp-modal-price">{popup.price} <span>/ trọn gói</span></div>
            </div>
            <div className="lp-modal-body">
              <p className="lp-modal-desc">{popup.detail.desc}</p>
              <div className="lp-modal-meta">
                <div><span>⏱️ Thời gian học</span><b>{popup.detail.time}</b></div>
                <div><span>👤 Phù hợp với</span><b>{popup.detail.target}</b></div>
              </div>
              <h4>Học phí đã bao gồm:</h4>
              <ul>{popup.detail.includes.map((x, i) => <li key={i}>✓ {x}</li>)}</ul>
              <button className="lp-submit" onClick={() => { setPopup(null); openForm('deposit', popup.cls + ' – ' + popup.name); }}>
                🎫 Đặt cọc giữ chỗ khóa này
              </button>
              <button className="lp-modal-lead" onClick={() => { setPopup(null); openForm('lead', popup.cls + ' – ' + popup.name); }}>
                Hoặc để lại SĐT tư vấn trước
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STICKY mobile — 2 nút */}
      <div className="lp-sticky">
        <button onClick={() => openForm('lead')} className="lp-sticky-lead">📞 Để lại SĐT</button>
        <button onClick={() => openForm('deposit')} className="lp-sticky-dep">🎫 Đặt cọc</button>
      </div>
    </div>
  );
}
