'use client';
import { useState } from 'react';

const STATUSES = ['Mới', 'Đã gọi', 'Đang tư vấn', 'Đã chốt', 'Không liên hệ được'];
const clsOf = (s) => (s === 'Đã chốt' ? 'won' : s === 'Mới' ? 'new' : 'draft');

export default function LeadsTable({ initial }) {
  const [leads, setLeads] = useState(initial);
  const [filter, setFilter] = useState('all');

  async function setStatus(id, status) {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    await fetch('/api/leads/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
  }

  const shown = filter === 'all' ? leads : leads.filter((l) => (l.status || 'Mới') === filter);

  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', ...STATUSES].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className="btn" style={{
            padding: '8px 16px', fontSize: '.85rem',
            background: filter === f ? 'var(--grad-hero)' : '#fff',
            color: filter === f ? '#fff' : 'var(--ink-soft)',
            border: filter === f ? '0' : '1.5px solid var(--line)',
          }}>
            {f === 'all' ? 'Tất cả' : f}
          </button>
        ))}
      </div>

      <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="adm-table">
          <thead><tr><th>Họ tên</th><th>SĐT</th><th>Nhu cầu</th><th>Khu vực</th><th>Nguồn</th><th>Trạng thái</th><th>Thời gian</th><th>Cập nhật</th></tr></thead>
          <tbody>
            {shown.map((l) => (
              <tr key={l.id}>
                <td>{l.name || '—'}</td>
                <td><a href={`tel:${l.phone}`} style={{ color: 'var(--blue)', fontWeight: 700 }}>{l.phone || '—'}</a></td>
                <td>{l.need || l.course || '—'}</td>
                <td>{l.area || '—'}</td>
                <td><span className="adm-pill new" style={{ fontSize: '.72rem' }}>{l.source || 'Website'}</span></td>
                <td><span className={`adm-pill ${clsOf(l.status)}`}>{l.status || 'Mới'}</span></td>
                <td style={{ fontSize: '.82rem' }}>{l.createdAt ? new Date(l.syncedAt || l.createdAt).toLocaleString('vi-VN') : '—'}</td>
                <td>
                  <select className="adm-select" style={{ margin: 0, padding: '7px 10px', fontSize: '.82rem' }}
                    value={l.status || 'Mới'} onChange={(e) => setStatus(l.id, e.target.value)}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--muted)', padding: 30 }}>Không có lead nào.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
