'use client';
import { useState, useEffect } from 'react';
import { trackEvent } from '@/lib/track';

const COURSES = [
  { v: 'Hạng B – số tự động', deposit: 2000000 },
  { v: 'Hạng B – số cơ khí (số sàn)', deposit: 2000000 },
  { v: 'Hạng C1 – xe tải dưới 3,5 tấn', deposit: 3000000 },
  { v: 'Hạng C – xe tải trên 3,5 tấn', deposit: 3000000 },
  { v: 'Hạng A1 – mô tô', deposit: 500000 },
  { v: 'Hạng A – mô tô phân khối lớn', deposit: 1000000 },
  { v: 'Nâng hạng (lên C / D2)', deposit: 2000000 },
];

export default function DangKyClient() {
  const [f, setF] = useState({ full_name: '', phone: '', cccd: '', course: COURSES[0].v, schedule_id: '' });
  const [schedules, setSchedules] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetch('/api/schedules?kind=khai_giang').then((r) => r.json()).then((d) => setSchedules(d.schedules || [])).catch(() => {});
  }, []);

  const up = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const deposit = COURSES.find((c) => c.v === f.course)?.deposit || 2000000;

  async function submit() {
    if (!f.full_name.trim()) { setErr('Vui lòng nhập họ tên.'); return; }
    if (!/^0\d{9,10}$/.test(f.phone.replace(/\s+/g, ''))) { setErr('Số điện thoại không hợp lệ.'); return; }
    setErr(''); setLoading(true);
    try {
      const r = await fetch('/api/enroll', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, deposit_amount: deposit }),
      });
      const d = await r.json();
      if (d.ok) {
        trackEvent('Lead', { content_name: 'Đặt cọc giữ chỗ' });
        trackEvent('InitiateCheckout', { value: d.order?.deposit || 2000000, currency: 'VND' });
        setOrder(d.order);
      }
      else setErr(d.error || 'Có lỗi, vui lòng thử lại.');
    } catch { setErr('Lỗi kết nối, vui lòng gọi 084 875 1111.'); }
    setLoading(false);
  }

  return (
    <div className="dk">
      <header className="dk-hdr">
        <div className="wrap dk-hdr-in">
          <a href="/" className="dk-back">← Trang chủ</a>
          <b>Đăng ký online</b>
          <a href="/tra-cuu" className="dk-link">Tra cứu lịch</a>
        </div>
      </header>

      <div className="wrap dk-body">
        {!order ? (
          <div className="dk-grid">
            <div className="dk-form">
              <span className="eyebrow">Đăng ký giữ chỗ</span>
              <h1>Đăng ký & đặt cọc online</h1>
              <p className="dk-sub">Điền thông tin và đặt cọc giữ chỗ qua mã QR. Cọc được trừ vào học phí khi nhập học.</p>

              <label>Họ và tên *</label>
              <input value={f.full_name} onChange={up('full_name')} placeholder="Nguyễn Văn A" />
              <label>Số điện thoại *</label>
              <input value={f.phone} onChange={up('phone')} type="tel" inputMode="numeric" placeholder="09xx xxx xxx" />
              <label>Số CCCD (để tra cứu tiến độ sau này)</label>
              <input value={f.cccd} onChange={up('cccd')} inputMode="numeric" placeholder="0xx xxx xxx xxx" />
              <label>Khóa học *</label>
              <select value={f.course} onChange={up('course')}>
                {COURSES.map((c) => <option key={c.v} value={c.v}>{c.v}</option>)}
              </select>
              <label>Chọn lịch khai giảng (tùy chọn)</label>
              <select value={f.schedule_id} onChange={up('schedule_id')}>
                <option value="">— Để trung tâm tư vấn —</option>
                {schedules.map((s) => <option key={s.id} value={s.id}>{s.course} · {new Date(s.start_date).toLocaleDateString('vi-VN')} · {s.location}</option>)}
              </select>

              {err && <p className="dk-err">{err}</p>}
              <button className="btn btn-cta" style={{ width: '100%', marginTop: 8 }} onClick={submit} disabled={loading}>
                {loading ? 'Đang tạo đơn...' : `Đặt cọc ${deposit.toLocaleString('vi-VN')}đ giữ chỗ`}
              </button>
              <p className="dk-fine">Bằng việc đăng ký, bạn đồng ý để trung tâm liên hệ tư vấn. Cọc giữ chỗ được trừ vào học phí.</p>
            </div>

            <aside className="dk-side">
              <div className="dk-info">
                <h3>💡 Vì sao nên đặt cọc online?</h3>
                <ul>
                  <li><b>Giữ chỗ ngay</b> trong khóa sắp khai giảng, không lo hết chỗ.</li>
                  <li><b>Cọc trừ vào học phí</b> — không mất thêm chi phí.</li>
                  <li><b>Bảo lưu tối đa 1 năm</b> nếu chưa sắp xếp được lịch học.</li>
                  <li>Quét QR chuyển khoản, <b>không cần đến văn phòng</b>.</li>
                </ul>
                <div className="dk-hot">Cần hỗ trợ? Gọi/Zalo <b>084 875 1111</b></div>
              </div>
            </aside>
          </div>
        ) : (
          <OrderQR order={order} />
        )}
      </div>

      <style jsx>{`
        .dk{min-height:100vh;background:var(--bg)}
        .dk-hdr{position:sticky;top:0;z-index:10;background:rgba(255,255,255,.92);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
        .dk-hdr-in{display:flex;align-items:center;justify-content:space-between;padding:13px 0}
        .dk-hdr b{font-family:var(--font-display);color:var(--ink)}
        .dk-back{font-weight:600;color:var(--blue);display:inline-flex;align-items:center;min-height:44px;padding:4px 0}
        .dk-link{font-weight:600;color:var(--violet);display:inline-flex;align-items:center;min-height:44px;padding:4px 0}
        .dk-body{padding:36px 22px 70px}
        .dk-grid{display:grid;grid-template-columns:1.4fr 1fr;gap:28px;align-items:start}
        .dk-form{background:#fff;border:1px solid var(--line);border-radius:20px;padding:32px}
        .dk-form h1{font-size:1.7rem;font-weight:800;color:var(--ink);margin:12px 0 8px}
        .dk-sub{color:var(--muted);margin-bottom:22px}
        .dk-form label{display:block;font-weight:600;font-size:.84rem;color:var(--ink-soft);margin:14px 0 6px}
        .dk-form input,.dk-form select{width:100%;padding:13px 14px;border:1.5px solid var(--line);border-radius:12px;font-family:inherit;font-size:.96rem;background:#fafaff}
        .dk-form input:focus,.dk-form select:focus{outline:none;border-color:var(--blue)}
        .dk-err{color:#d83a52;font-size:.86rem;margin-top:12px}
        .dk-fine{font-size:.78rem;color:var(--muted);margin-top:12px;text-align:center}
        .dk-info{background:var(--grad-violet);color:#fff;border-radius:20px;padding:28px;position:sticky;top:90px}
        .dk-info h3{font-size:1.15rem;margin-bottom:16px}
        .dk-info ul{list-style:none;display:flex;flex-direction:column;gap:13px;margin-bottom:20px}
        .dk-info li{font-size:.93rem;line-height:1.5;padding-left:26px;position:relative;opacity:.95}
        .dk-info li::before{content:"✓";position:absolute;left:0;font-weight:800;color:#ffd86b}
        .dk-hot{background:rgba(255,255,255,.16);border-radius:12px;padding:14px;text-align:center;font-size:.9rem}
        @media(max-width:820px){.dk-grid{grid-template-columns:1fr}.dk-info{position:static}}
      `}</style>
    </div>
  );
}

function OrderQR({ order }) {
  return (
    <div className="oq">
      <div className="oq-card">
        <div className="oq-badge">✅ Đã tạo đơn giữ chỗ</div>
        <h2>Quét mã QR để đặt cọc</h2>
        <p className="oq-sub">Mở app ngân hàng → quét mã → nội dung và số tiền đã điền sẵn.</p>

        <div className="oq-qr">
          <img src={order.qrUrl} alt="Mã QR chuyển khoản" />
        </div>

        <div className="oq-info">
          <div className="oq-row"><span>Số tiền cọc</span><b>{order.deposit.toLocaleString('vi-VN')}đ</b></div>
          <div className="oq-row"><span>Ngân hàng</span><b>{order.bank_name}</b></div>
          <div className="oq-row"><span>Số tài khoản</span><b>{order.account_no}</b></div>
          <div className="oq-row"><span>Chủ tài khoản</span><b>{order.account_name}</b></div>
          <div className="oq-row hi"><span>Nội dung CK</span><b>{order.addInfo}</b></div>
          <div className="oq-row"><span>Mã đơn của bạn</span><b>{order.code}</b></div>
        </div>

        <div className="oq-note">
          ⚠️ Vui lòng giữ <b>đúng nội dung chuyển khoản</b> để trung tâm xác nhận nhanh. Sau khi chuyển, trung tâm sẽ gọi xác nhận trong ít phút.
        </div>

        <div className="oq-cta">
          <a href="/" className="btn btn-blue">Về trang chủ</a>
          <a href="/tra-cuu" className="btn btn-light">Tra cứu lịch học</a>
        </div>
      </div>

      <style jsx>{`
        .oq{max-width:520px;margin:0 auto}
        .oq-card{background:#fff;border:1px solid var(--line);border-radius:22px;padding:32px;text-align:center;box-shadow:var(--shadow-soft)}
        .oq-badge{display:inline-block;background:rgba(39,224,166,.16);color:#0a8f63;font-weight:700;font-size:.85rem;padding:7px 16px;border-radius:999px;margin-bottom:16px}
        .oq-card h2{font-size:1.5rem;font-weight:800;color:var(--ink);margin-bottom:6px}
        .oq-sub{color:var(--muted);margin-bottom:22px;font-size:.93rem}
        .oq-qr{display:flex;justify-content:center;margin-bottom:22px}
        .oq-qr img{width:260px;height:260px;border-radius:18px;border:1px solid var(--line);background:#fff}
        .oq-info{background:var(--bg);border-radius:14px;padding:18px;margin-bottom:18px}
        .oq-row{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--line);font-size:.92rem;text-align:left;gap:14px}
        .oq-row:last-child{border:0}
        .oq-row span{color:var(--muted)}
        .oq-row b{font-family:var(--font-display);color:var(--ink);text-align:right}
        .oq-row.hi b{color:var(--coral)}
        .oq-note{background:rgba(255,176,32,.1);border-radius:12px;padding:14px;font-size:.86rem;color:#8a5a00;margin-bottom:20px;text-align:left}
        .oq-cta{display:flex;gap:12px;justify-content:center}
      `}</style>
    </div>
  );
}
