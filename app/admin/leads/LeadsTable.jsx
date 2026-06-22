'use client';
import { useState } from 'react';

const STATUS = {
  new: { label: 'Mới', cls: 'new' },
  contacted: { label: 'Đã gọi', cls: 'draft' },
  won: { label: 'Đã chốt', cls: 'won' },
  lost: { label: 'Không liên hệ được', cls: 'draft' },
};

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

  const shown = filter === 'all' ? leads : leads.filter((l) => l.status === filter);

  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', 'new', 'contacted', 'won', 'lost'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className="btn" style={{
            padding: '8px 16px', fontSize: '.85rem',
            background: filter === f ? 'var(--grad-hero)' : '#fff',
            color: filter === f ? '#fff' : 'var(--ink-soft)',
            border: filter === f ? '0' : '1.5px solid var(--line)',
          }}>
            {f === 'all' ? 'Tất cả' : STATUS[f].label}
          </button>
        ))}
      </div>

      <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="adm-table">
          <thead><tr><th>Họ tên</th><th>SĐT</th><th>Khóa / Quà</th><th>Nguồn</th><th>Trạng thái</th><th>Thời gian</th><th>Thao tác</th></tr></thead>
          <tbody>
            {shown.map((l) => (
              <tr key={l.id}>
                <td>{l.name || '—'}</td>
                <td><a href={`tel:${l.phone}`} style={{ color: 'var(--blue)', fontWeight: 700 }}>{l.phone}</a></td>
                <td>{l.course || l.prize || '—'}</td>
                <td><span className="adm-pill new">{l.source}</span></td>
                <td><span className={`adm-pill ${STATUS[l.status]?.cls || 'new'}`}>{STATUS[l.status]?.label || l.status}</span></td>
                <td style={{ fontSize: '.82rem' }}>{new Date(l.created_at).toLocaleString('vi-VN')}</td>
                <td>
                  <select className="adm-select" style={{ margin: 0, padding: '7px 10px', fontSize: '.82rem' }}
                    value={l.status} onChange={(e) => setStatus(l.id, e.target.value)}>
                    <option value="new">Mới</option>
                    <option value="contacted">Đã gọi</option>
                    <option value="won">Đã chốt</option>
                    <option value="lost">Không LH được</option>
                  </select>
                </td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: 30 }}>Không có lead nào.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
