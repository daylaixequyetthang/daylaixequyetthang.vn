'use client';
import { useState } from 'react';

const STAGES = [
  ['ho_so', 'Hồ sơ'], ['ly_thuyet', 'Lý thuyết'], ['cabin', 'Cabin'],
  ['sa_hinh', 'Sa hình'], ['duong_truong', 'Đường trường'], ['cho_thi', 'Chờ thi'], ['hoan_thanh', 'Hoàn thành'],
];
const EMPTY = { full_name: '', cccd: '', phone: '', course: 'Hạng B', schedule_id: '', stage: 'ho_so', exam_date: '', exam_result: '', note: '' };

export default function StudentsClient({ initial, schedules, connected }) {
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState(null);
  const [q, setQ] = useState('');
  const [msg, setMsg] = useState('');
  const up = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  async function save() {
    if (!form.full_name || (!form.cccd && !form.phone)) { setMsg('⚠️ Cần họ tên và CCCD hoặc SĐT.'); return; }
    const r = await fetch('/api/admin/students', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const d = await r.json();
    if (d.ok) { setMsg('✅ Đã lưu. Tải lại trang để cập nhật danh sách.'); setForm(null); }
    else setMsg('❌ ' + (d.error || 'Lỗi'));
  }
  async function del(id) {
    if (!confirm('Xóa học viên này?')) return;
    await fetch('/api/admin/students', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setItems((x) => x.filter((i) => i.id !== id));
  }

  const shown = q ? items.filter((s) => (s.full_name + s.cccd + s.phone).toLowerCase().includes(q.toLowerCase())) : items;

  return (
    <>
      <div className="adm-h">
        <h1>Học viên & tiến độ</h1>
        <button className="btn btn-cta" style={{ padding: '11px 20px' }} onClick={() => setForm({ ...EMPTY })}>+ Thêm học viên</button>
      </div>
      {msg && <div className="adm-card" style={{ marginBottom: 14 }}>{msg}</div>}
      {!connected && <div className="adm-card"><b>⚠️ Chưa kết nối Supabase.</b><p style={{ color: 'var(--muted)', marginTop: 6 }}>Cần Supabase để học viên tra cứu tiến độ bằng CCCD/SĐT.</p></div>}

      {form && (
        <div className="adm-card">
          <h3 style={{ marginBottom: 16 }}>{form.id ? 'Cập nhật tiến độ' : 'Thêm học viên'}</h3>
          <div className="adm-row">
            <div><label className="adm-label">Họ tên</label><input className="adm-input" value={form.full_name} onChange={up('full_name')} /></div>
            <div><label className="adm-label">CCCD</label><input className="adm-input" value={form.cccd || ''} onChange={up('cccd')} /></div>
            <div><label className="adm-label">SĐT</label><input className="adm-input" value={form.phone || ''} onChange={up('phone')} /></div>
          </div>
          <div className="adm-row">
            <div><label className="adm-label">Khóa</label>
              <select className="adm-select" value={form.course} onChange={up('course')}>{['Hạng B', 'Hạng C1', 'Hạng C', 'Hạng A1', 'Hạng A'].map((c) => <option key={c}>{c}</option>)}</select></div>
            <div><label className="adm-label">Giai đoạn hiện tại</label>
              <select className="adm-select" value={form.stage} onChange={up('stage')}>{STAGES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
          </div>
          <div className="adm-row">
            <div><label className="adm-label">Lịch (tùy chọn)</label>
              <select className="adm-select" value={form.schedule_id || ''} onChange={up('schedule_id')}>
                <option value="">—</option>{schedules.map((s) => <option key={s.id} value={s.id}>{s.course} · {new Date(s.start_date).toLocaleDateString('vi-VN')}</option>)}</select></div>
            <div><label className="adm-label">Ngày thi</label><input className="adm-input" type="date" value={form.exam_date || ''} onChange={up('exam_date')} /></div>
            <div><label className="adm-label">Kết quả thi</label>
              <select className="adm-select" value={form.exam_result || ''} onChange={up('exam_result')}><option value="">Chưa thi</option><option value="dau">Đậu</option><option value="truot">Trượt</option></select></div>
          </div>
          <label className="adm-label">Ghi chú</label>
          <input className="adm-input" value={form.note || ''} onChange={up('note')} placeholder="VD: còn thiếu giấy khám sức khỏe" />
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-cta" style={{ padding: '11px 22px' }} onClick={save}>Lưu</button>
            <button className="btn" style={{ padding: '11px 22px', background: '#fff', border: '1.5px solid var(--line)' }} onClick={() => setForm(null)}>Hủy</button>
          </div>
        </div>
      )}

      <div className="adm-card" style={{ marginBottom: 14 }}>
        <input className="adm-input" style={{ margin: 0 }} value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 Tìm theo tên, CCCD, SĐT..." />
      </div>

      <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="adm-table">
          <thead><tr><th>Họ tên</th><th>CCCD / SĐT</th><th>Khóa</th><th>Giai đoạn</th><th>Kết quả</th><th></th></tr></thead>
          <tbody>
            {shown.map((s) => (
              <tr key={s.id}>
                <td><b>{s.full_name}</b></td>
                <td style={{ fontSize: '.85rem' }}>{s.cccd || ''}<br />{s.phone || ''}</td>
                <td>{s.course}</td>
                <td><span className="adm-pill new">{STAGES.find(([v]) => v === s.stage)?.[1] || s.stage}</span></td>
                <td>{s.exam_result === 'dau' ? <span className="adm-pill won">Đậu</span> : s.exam_result === 'truot' ? <span className="adm-pill draft">Trượt</span> : '—'}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button className="btn" style={{ padding: '6px 12px', fontSize: '.8rem', background: 'rgba(37,99,255,.1)', color: 'var(--blue)', border: 0, marginRight: 6 }} onClick={() => setForm({ ...s, exam_date: s.exam_date || '', schedule_id: s.schedule_id || '' })}>Cập nhật</button>
                  <button className="seg-del" onClick={() => del(s.id)}>✕</button>
                </td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: 30 }}>Chưa có học viên.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
