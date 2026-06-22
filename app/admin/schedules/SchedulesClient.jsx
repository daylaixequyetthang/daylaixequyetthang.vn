'use client';
import { useState } from 'react';

const EMPTY = { kind: 'khai_giang', course: 'Hạng B', title: '', start_date: '', exam_date: '', location: '', slots: 30, registered: 0, status: 'open', note: '' };

export default function SchedulesClient({ initial, connected }) {
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState(null); // null | object
  const [msg, setMsg] = useState('');

  const up = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  async function save() {
    if (!form.title || !form.start_date) { setMsg('⚠️ Cần tiêu đề và ngày.'); return; }
    const r = await fetch('/api/admin/schedules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const d = await r.json();
    if (d.ok) { setMsg('✅ Đã lưu. Tải lại trang để thấy cập nhật.'); setForm(null); }
    else setMsg('❌ ' + (d.error || 'Lỗi'));
  }
  async function del(id) {
    if (!confirm('Xóa lịch này?')) return;
    await fetch('/api/admin/schedules', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setItems((x) => x.filter((i) => i.id !== id));
  }

  return (
    <>
      <div className="adm-h">
        <h1>Lịch khai giảng & thi</h1>
        <button className="btn btn-cta" style={{ padding: '11px 20px' }} onClick={() => setForm({ ...EMPTY })}>+ Thêm lịch</button>
      </div>
      {msg && <div className="adm-card" style={{ marginBottom: 14 }}>{msg}</div>}
      {!connected && <div className="adm-card"><b>⚠️ Chưa kết nối Supabase.</b></div>}

      {form && (
        <div className="adm-card">
          <h3 style={{ marginBottom: 16 }}>{form.id ? 'Sửa lịch' : 'Thêm lịch mới'}</h3>
          <div className="adm-row">
            <div><label className="adm-label">Loại</label>
              <select className="adm-select" value={form.kind} onChange={up('kind')}>
                <option value="khai_giang">Khai giảng</option><option value="thi">Lịch thi</option>
              </select></div>
            <div><label className="adm-label">Khóa</label>
              <select className="adm-select" value={form.course} onChange={up('course')}>
                {['Hạng B', 'Hạng C1', 'Hạng C', 'Hạng A1', 'Hạng A', 'Nâng hạng'].map((c) => <option key={c}>{c}</option>)}
              </select></div>
          </div>
          <label className="adm-label">Tiêu đề</label>
          <input className="adm-input" value={form.title} onChange={up('title')} placeholder="Khai giảng Hạng B khóa tháng 7" />
          <div className="adm-row">
            <div><label className="adm-label">Ngày khai giảng/thi</label><input className="adm-input" type="date" value={form.start_date} onChange={up('start_date')} /></div>
            <div><label className="adm-label">Ngày thi dự kiến (tùy chọn)</label><input className="adm-input" type="date" value={form.exam_date || ''} onChange={up('exam_date')} /></div>
          </div>
          <label className="adm-label">Địa điểm</label>
          <input className="adm-input" value={form.location || ''} onChange={up('location')} placeholder="VP Phan Thiết - 291 Trần Hưng Đạo" />
          <div className="adm-row">
            <div><label className="adm-label">Chỉ tiêu</label><input className="adm-input" type="number" value={form.slots} onChange={up('slots')} /></div>
            <div><label className="adm-label">Đã đăng ký</label><input className="adm-input" type="number" value={form.registered} onChange={up('registered')} /></div>
            <div><label className="adm-label">Trạng thái</label>
              <select className="adm-select" value={form.status} onChange={up('status')}>
                <option value="open">Còn chỗ</option><option value="almost_full">Sắp đầy</option><option value="closed">Đã đóng</option>
              </select></div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-cta" style={{ padding: '11px 22px' }} onClick={save}>Lưu</button>
            <button className="btn" style={{ padding: '11px 22px', background: '#fff', border: '1.5px solid var(--line)' }} onClick={() => setForm(null)}>Hủy</button>
          </div>
        </div>
      )}

      <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="adm-table">
          <thead><tr><th>Loại</th><th>Tiêu đề</th><th>Khóa</th><th>Ngày</th><th>Chỗ</th><th>Trạng thái</th><th></th></tr></thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id}>
                <td><span className="adm-pill new">{s.kind === 'thi' ? 'Thi' : 'Khai giảng'}</span></td>
                <td><b>{s.title}</b></td>
                <td>{s.course}</td>
                <td>{new Date(s.start_date).toLocaleDateString('vi-VN')}</td>
                <td>{s.registered}/{s.slots}</td>
                <td><span className={`adm-pill ${s.status === 'closed' ? 'draft' : s.status === 'almost_full' ? 'new' : 'published'}`}>{s.status === 'closed' ? 'Đóng' : s.status === 'almost_full' ? 'Sắp đầy' : 'Còn chỗ'}</span></td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button className="btn" style={{ padding: '6px 12px', fontSize: '.8rem', background: 'rgba(37,99,255,.1)', color: 'var(--blue)', border: 0, marginRight: 6 }} onClick={() => setForm({ ...s, exam_date: s.exam_date || '' })}>Sửa</button>
                  <button className="seg-del" onClick={() => del(s.id)}>✕</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: 30 }}>Chưa có lịch. Bấm "Thêm lịch".</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
