'use client';
import { useState } from 'react';
import { trackEvent } from '@/lib/track';

const COURSE_OPTIONS = [
  'Hạng B – số tự động',
  'Hạng B – số cơ khí (số sàn)',
  'Hạng C1 – xe tải dưới 3,5 tấn',
  'Hạng C – xe tải trên 3,5 tấn',
  'Hạng A1 – mô tô',
  'Hạng A – mô tô phân khối lớn',
  'Nâng hạng (lên C / D2)',
  'Chưa rõ – cần tư vấn',
];

export default function LeadForm({ onSpin }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState(COURSE_OPTIONS[0]);
  const [status, setStatus] = useState('idle'); // idle | sending | ok | err
  const [msg, setMsg] = useState('');

  async function submit(e) {
    e.preventDefault();
    const p = phone.replace(/\s+/g, '');
    if (!/^0\d{9,10}$/.test(p)) {
      setStatus('err'); setMsg('Số điện thoại không hợp lệ (VD: 09xxxxxxxx).');
      return;
    }
    setStatus('sending'); setMsg('');
    try {
      const r = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone: p, course, source: 'form' }),
      });
      const d = await r.json();
      if (d.ok) {
        trackEvent('Lead', { content_name: course || 'Tư vấn khóa học' });
        setStatus('ok'); setMsg('Cảm ơn bạn! Trung tâm sẽ gọi lại trong ít phút.');
        setName(''); setPhone('');
      } else {
        setStatus('err'); setMsg(d.error || 'Có lỗi, vui lòng thử lại.');
      }
    } catch {
      setStatus('err'); setMsg('Không gửi được, vui lòng gọi 084 875 1111.');
    }
  }

  return (
    <form className="lf" onSubmit={submit} id="dangky">
      <span className="lf-badge">Tư vấn miễn phí</span>
      <h3>Đăng ký giữ chỗ khóa học</h3>
      <p className="lf-sub">Để lại thông tin, trung tâm gọi lại tư vấn lịch học & học phí trong ít phút.</p>

      <label>Họ và tên</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" />
      <label>Số điện thoại / Zalo</label>
      <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" required placeholder="09xx xxx xxx" />
      <label>Khóa muốn học</label>
      <select value={course} onChange={(e) => setCourse(e.target.value)}>
        {COURSE_OPTIONS.map((c) => <option key={c}>{c}</option>)}
      </select>

      <button className="btn btn-cta" type="submit" style={{ width: '100%', marginTop: 6 }} disabled={status === 'sending'}>
        {status === 'sending' ? 'Đang gửi...' : 'Gửi đăng ký ngay'}
      </button>

      {msg && <p className={`lf-msg ${status}`}>{msg}</p>}

      <button type="button" className="lf-spin" onClick={onSpin}>🎁 Quay số trúng ưu đãi học phí hôm nay</button>
      <p className="lf-fine">Hoặc Zalo trực tiếp: <b>084 875 1111</b> · Tư vấn không mất phí</p>

      <style jsx>{`
        .lf{background:#fff;border-radius:24px;padding:30px;box-shadow:0 40px 80px -30px rgba(20,16,60,.55);position:relative}
        .lf-badge{position:absolute;top:-15px;right:24px;background:var(--grad-cta);color:#fff;font-family:var(--font-display);font-weight:800;font-size:.78rem;padding:8px 16px;border-radius:999px;box-shadow:0 10px 22px -8px rgba(255,93,115,.7)}
        h3{font-size:1.4rem;font-weight:800;color:var(--ink);margin-bottom:6px}
        .lf-sub{color:var(--muted);font-size:.93rem;margin-bottom:18px}
        label{display:block;font-weight:600;font-size:.82rem;color:var(--ink-soft);margin:11px 0 6px}
        input,select{width:100%;padding:13px 14px;border:1.5px solid var(--line);border-radius:12px;font-family:inherit;font-size:.96rem;background:#fafaff;transition:border .15s,box-shadow .15s}
        input:focus,select:focus{outline:none;border-color:var(--blue);box-shadow:0 0 0 4px rgba(37,99,255,.12)}
        .lf-msg{font-size:.86rem;margin-top:12px;text-align:center;padding:10px;border-radius:10px}
        .lf-msg.ok{background:rgba(39,224,166,.14);color:#0a8f63}
        .lf-msg.err{background:rgba(255,93,115,.12);color:#d83a52}
        .lf-spin{display:block;width:100%;text-align:center;margin-top:14px;font-family:var(--font-display);font-weight:700;color:var(--coral);background:none;border:0;font-size:.92rem}
        .lf-spin:hover{text-decoration:underline}
        .lf-fine{font-size:.76rem;color:var(--muted);text-align:center;margin-top:12px}
      `}</style>
    </form>
  );
}
