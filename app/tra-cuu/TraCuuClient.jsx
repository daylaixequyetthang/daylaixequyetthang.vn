'use client';
import { useState, useEffect } from 'react';

export default function TraCuuClient() {
  const [tab, setTab] = useState('lich'); // lich | tien-do
  return (
    <div className="tc">
      <header className="tc-hdr">
        <div className="wrap tc-hdr-in">
          <a href="/" className="tc-back">← Trang chủ</a>
          <b>Tra cứu</b>
          <a href="/dang-ky" className="btn btn-cta" style={{ padding: '10px 18px' }}>Đăng ký học</a>
        </div>
      </header>

      <section className="tc-hero">
        <div className="wrap">
          <span className="eyebrow on-dark">Tra cứu trực tuyến</span>
          <h1>Lịch khai giảng, lịch thi & tiến độ học</h1>
          <p>Xem lịch khai giảng sắp tới hoặc tra cứu tiến độ học của bạn bằng CCCD / số điện thoại.</p>
        </div>
      </section>

      <div className="wrap tc-body">
        <div className="tc-tabs">
          <button className={tab === 'lich' ? 'on' : ''} onClick={() => setTab('lich')}>📅 Lịch khai giảng & thi</button>
          <button className={tab === 'tien-do' ? 'on' : ''} onClick={() => setTab('tien-do')}>🎓 Tiến độ học của tôi</button>
        </div>
        {tab === 'lich' ? <ScheduleView /> : <ProgressView />}
      </div>

      <style jsx>{`
        .tc{min-height:100vh;background:var(--bg)}
        .tc-hdr{position:sticky;top:0;z-index:10;background:rgba(255,255,255,.92);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
        .tc-hdr-in{display:flex;align-items:center;justify-content:space-between;padding:13px 0}
        .tc-hdr b{font-family:var(--font-display);color:var(--ink)}
        .tc-back{font-weight:600;color:var(--blue);display:inline-flex;align-items:center;min-height:44px;padding:4px 0}
        .tc-hero{background:var(--grad-hero);color:#fff;padding:50px 0}
        .tc-hero h1{font-size:clamp(1.7rem,3.4vw,2.4rem);font-weight:800;margin:14px 0 10px}
        .tc-hero p{color:rgba(255,255,255,.9);max-width:560px}
        .tc-body{padding:34px 22px 70px}
        .tc-tabs{display:flex;gap:10px;margin-bottom:24px;flex-wrap:wrap}
        .tc-tabs button{padding:12px 22px;border-radius:999px;border:1.5px solid var(--line);background:#fff;font-family:var(--font-display);font-weight:700;color:var(--ink-soft);font-size:.95rem;transition:all .15s}
        .tc-tabs button.on{background:var(--grad-hero);color:#fff;border-color:transparent}
      `}</style>
    </div>
  );
}

function ScheduleView() {
  const [items, setItems] = useState(null);
  useEffect(() => {
    fetch('/api/schedules').then((r) => r.json()).then((d) => setItems(d.schedules || [])).catch(() => setItems([]));
  }, []);

  if (items === null) return <p style={{ color: 'var(--muted)' }}>Đang tải lịch...</p>;
  if (items.length === 0)
    return (
      <div className="sv-empty">
        <p>Hiện chưa có lịch khai giảng nào được công bố trên hệ thống.</p>
        <p style={{ marginTop: 6 }}>Vui lòng gọi <b>084 875 1111</b> để biết lịch khai giảng gần nhất.</p>
        <style jsx>{`.sv-empty{background:#fff;border:1px solid var(--line);border-radius:16px;padding:34px;text-align:center;color:var(--muted)}`}</style>
      </div>
    );

  const STATUS = {
    open: { t: 'Còn chỗ', c: '#0a8f63', bg: 'rgba(39,224,166,.16)' },
    almost_full: { t: 'Sắp đầy', c: '#d97706', bg: 'rgba(255,176,32,.18)' },
    closed: { t: 'Đã đóng', c: '#6b7191', bg: 'rgba(107,113,145,.16)' },
  };

  return (
    <div className="sv">
      {items.map((s) => {
        const st = STATUS[s.status] || STATUS.open;
        const pct = s.slots ? Math.min(100, Math.round((s.registered / s.slots) * 100)) : 0;
        return (
          <div className="sv-card" key={s.id}>
            <div className="sv-top">
              <span className={`sv-kind ${s.kind}`}>{s.kind === 'thi' ? '📝 Lịch thi' : '📅 Khai giảng'}</span>
              <span className="sv-status" style={{ color: st.c, background: st.bg }}>{st.t}</span>
            </div>
            <h3>{s.title}</h3>
            <div className="sv-meta">
              <div><span>Khóa</span><b>{s.course}</b></div>
              <div><span>Ngày {s.kind === 'thi' ? 'thi' : 'khai giảng'}</span><b>{fmt(s.start_date)}</b></div>
              {s.exam_date && <div><span>Dự kiến thi</span><b>{fmt(s.exam_date)}</b></div>}
            </div>
            {s.location && <p className="sv-loc">📍 {s.location}</p>}
            {s.kind !== 'thi' && s.slots > 0 && (
              <div className="sv-slots">
                <div className="sv-bar"><div style={{ width: `${pct}%`, background: pct > 80 ? 'var(--grad-cta)' : 'var(--grad-mint)' }} /></div>
                <span>{s.registered}/{s.slots} chỗ</span>
              </div>
            )}
            {s.status !== 'closed' && <a href="/dang-ky" className="btn btn-blue sv-cta">Đăng ký khóa này</a>}
          </div>
        );
      })}
      <style jsx>{`
        .sv{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}
        .sv-card{background:#fff;border:1px solid var(--line);border-radius:18px;padding:24px;transition:transform .2s,box-shadow .2s}
        .sv-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-soft)}
        .sv-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
        .sv-kind{font-family:var(--font-display);font-weight:700;font-size:.82rem;color:var(--violet)}
        .sv-status{font-weight:700;font-size:.78rem;padding:4px 12px;border-radius:999px}
        .sv-card h3{font-size:1.15rem;font-weight:700;color:var(--ink);margin-bottom:14px}
        .sv-meta{display:flex;gap:20px;flex-wrap:wrap;margin-bottom:12px}
        .sv-meta span{display:block;font-size:.74rem;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}
        .sv-meta b{font-family:var(--font-display);color:var(--ink);font-size:1.02rem}
        .sv-loc{color:var(--ink-soft);font-size:.9rem;margin-bottom:14px}
        .sv-slots{display:flex;align-items:center;gap:12px;margin-bottom:16px}
        .sv-bar{flex:1;height:8px;background:var(--line);border-radius:999px;overflow:hidden}
        .sv-bar div{height:100%;border-radius:999px;transition:width .4s}
        .sv-slots span{font-size:.82rem;font-weight:600;color:var(--muted);white-space:nowrap}
        .sv-cta{width:100%}
        @media(max-width:720px){.sv{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}

function ProgressView() {
  const [q, setQ] = useState('');
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function lookup() {
    if (q.replace(/\s+/g, '').length < 8) { setErr('Nhập CCCD (12 số) hoặc số điện thoại.'); return; }
    setErr(''); setLoading(true); setRes(null);
    try {
      const r = await fetch('/api/lookup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ q }) });
      const d = await r.json();
      if (!d.ok) setErr(d.error || 'Không tra cứu được.');
      else setRes(d);
    } catch { setErr('Lỗi kết nối, vui lòng thử lại.'); }
    setLoading(false);
  }

  return (
    <div className="pv">
      <div className="pv-search">
        <h3>Tra cứu tiến độ học</h3>
        <p>Nhập số CCCD hoặc số điện thoại đã đăng ký để xem bạn đang ở giai đoạn nào.</p>
        <div className="pv-row">
          <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && lookup()} placeholder="CCCD hoặc số điện thoại" inputMode="numeric" />
          <button className="btn btn-cta" onClick={lookup} disabled={loading}>{loading ? 'Đang tra...' : 'Tra cứu'}</button>
        </div>
        {err && <p className="pv-err">{err}</p>}
      </div>

      {res && res.found === false && <div className="pv-notfound">{res.message}</div>}

      {res && res.found && (
        <div className="pv-result">
          <div className="pv-head">
            <div><span>Học viên</span><b>{res.student.name}</b></div>
            <div><span>Khóa học</span><b>{res.student.course || '—'}</b></div>
            {res.student.examDate && <div><span>Ngày thi dự kiến</span><b>{fmt(res.student.examDate)}</b></div>}
          </div>

          <div className="pv-progress">
            <div className="pv-pct"><b>{res.student.progress}%</b> hoàn thành lộ trình</div>
            <div className="pv-bar"><div style={{ width: `${res.student.progress}%` }} /></div>
          </div>

          <div className="pv-stages">
            {res.student.stages.map((s, i) => {
              const done = i < res.student.stageIndex;
              const now = i === res.student.stageIndex;
              return (
                <div key={s.key} className={`pv-stage ${done ? 'done' : ''} ${now ? 'now' : ''}`}>
                  <span className="pv-dot">{done ? '✓' : i + 1}</span>
                  <span className="pv-label">{s.label}</span>
                  {now && <span className="pv-badge">Đang ở đây</span>}
                </div>
              );
            })}
          </div>

          {res.student.examResult && (
            <div className={`pv-exam ${res.student.examResult === 'dau' ? 'pass' : 'fail'}`}>
              Kết quả thi: <b>{res.student.examResult === 'dau' ? '🎉 ĐẬU' : 'Chưa đậu — sẽ sắp xếp thi lại'}</b>
            </div>
          )}
          {res.student.note && <p className="pv-note">📌 {res.student.note}</p>}
          <p className="pv-help">Thông tin chưa đúng? Gọi <b>084 875 1111</b> để được hỗ trợ.</p>
        </div>
      )}

      <style jsx>{`
        .pv-search{background:#fff;border:1px solid var(--line);border-radius:18px;padding:28px;margin-bottom:18px}
        .pv-search h3{font-size:1.2rem;font-weight:800;color:var(--ink);margin-bottom:6px}
        .pv-search p{color:var(--muted);font-size:.92rem;margin-bottom:16px}
        .pv-row{display:flex;gap:10px}
        .pv-row input{flex:1;padding:14px 16px;border:1.5px solid var(--line);border-radius:12px;font-size:1rem;font-family:inherit;background:#fafaff}
        .pv-row input:focus{outline:none;border-color:var(--blue)}
        .pv-err{color:#d83a52;font-size:.86rem;margin-top:10px}
        .pv-notfound{background:rgba(255,176,32,.12);border:1px solid rgba(255,176,32,.4);border-radius:14px;padding:20px;color:#8a5a00}
        .pv-result{background:#fff;border:1px solid var(--line);border-radius:18px;padding:28px}
        .pv-head{display:flex;gap:28px;flex-wrap:wrap;padding-bottom:20px;border-bottom:1px solid var(--line);margin-bottom:20px}
        .pv-head span{display:block;font-size:.74rem;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}
        .pv-head b{font-family:var(--font-display);font-size:1.15rem;color:var(--ink)}
        .pv-progress{margin-bottom:24px}
        .pv-pct{font-size:.95rem;color:var(--ink-soft);margin-bottom:8px}
        .pv-pct b{font-family:var(--font-display);font-size:1.4rem;color:var(--violet)}
        .pv-bar{height:12px;background:var(--line);border-radius:999px;overflow:hidden}
        .pv-bar div{height:100%;background:var(--grad-cta);border-radius:999px;transition:width .6s}
        .pv-stages{display:flex;flex-direction:column;gap:4px;margin-bottom:18px}
        .pv-stage{display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:12px;position:relative}
        .pv-stage.done{opacity:.7}
        .pv-stage.now{background:linear-gradient(135deg,rgba(91,61,245,.08),rgba(255,93,115,.06))}
        .pv-dot{width:30px;height:30px;border-radius:50%;background:var(--line);color:var(--muted);display:grid;place-items:center;font-weight:800;font-size:.85rem;flex:0 0 auto;font-family:var(--font-display)}
        .pv-stage.done .pv-dot{background:var(--lime);color:#fff}
        .pv-stage.now .pv-dot{background:var(--grad-hero);color:#fff}
        .pv-label{font-weight:600;color:var(--ink-soft)}
        .pv-stage.now .pv-label{color:var(--ink)}
        .pv-badge{margin-left:auto;font-size:.74rem;font-weight:700;color:var(--violet);background:rgba(139,47,230,.12);padding:4px 10px;border-radius:999px}
        .pv-exam{padding:14px 18px;border-radius:12px;margin-bottom:14px;font-weight:600}
        .pv-exam.pass{background:rgba(39,224,166,.14);color:#0a8f63}
        .pv-exam.fail{background:rgba(255,176,32,.14);color:#8a5a00}
        .pv-note{background:var(--bg);border-radius:10px;padding:12px 14px;color:var(--ink-soft);font-size:.9rem;margin-bottom:14px}
        .pv-help{color:var(--muted);font-size:.86rem}
      `}</style>
    </div>
  );
}

function fmt(d) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
  catch { return d; }
}
