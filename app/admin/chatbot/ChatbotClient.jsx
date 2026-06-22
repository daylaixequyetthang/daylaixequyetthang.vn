'use client';
import { useState } from 'react';

const EMPTY = { question: '', answer: '', keywords: '', category: 'chung', priority: 5, is_active: true };

export default function ChatbotClient({ initial, connected }) {
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState('');
  const up = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  function edit(it) {
    setForm({ ...it, keywords: Array.isArray(it.keywords) ? it.keywords.join(', ') : it.keywords });
  }

  async function save() {
    if (!form.question || !form.answer) { setMsg('⚠️ Cần câu hỏi và câu trả lời.'); return; }
    const r = await fetch('/api/admin/chatbot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const d = await r.json();
    if (d.ok) { setMsg('✅ Đã lưu. Tải lại trang để cập nhật.'); setForm(null); }
    else setMsg('❌ ' + (d.error || 'Lỗi'));
  }
  async function del(id) {
    if (!confirm('Xóa câu hỏi này?')) return;
    await fetch('/api/admin/chatbot', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setItems((x) => x.filter((i) => i.id !== id));
  }

  return (
    <>
      <div className="adm-h">
        <h1>Trợ lý ảo (Chatbot)</h1>
        <button className="btn btn-cta" style={{ padding: '11px 20px' }} onClick={() => setForm({ ...EMPTY })}>+ Thêm câu hỏi đáp</button>
      </div>
      {msg && <div className="adm-card" style={{ marginBottom: 14 }}>{msg}</div>}
      {!connected && <div className="adm-card" style={{ marginBottom: 14 }}><b>ℹ️ Chưa kết nối Supabase.</b><p style={{ color: 'var(--muted)', marginTop: 6 }}>Chatbot vẫn chạy với bộ câu trả lời mặc định sẵn có. Kết nối Supabase để tự thêm/sửa câu trả lời tại đây.</p></div>}

      <div className="adm-card" style={{ marginBottom: 14 }}>
        <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>💡 Chatbot khớp câu hỏi của khách bằng <b>từ khóa</b>. Mỗi câu nên có nhiều từ khóa cách nhau bởi dấu phẩy (VD: <i>học phí, giá, bao nhiêu tiền</i>). Câu nào nhiều từ khóa trùng + ưu tiên cao sẽ được chọn.</p>
      </div>

      {form && (
        <div className="adm-card">
          <h3 style={{ marginBottom: 16 }}>{form.id ? 'Sửa câu hỏi đáp' : 'Thêm câu hỏi đáp'}</h3>
          <label className="adm-label">Câu hỏi (để tham khảo)</label>
          <input className="adm-input" value={form.question} onChange={up('question')} placeholder="VD: Học phí hạng B bao nhiêu?" />
          <label className="adm-label">Câu trả lời (chatbot sẽ trả lời khách câu này)</label>
          <textarea className="adm-textarea" style={{ minHeight: 110 }} value={form.answer} onChange={up('answer')} placeholder="VD: Học phí Hạng B trọn gói 15.500.000đ..." />
          <label className="adm-label">Từ khóa (cách nhau bởi dấu phẩy)</label>
          <input className="adm-input" value={form.keywords} onChange={up('keywords')} placeholder="học phí, giá, hạng b, bao nhiêu tiền" />
          <div className="adm-row">
            <div><label className="adm-label">Nhóm</label><input className="adm-input" value={form.category} onChange={up('category')} placeholder="hoc_phi" /></div>
            <div><label className="adm-label">Độ ưu tiên (0–10)</label><input className="adm-input" type="number" min="0" max="10" value={form.priority} onChange={up('priority')} /></div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-cta" style={{ padding: '11px 22px' }} onClick={save}>Lưu</button>
            <button className="btn" style={{ padding: '11px 22px', background: '#fff', border: '1.5px solid var(--line)' }} onClick={() => setForm(null)}>Hủy</button>
          </div>
        </div>
      )}

      <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="adm-table">
          <thead><tr><th>Câu hỏi</th><th>Từ khóa</th><th>Ưu tiên</th><th></th></tr></thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td><b>{it.question}</b><br /><span style={{ fontSize: '.82rem', color: 'var(--muted)' }}>{it.answer?.slice(0, 70)}...</span></td>
                <td style={{ fontSize: '.82rem' }}>{(Array.isArray(it.keywords) ? it.keywords : []).join(', ')}</td>
                <td>{it.priority}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button className="btn" style={{ padding: '6px 12px', fontSize: '.8rem', background: 'rgba(37,99,255,.1)', color: 'var(--blue)', border: 0, marginRight: 6 }} onClick={() => edit(it)}>Sửa</button>
                  <button className="seg-del" onClick={() => del(it.id)}>✕</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)', padding: 30 }}>Chưa có câu hỏi đáp tùy chỉnh. Chatbot đang dùng bộ mặc định.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
