'use client';
import { useState } from 'react';

export default function SettingsClient({ wheel, banners, social, connected }) {
  const [segs, setSegs] = useState(wheel.segments || []);
  const [bans, setBans] = useState(banners.items || []);
  const [soc, setSoc] = useState(social || {});
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState('');

  const totalWeight = segs.reduce((a, s) => a + Number(s.weight || 0), 0);

  function pct(w) {
    return totalWeight ? ((Number(w) / totalWeight) * 100).toFixed(1) : '0';
  }
  function updSeg(i, k, v) { setSegs((s) => s.map((x, j) => (j === i ? { ...x, [k]: v } : x))); }
  function addSeg() { setSegs((s) => [...s, { label: 'Ưu đãi mới', weight: 10, color: '#2563ff' }]); }
  function delSeg(i) { setSegs((s) => s.filter((_, j) => j !== i)); }

  async function saveKey(key, value) {
    if (!connected) { setMsg('⚠️ Chưa kết nối Supabase — không lưu được.'); return; }
    setSaving(key); setMsg('');
    try {
      const r = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      const d = await r.json();
      setMsg(d.ok ? '✅ Đã lưu thành công!' : '❌ ' + (d.error || 'Lỗi'));
    } catch { setMsg('❌ Lỗi kết nối'); }
    setSaving('');
  }

  return (
    <>
      <div className="adm-h"><h1>Vòng quay & Banner</h1>{msg && <span style={{ fontWeight: 600 }}>{msg}</span>}</div>
      {!connected && <div className="adm-card" style={{ marginBottom: 18 }}><b>⚠️ Chưa kết nối Supabase.</b><p style={{ color: 'var(--muted)', marginTop: 6 }}>Bạn xem được giao diện nhưng cần Supabase để lưu thay đổi.</p></div>}

      {/* VÒNG QUAY */}
      <div className="adm-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3>🎡 Tỷ lệ trúng vòng quay</h3>
          <button className="btn btn-cta" style={{ padding: '10px 18px' }} disabled={saving === 'wheel'} onClick={() => saveKey('wheel', { enabled: true, segments: segs.map((s) => ({ ...s, weight: Number(s.weight) })) })}>
            {saving === 'wheel' ? 'Đang lưu...' : 'Lưu vòng quay'}
          </button>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '.9rem', marginBottom: 16 }}>
          Tỷ lệ trúng = trọng số ÷ tổng trọng số. Trọng số càng cao càng dễ ra. Tổng hiện tại: <b>{totalWeight}</b>.
        </p>
        {segs.map((s, i) => (
          <div className="wheel-seg" key={i}>
            <input type="color" className="sw" style={{ border: 0, padding: 0, height: 30 }} value={s.color} onChange={(e) => updSeg(i, 'color', e.target.value)} />
            <input className="adm-input" style={{ margin: 0 }} value={s.label} onChange={(e) => updSeg(i, 'label', e.target.value)} placeholder="Tên phần thưởng" />
            <input className="adm-input" style={{ margin: 0 }} type="number" min="0" value={s.weight} onChange={(e) => updSeg(i, 'weight', e.target.value)} placeholder="Trọng số" />
            <span style={{ fontWeight: 700, color: 'var(--violet)', textAlign: 'center' }}>{pct(s.weight)}%</span>
            <button className="seg-del" onClick={() => delSeg(i)}>✕</button>
          </div>
        ))}
        <button className="btn" style={{ marginTop: 8, padding: '10px 18px', background: 'var(--bg)', border: '1.5px dashed var(--violet)', color: 'var(--violet)' }} onClick={addSeg}>+ Thêm ô phần thưởng</button>
      </div>

      {/* BANNER */}
      <div className="adm-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3>📢 Banner chạy (marquee đầu trang)</h3>
          <button className="btn btn-cta" style={{ padding: '10px 18px' }} disabled={saving === 'banners'} onClick={() => saveKey('banners', { items: bans.filter((b) => b.text?.trim()) })}>
            {saving === 'banners' ? 'Đang lưu...' : 'Lưu banner'}
          </button>
        </div>
        {bans.map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
            <input className="adm-input" style={{ margin: 0 }} value={b.text} onChange={(e) => setBans((x) => x.map((y, j) => (j === i ? { ...y, text: e.target.value } : y)))} />
            <button className="seg-del" onClick={() => setBans((x) => x.filter((_, j) => j !== i))}>✕</button>
          </div>
        ))}
        <button className="btn" style={{ marginTop: 6, padding: '10px 18px', background: 'var(--bg)', border: '1.5px dashed var(--coral)', color: 'var(--coral)' }} onClick={() => setBans((x) => [...x, { text: '', active: true }])}>+ Thêm banner</button>
      </div>

      {/* SOCIAL */}
      <div className="adm-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3>🔗 Link mạng xã hội</h3>
          <button className="btn btn-cta" style={{ padding: '10px 18px' }} disabled={saving === 'social'} onClick={() => saveKey('social', soc)}>
            {saving === 'social' ? 'Đang lưu...' : 'Lưu link'}
          </button>
        </div>
        {['facebook', 'youtube', 'tiktok', 'zalo', 'phone'].map((k) => (
          <div key={k}>
            <label className="adm-label" style={{ textTransform: 'capitalize' }}>{k}</label>
            <input className="adm-input" value={soc[k] || ''} onChange={(e) => setSoc((s) => ({ ...s, [k]: e.target.value }))} placeholder={k === 'phone' ? '0848751111' : `https://...`} />
          </div>
        ))}
      </div>
    </>
  );
}
