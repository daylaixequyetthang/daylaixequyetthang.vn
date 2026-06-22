'use client';
import { useState } from 'react';

const PAY = {
  pending: { t: 'Chờ thanh toán', cls: 'new' },
  paid: { t: 'Đã cọc', cls: 'won' },
  cancelled: { t: 'Đã hủy', cls: 'draft' },
};

export default function EnrollmentsClient({ initial, connected }) {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState('all');

  async function setStatus(id, pay_status) {
    setItems((x) => x.map((i) => (i.id === id ? { ...i, pay_status } : i)));
    await fetch('/api/admin/enrollments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, pay_status }) });
  }

  const shown = filter === 'all' ? items : items.filter((i) => i.pay_status === filter);
  const totalPaid = items.filter((i) => i.pay_status === 'paid').reduce((a, i) => a + (i.deposit_amount || 0), 0);

  return (
    <>
      <div className="adm-h"><h1>Đơn đặt cọc</h1><span style={{ color: 'var(--muted)' }}>Đã thu cọc: <b style={{ color: 'var(--ink)' }}>{totalPaid.toLocaleString('vi-VN')}đ</b></span></div>
      {!connected && <div className="adm-card"><b>⚠️ Chưa kết nối Supabase.</b><p style={{ color: 'var(--muted)', marginTop: 6 }}>Đơn cọc vẫn báo về Telegram, nhưng cần Supabase để quản lý tại đây.</p></div>}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', 'pending', 'paid', 'cancelled'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className="btn" style={{ padding: '8px 16px', fontSize: '.85rem', background: filter === f ? 'var(--grad-hero)' : '#fff', color: filter === f ? '#fff' : 'var(--ink-soft)', border: filter === f ? 0 : '1.5px solid var(--line)' }}>
            {f === 'all' ? 'Tất cả' : PAY[f].t}
          </button>
        ))}
      </div>

      <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="adm-table">
          <thead><tr><th>Mã đơn</th><th>Họ tên</th><th>SĐT</th><th>Khóa</th><th>Cọc</th><th>Trạng thái</th><th>Thời gian</th><th>Thao tác</th></tr></thead>
          <tbody>
            {shown.map((e) => (
              <tr key={e.id}>
                <td><b style={{ color: 'var(--violet)' }}>{e.code}</b></td>
                <td>{e.full_name}</td>
                <td><a href={`tel:${e.phone}`} style={{ color: 'var(--blue)', fontWeight: 700 }}>{e.phone}</a></td>
                <td style={{ fontSize: '.85rem' }}>{e.course}</td>
                <td><b>{(e.deposit_amount || 0).toLocaleString('vi-VN')}đ</b></td>
                <td><span className={`adm-pill ${PAY[e.pay_status]?.cls || 'new'}`}>{PAY[e.pay_status]?.t || e.pay_status}</span></td>
                <td style={{ fontSize: '.8rem' }}>{new Date(e.created_at).toLocaleString('vi-VN')}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  {e.pay_status !== 'paid' && <button className="btn" style={{ padding: '6px 12px', fontSize: '.8rem', background: 'rgba(39,224,166,.16)', color: '#0a8f63', border: 0, marginRight: 6 }} onClick={() => setStatus(e.id, 'paid')}>✓ Đã cọc</button>}
                  {e.pay_status !== 'cancelled' && <button className="btn" style={{ padding: '6px 12px', fontSize: '.8rem', background: 'rgba(255,93,115,.14)', color: '#d83a52', border: 0 }} onClick={() => setStatus(e.id, 'cancelled')}>Hủy</button>}
                </td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--muted)', padding: 30 }}>Chưa có đơn cọc nào.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
