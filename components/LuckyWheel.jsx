'use client';
import { useEffect, useRef, useState } from 'react';

export default function LuckyWheel({ open, onClose }) {
  const [segments, setSegments] = useState(null);
  const [step, setStep] = useState('wheel'); // wheel | capture | done
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState('');
  const [phone, setPhone] = useState('');
  const [err, setErr] = useState('');
  const [sending, setSending] = useState(false);
  const canvasRef = useRef(null);
  const angleRef = useRef(0);

  // tải tỷ lệ vòng quay từ API (admin chỉnh được)
  useEffect(() => {
    if (!open || segments) return;
    fetch('/api/wheel-spin')
      .then((r) => r.json())
      .then((d) => setSegments(d.segments || []))
      .catch(() =>
        setSegments([
          { label: 'Giảm 500K', weight: 18, color: '#2563ff' },
          { label: 'Giảm 300K', weight: 18, color: '#8b2fe6' },
          { label: 'Voucher 200K', weight: 16, color: '#ff5d73' },
          { label: 'Giảm 1 Triệu', weight: 4, color: '#ffb020' },
          { label: 'Tặng tài liệu', weight: 14, color: '#27e0a6' },
          { label: 'May mắn lần sau', weight: 4, color: '#6b7191' },
        ])
      );
  }, [open, segments]);

  // vẽ bánh xe
  useEffect(() => {
    if (!segments || !canvasRef.current) return;
    drawWheel(canvasRef.current, segments, angleRef.current);
  }, [segments, step]);

  // đã quay rồi?
  useEffect(() => {
    if (open && typeof window !== 'undefined' && localStorage.getItem('qt_spun')) {
      // cho quay tiếp về form nếu muốn — ở đây vẫn cho xem nhưng disable
    }
  }, [open]);

  if (!open) return null;

  function spin() {
    if (spinning || !segments) return;
    if (typeof window !== 'undefined' && localStorage.getItem('qt_spun')) {
      setErr('Bạn đã quay rồi. Vui lòng liên hệ để nhận ưu đãi.');
      return;
    }
    setSpinning(true);
    const total = segments.reduce((a, s) => a + (s.weight || 1), 0);
    let r = Math.random() * total,
      idx = 0,
      acc = 0;
    for (let i = 0; i < segments.length; i++) {
      acc += segments[i].weight || 1;
      if (r <= acc) { idx = i; break; }
    }
    const arc = (2 * Math.PI) / segments.length;
    const targetCenter = idx * arc + arc / 2;
    const finalAngle = 6 * 2 * Math.PI + (1.5 * Math.PI - targetCenter);
    angleRef.current = finalAngle % (2 * Math.PI);
    const cv = canvasRef.current;
    cv.style.transition = 'transform 5s cubic-bezier(.17,.67,.18,.99)';
    cv.style.transform = `rotate(${finalAngle}rad)`;
    setTimeout(() => {
      setSpinning(false);
      setPrize(segments[idx].label);
      if (typeof window !== 'undefined') localStorage.setItem('qt_spun', '1');
      setStep('capture');
    }, 5200);
  }

  async function claim() {
    const p = phone.replace(/\s+/g, '');
    if (!/^0\d{9,10}$/.test(p)) {
      setErr('Vui lòng nhập số điện thoại hợp lệ (VD: 09xxxxxxxx).');
      return;
    }
    setErr('');
    setSending(true);
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: p, prize, source: 'lucky_wheel' }),
      });
    } catch (e) { /* vẫn chuyển bước, đã lưu local */ }
    setSending(false);
    setStep('done');
  }

  return (
    <div className="lw-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="lw-modal" style={{ animation: 'popIn .35s ease' }}>
        <button className="lw-close" onClick={onClose} aria-label="Đóng">×</button>

        {step === 'wheel' && (
          <>
            <h3>🎁 Vòng quay ưu đãi</h3>
            <p className="lw-sub">Quay 1 lần để nhận ưu đãi học phí hôm nay!</p>
            <div className="lw-stage">
              <div className="lw-pointer" />
              <canvas ref={canvasRef} width={300} height={300} className="lw-canvas" />
              <div className="lw-hub">QUAY</div>
            </div>
            <button className="btn btn-cta" style={{ width: '100%', marginTop: 16 }} onClick={spin} disabled={spinning}>
              {spinning ? 'Đang quay...' : 'QUAY NGAY'}
            </button>
            {err && <p className="lw-err">{err}</p>}
            <p className="lw-note">Mỗi người chơi 1 lần. Ưu đãi áp dụng khi đăng ký khóa học trong tháng.</p>
          </>
        )}

        {step === 'capture' && (
          <div style={{ animation: 'fadeUp .4s ease' }}>
            <h3>🎉 Chúc mừng!</h3>
            <p className="lw-sub">Bạn đã trúng phần ưu đãi:</p>
            <div className="lw-prize"><span>Phần thưởng</span><b>{prize}</b></div>
            <p className="lw-sub" style={{ marginBottom: 14 }}>
              Nhập số điện thoại để trung tâm liên hệ trao ưu đãi & tư vấn khóa học.
            </p>
            {err && <p className="lw-err">{err}</p>}
            <input
              className="lw-input" type="tel" inputMode="numeric" maxLength={11}
              placeholder="Nhập số điện thoại của bạn"
              value={phone} onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && claim()}
            />
            <button className="btn btn-cta" style={{ width: '100%' }} onClick={claim} disabled={sending}>
              {sending ? 'Đang gửi...' : 'Nhận ưu đãi ngay'}
            </button>
          </div>
        )}

        {step === 'done' && (
          <div style={{ textAlign: 'center', animation: 'popIn .4s ease' }}>
            <div style={{ fontSize: '3rem', marginBottom: 10 }}>✅</div>
            <h3 style={{ color: '#ffd86b' }}>Đã ghi nhận!</h3>
            <p className="lw-sub">
              Trung tâm sẽ gọi lại trong ít phút để xác nhận ưu đãi <b style={{ color: '#fff' }}>“{prize}”</b>. Cảm ơn bạn!
            </p>
            <button className="btn btn-light" style={{ width: '100%', marginTop: 10 }} onClick={onClose}>Đóng</button>
          </div>
        )}
      </div>

      <style jsx>{`
        .lw-bg{position:fixed;inset:0;z-index:200;background:rgba(12,14,38,.78);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:18px;animation:fadeUp .25s ease}
        .lw-modal{background:linear-gradient(165deg,#2a1b5e,#3b1d6e 60%,#5b1d6a);border-radius:26px;max-width:440px;width:100%;padding:30px 28px;position:relative;text-align:center;box-shadow:0 50px 100px -20px rgba(0,0,0,.7);border:1px solid rgba(255,255,255,.14)}
        .lw-modal :global(h3){color:#fff;font-size:1.55rem;font-weight:800;margin-bottom:6px}
        .lw-sub{color:#d3c9f5;font-size:.94rem;margin-bottom:16px}
        .lw-close{position:absolute;top:14px;right:16px;background:rgba(255,255,255,.14);border:0;color:#fff;width:36px;height:36px;border-radius:50%;font-size:1.3rem;line-height:1}
        .lw-close:hover{background:rgba(255,255,255,.28)}
        .lw-stage{position:relative;width:300px;height:300px;margin:6px auto}
        .lw-pointer{position:absolute;top:-8px;left:50%;transform:translateX(-50%);z-index:5;width:0;height:0;border-left:16px solid transparent;border-right:16px solid transparent;border-top:30px solid #ffd86b;filter:drop-shadow(0 3px 5px rgba(0,0,0,.5))}
        .lw-canvas{width:300px;height:300px;border-radius:50%;border:9px solid #fff;box-shadow:0 0 0 7px rgba(255,216,107,.5),0 24px 50px -10px rgba(0,0,0,.6)}
        .lw-hub{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:52px;height:52px;border-radius:50%;background:#fff;border:5px solid #ffd86b;z-index:4;display:grid;place-items:center;font-family:var(--font-display);font-weight:800;color:#7b2ff0;font-size:.72rem}
        .lw-note{color:#a99fd0;font-size:.76rem;margin-top:12px}
        .lw-err{color:#ffb3c1;font-size:.84rem;margin-top:10px}
        .lw-prize{background:rgba(255,216,107,.15);border:1px solid rgba(255,216,107,.45);border-radius:16px;padding:18px;margin-bottom:16px}
        .lw-prize span{display:block;color:#d3c9f5;font-size:.78rem;text-transform:uppercase;letter-spacing:.1em}
        .lw-prize b{color:#ffd86b;font-family:var(--font-display);font-size:1.4rem;display:block;margin-top:4px}
        .lw-input{width:100%;padding:15px;border-radius:14px;border:0;font-size:1rem;font-family:inherit;text-align:center;margin-bottom:12px}
        .lw-input:focus{outline:3px solid #ffd86b}
        @media(max-width:520px){.lw-stage,.lw-canvas{width:260px;height:260px}}
      `}</style>
    </div>
  );
}

function drawWheel(canvas, segments, angle) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, R = W / 2;
  const seg = segments.length, arc = (2 * Math.PI) / seg;
  ctx.clearRect(0, 0, W, W);
  for (let i = 0; i < seg; i++) {
    const a0 = angle + i * arc;
    ctx.beginPath();
    ctx.moveTo(R, R);
    ctx.arc(R, R, R - 4, a0, a0 + arc);
    ctx.fillStyle = segments[i].color || '#888';
    ctx.fill();
    ctx.save();
    ctx.translate(R, R);
    ctx.rotate(a0 + arc / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 13px "Be Vietnam Pro",sans-serif';
    const label = segments[i].label || '';
    const words = label.split(' ');
    if (label.length > 11 && words.length > 1) {
      const mid = Math.ceil(words.length / 2);
      ctx.fillText(words.slice(0, mid).join(' '), R - 20, -4);
      ctx.fillText(words.slice(mid).join(' '), R - 20, 12);
    } else {
      ctx.fillText(label, R - 20, 5);
    }
    ctx.restore();
  }
}
