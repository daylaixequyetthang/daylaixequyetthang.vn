'use client';
import { useState, useRef, useEffect } from 'react';

const GREETING = 'Xin chào! 👋 Mình là trợ lý ảo của Lái Xe Quyết Thắng. Bạn muốn hỏi về học phí, thời gian học, lịch khai giảng hay thủ tục đăng ký?';
const QUICK = ['Học phí hạng B?', 'Học bao lâu thì thi?', 'Trung tâm ở đâu?', 'Thủ tục đăng ký?'];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ from: 'bot', text: GREETING }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [suggestions, setSuggestions] = useState(QUICK);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, typing]);

  async function send(text) {
    const q = (text ?? input).trim();
    if (!q) return;
    setMsgs((m) => [...m, { from: 'user', text: q }]);
    setInput(''); setTyping(true); setSuggestions([]);
    try {
      const r = await fetch('/api/chatbot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: q }) });
      const d = await r.json();
      await new Promise((res) => setTimeout(res, 350));
      setMsgs((m) => [...m, { from: 'bot', text: d.answer }]);
      if (d.suggestions) setSuggestions(d.suggestions);
      // nếu không khớp → gợi ý để lại SĐT
      if (d.matched === false) {
        setMsgs((m) => [...m, { from: 'bot', text: '', cta: true }]);
      }
    } catch {
      setMsgs((m) => [...m, { from: 'bot', text: 'Xin lỗi, có lỗi kết nối. Bạn gọi 084 875 1111 giúp mình nhé!' }]);
    }
    setTyping(false);
  }

  return (
    <>
      <button className={`cb-fab ${open ? 'hide' : ''}`} onClick={() => setOpen(true)} aria-label="Mở trợ lý ảo">
        <span className="cb-fab-ic">💬</span>
        <span className="cb-fab-dot" />
      </button>

      {open && (
        <div className="cb-win">
          <div className="cb-head">
            <div className="cb-head-l">
              <span className="cb-ava">QT</span>
              <div><b>Trợ lý Quyết Thắng</b><span>Thường trả lời ngay</span></div>
            </div>
            <button className="cb-close" onClick={() => setOpen(false)} aria-label="Đóng">×</button>
          </div>

          <div className="cb-body" ref={bodyRef}>
            {msgs.map((m, i) => (
              m.cta ? (
                <div key={i} className="cb-cta">
                  <a href="/dang-ky" className="cb-cta-btn">📝 Để lại thông tin tư vấn</a>
                  <a href="tel:0848751111" className="cb-cta-btn alt">📞 Gọi 084 875 1111</a>
                </div>
              ) : (
                <div key={i} className={`cb-msg ${m.from}`}>{m.text}</div>
              )
            ))}
            {typing && <div className="cb-msg bot cb-typing"><span /><span /><span /></div>}
          </div>

          {suggestions.length > 0 && (
            <div className="cb-quick">
              {suggestions.map((s) => <button key={s} onClick={() => send(s)}>{s}</button>)}
            </div>
          )}

          <div className="cb-input">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Nhập câu hỏi..." />
            <button onClick={() => send()} aria-label="Gửi">➤</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .cb-fab{position:fixed;right:86px;bottom:22px;z-index:58;width:60px;height:60px;border-radius:50%;background:var(--grad-violet);color:#fff;border:0;display:grid;place-items:center;box-shadow:0 14px 30px -8px rgba(123,63,242,.6);cursor:pointer;transition:transform .2s}
        .cb-fab:hover{transform:scale(1.08)}
        .cb-fab.hide{display:none}
        .cb-fab-ic{font-size:1.6rem}
        .cb-fab-dot{position:absolute;top:12px;right:13px;width:11px;height:11px;background:var(--lime);border-radius:50%;border:2px solid #fff;animation:pulseRing 2s infinite}
        .cb-win{position:fixed;right:18px;bottom:18px;z-index:59;width:370px;max-width:calc(100vw - 36px);height:560px;max-height:calc(100vh - 36px);background:#fff;border-radius:22px;box-shadow:0 40px 90px -20px rgba(20,16,60,.5);display:flex;flex-direction:column;overflow:hidden;animation:popIn .3s ease;border:1px solid var(--line)}
        .cb-head{background:var(--grad-hero);color:#fff;padding:16px 18px;display:flex;align-items:center;justify-content:space-between}
        .cb-head-l{display:flex;align-items:center;gap:11px}
        .cb-ava{width:42px;height:42px;border-radius:12px;background:rgba(255,255,255,.2);display:grid;place-items:center;font-family:var(--font-display);font-weight:800}
        .cb-head-l b{display:block;font-family:var(--font-display);font-size:1rem}
        .cb-head-l span{font-size:.78rem;opacity:.85}
        .cb-close{background:rgba(255,255,255,.18);border:0;color:#fff;width:32px;height:32px;border-radius:50%;font-size:1.3rem;cursor:pointer;line-height:1}
        .cb-body{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:10px;background:var(--bg)}
        .cb-msg{max-width:82%;padding:11px 15px;border-radius:16px;font-size:.92rem;line-height:1.5;white-space:pre-wrap}
        .cb-msg.bot{background:#fff;border:1px solid var(--line);color:var(--ink-soft);align-self:flex-start;border-bottom-left-radius:5px}
        .cb-msg.user{background:var(--grad-hero);color:#fff;align-self:flex-end;border-bottom-right-radius:5px}
        .cb-typing{display:flex;gap:4px;align-items:center;width:auto}
        .cb-typing span{width:7px;height:7px;border-radius:50%;background:var(--muted);animation:floaty 1s infinite}
        .cb-typing span:nth-child(2){animation-delay:.15s}.cb-typing span:nth-child(3){animation-delay:.3s}
        .cb-cta{display:flex;flex-direction:column;gap:8px;align-self:flex-start;max-width:82%}
        .cb-cta-btn{background:var(--grad-cta);color:#fff;padding:11px 16px;border-radius:13px;font-weight:700;font-family:var(--font-display);font-size:.88rem;text-align:center}
        .cb-cta-btn.alt{background:#fff;border:1.5px solid var(--coral);color:var(--coral)}
        .cb-quick{display:flex;flex-wrap:wrap;gap:7px;padding:10px 14px;background:#fff;border-top:1px solid var(--line)}
        .cb-quick button{font-size:.8rem;padding:7px 13px;border-radius:999px;border:1.5px solid var(--line);background:var(--bg);color:var(--ink-soft);cursor:pointer;font-family:inherit;transition:all .15s}
        .cb-quick button:hover{border-color:var(--violet);color:var(--violet)}
        .cb-input{display:flex;gap:8px;padding:12px 14px;background:#fff;border-top:1px solid var(--line)}
        .cb-input input{flex:1;padding:11px 14px;border:1.5px solid var(--line);border-radius:999px;font-family:inherit;font-size:.92rem;background:var(--bg)}
        .cb-input input:focus{outline:none;border-color:var(--violet)}
        .cb-input button{width:42px;height:42px;border-radius:50%;background:var(--grad-hero);color:#fff;border:0;cursor:pointer;font-size:1rem;flex:0 0 auto}
        @media(max-width:600px){.cb-fab{bottom:84px;width:54px;height:54px}.cb-win{height:calc(100vh - 90px);bottom:80px}}
      `}</style>
    </>
  );
}
