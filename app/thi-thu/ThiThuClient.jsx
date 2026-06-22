'use client';
import { useEffect, useMemo, useState } from 'react';
import { QUESTIONS, EXAM_CONFIG, EXAM_STRUCTURES } from '@/lib/questions';

// Bốc đề đúng cấu trúc 1 hạng: đủ số câu mỗi chủ đề + đúng 1 câu điểm liệt.
function buildExam(struct) {
  const byTopic = {};
  for (const q of QUESTIONS) (byTopic[q.topic] ||= []).push(q);
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const chosen = [];
  const usedIds = new Set();

  // 1 câu điểm liệt trước (ưu tiên lấy từ nhóm quy tắc vì phần lớn điểm liệt ở đó)
  const critPool = shuffle(QUESTIONS.filter((q) => q.critical));
  if (critPool.length) { chosen.push(critPool[0]); usedIds.add(critPool[0].id); }

  // các chủ đề theo số lượng quy định (loại trừ câu điểm liệt để mỗi đề chỉ có đúng 1)
  for (const [topic, count] of Object.entries(struct.topics)) {
    const pool = shuffle((byTopic[topic] || []).filter((q) => !usedIds.has(q.id) && !q.critical));
    let need = count;
    // nếu câu điểm liệt đã lấy thuộc topic này thì bớt 1
    if (chosen[0] && chosen[0].topic === topic) need = Math.max(0, need - 1);
    for (let i = 0; i < need && i < pool.length; i++) { chosen.push(pool[i]); usedIds.add(pool[i].id); }
  }
  // bù cho đủ tổng nếu thiếu (cũng tránh câu điểm liệt)
  if (chosen.length < struct.total) {
    const rest = shuffle(QUESTIONS.filter((q) => !usedIds.has(q.id) && !q.critical));
    for (const q of rest) { if (chosen.length >= struct.total) break; chosen.push(q); usedIds.add(q.id); }
  }
  return shuffle(chosen).slice(0, struct.total);
}

export default function ThiThuClient() {
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState('exam'); // exam | study
  const [hang, setHang] = useState('B');
  const [answers, setAnswers] = useState({});
  const [cur, setCur] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const struct = EXAM_STRUCTURES[hang] || EXAM_STRUCTURES.B;
  const [time, setTime] = useState(struct.durationSec);

  const quiz = useMemo(() => {
    if (mode === 'study') {
      return [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 60);
    }
    return buildExam(struct);
  }, [started, mode, hang]);

  useEffect(() => {
    if (!started || submitted || mode !== 'exam') return;
    if (time <= 0) { setSubmitted(true); return; }
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [started, submitted, time, mode]);

  const correct = quiz.filter((q) => answers[q.id] === q.answer).length;
  const failedCritical = quiz.some((q) => q.critical && answers[q.id] !== undefined && answers[q.id] !== q.answer);
  const passed = correct >= struct.pass && !failedCritical;

  function pick(qid, idx) {
    if (submitted) return;
    setAnswers((a) => ({ ...a, [qid]: idx }));
    if (mode === 'exam' && cur < quiz.length - 1) setTimeout(() => setCur((c) => c + 1), 150);
  }
  function reset() {
    setStarted(false); setSubmitted(false); setAnswers({}); setCur(0); setTime(struct.durationSec);
  }

  const mm = String(Math.floor(time / 60)).padStart(2, '0');
  const ss = String(time % 60).padStart(2, '0');
  const q = quiz[cur];

  return (
    <div className="tt">
      <header className="tt-hdr">
        <a href="/" className="tt-back">← Trang chủ</a>
        <b>Thi thử GPLX — 600 câu</b>
        {started && mode === 'exam' && !submitted && <span className={`tt-time ${time < 60 ? 'low' : ''}`}>⏱ {mm}:{ss}</span>}
      </header>

      {!started && (
        <div className="tt-intro">
          <h1>📝 Thi thử lý thuyết GPLX</h1>
          <p>Bộ 600 câu hỏi sát hạch chính thức của Cục CSGT (áp dụng từ 01/6/2025). Chọn hạng và chế độ để bắt đầu.</p>

          <div className="tt-hang">
            <span className="tt-hang-lb">Chọn hạng thi:</span>
            <div className="tt-hang-btns">
              {Object.entries(EXAM_STRUCTURES).map(([k, v]) => (
                <button key={k} className={`tt-hbtn ${hang === k ? 'on' : ''}`} onClick={() => setHang(k)}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div className="tt-modes">
            <button className="tt-mode" onClick={() => { setMode('exam'); setTime(struct.durationSec); setStarted(true); }}>
              <b>🎯 Thi thử (tính giờ)</b>
              <span>{struct.total} câu · {Math.round(struct.durationSec / 60)} phút · cần đúng ≥{struct.pass} câu · đúng cấu trúc đề thật</span>
            </button>
            <button className="tt-mode alt" onClick={() => { setMode('study'); setStarted(true); }}>
              <b>📖 Ôn tập (xem đáp án)</b>
              <span>Hiện đáp án ngay sau khi chọn, không giới hạn thời gian</span>
            </button>
          </div>
          <p className="tt-note">⚠️ Câu có gắn nhãn <b style={{ color: '#ff5d73' }}>ĐIỂM LIỆT</b>: sai 1 câu là trượt cả bài. Mỗi đề thi luôn có 1 câu điểm liệt.</p>
        </div>
      )}

      {started && !submitted && q && (
        <div className="tt-quiz">
          <div className="tt-progress"><div style={{ width: `${((cur + 1) / quiz.length) * 100}%` }} /></div>
          <div className="tt-meta">
            <span>Câu {cur + 1}/{quiz.length}</span>
            <span className="tt-topic">{q.topic}{q.critical && <b className="tt-crit"> · ĐIỂM LIỆT</b>}</span>
          </div>
          <h2 className="tt-q">{q.q}</h2>
          {q.image && (
            <div className="tt-img">
              <img src={q.image} alt="Hình minh họa câu hỏi" loading="lazy" />
              <span className="tt-img-wm">daylaixequyetthang.vn · ☎ 084 875 1111</span>
            </div>
          )}
          <div className="tt-opts">
            {q.options.map((opt, idx) => {
              const chosen = answers[q.id] === idx;
              const showAns = mode === 'study' && answers[q.id] !== undefined;
              const isRight = idx === q.answer;
              let cls = 'tt-opt';
              if (chosen) cls += ' chosen';
              if (showAns && isRight) cls += ' right';
              if (showAns && chosen && !isRight) cls += ' wrong';
              return (
                <button key={idx} className={cls} onClick={() => pick(q.id, idx)}>
                  <span className="tt-letter">{String.fromCharCode(65 + idx)}</span>{opt}
                </button>
              );
            })}
          </div>
          <div className="tt-nav">
            <button className="btn-nav" disabled={cur === 0} onClick={() => setCur((c) => c - 1)}>← Câu trước</button>
            {cur < quiz.length - 1
              ? <button className="btn-nav main" onClick={() => setCur((c) => c + 1)}>Câu sau →</button>
              : <button className="btn-nav main" onClick={() => setSubmitted(true)}>Nộp bài</button>}
          </div>
          <div className="tt-grid-nav">
            {quiz.map((qq, i) => (
              <button key={qq.id} className={`gn ${answers[qq.id] !== undefined ? 'done' : ''} ${i === cur ? 'now' : ''}`} onClick={() => setCur(i)}>{i + 1}</button>
            ))}
          </div>
        </div>
      )}

      {submitted && (
        <div className="tt-result">
          <div className={`tt-badge ${passed ? 'pass' : 'fail'}`}>{passed ? '🎉 ĐẠT' : '❌ CHƯA ĐẠT'}</div>
          <h2>Đúng {correct}/{quiz.length} câu</h2>
          {failedCritical && <p className="tt-crit-msg">Bạn đã sai câu điểm liệt — trượt bài thi.</p>}
          <p className="tt-sub">{passed ? 'Tuyệt vời! Bạn đã sẵn sàng. Đăng ký khóa học để được cấp bằng nhé.' : 'Cần ôn thêm. Chế độ "Ôn tập" giúp bạn xem đáp án từng câu.'}</p>
          <div className="tt-result-cta">
            <button className="btn btn-blue" onClick={reset}>Làm lại</button>
            <a className="btn btn-cta" href="/#dangky">Đăng ký học ngay</a>
          </div>
        </div>
      )}

      <style jsx>{`
        .tt{min-height:100vh;background:var(--grad-soft)}
        .tt-hdr{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;padding:14px 22px;background:rgba(255,255,255,.9);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
        .tt-hdr b{font-family:var(--font-display);color:var(--ink)}
        .tt-back{font-weight:600;color:var(--blue);display:inline-flex;align-items:center;min-height:44px;padding:4px 0}
        .tt-time{font-family:var(--font-display);font-weight:800;color:var(--violet);background:rgba(139,47,230,.1);padding:5px 12px;border-radius:999px}
        .tt-time.low{color:#fff;background:var(--coral);animation:pulseRing 1s infinite}
        .tt-intro{max-width:680px;margin:0 auto;padding:56px 22px;text-align:center}
        .tt-intro h1{font-size:2rem;font-weight:800;margin-bottom:10px}
        .tt-intro p{color:var(--muted);margin-bottom:26px}
        .tt-hang{margin-bottom:20px}
        .tt-hang-lb{display:block;font-weight:700;color:var(--ink);margin-bottom:10px;font-size:.95rem}
        .tt-hang-btns{display:flex;flex-wrap:wrap;gap:10px}
        .tt-hbtn{padding:12px 18px;min-height:46px;border-radius:12px;border:1.5px solid var(--line);background:#fff;color:var(--ink-soft);font-weight:600;font-size:.92rem;cursor:pointer;transition:all .15s}
        .tt-hbtn.on{background:var(--grad-hero);color:#fff;border-color:transparent}
        .tt-modes{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:22px}
        .tt-mode{background:var(--grad-hero);color:#fff;border:0;border-radius:18px;padding:24px;text-align:left;transition:transform .18s;box-shadow:var(--shadow-soft)}
        .tt-mode.alt{background:var(--grad-mint)}
        .tt-mode:hover{transform:translateY(-4px)}
        .tt-mode b{display:block;font-size:1.1rem;font-family:var(--font-display);margin-bottom:6px}
        .tt-mode span{font-size:.84rem;opacity:.92}
        .tt-note{font-size:.86rem;color:var(--muted)}
        .tt-quiz{max-width:720px;margin:0 auto;padding:26px 22px 60px}
        .tt-progress{height:7px;background:var(--line);border-radius:999px;overflow:hidden;margin-bottom:16px}
        .tt-progress div{height:100%;background:var(--grad-cta);transition:width .3s}
        .tt-meta{display:flex;justify-content:space-between;font-size:.82rem;color:var(--muted);margin-bottom:12px}
        .tt-topic{font-weight:600}
        .tt-crit{color:var(--coral)}
        .tt-q{font-size:1.3rem;font-weight:700;color:var(--ink);margin-bottom:22px;line-height:1.4}
        .tt-img{position:relative;margin:0 0 22px;border-radius:14px;overflow:hidden;border:1px solid var(--line);background:#fff}
        .tt-img img{width:100%;max-height:300px;object-fit:contain;display:block}
        .tt-img-wm{position:absolute;right:6px;bottom:6px;background:rgba(20,16,60,.72);color:#fff;font-size:.68rem;font-weight:600;padding:3px 8px;border-radius:6px;letter-spacing:.2px;pointer-events:none}
        .tt-opts{display:flex;flex-direction:column;gap:12px}
        .tt-opt{display:flex;gap:14px;align-items:flex-start;text-align:left;background:#fff;border:1.5px solid var(--line);border-radius:14px;padding:16px 18px;font-size:.98rem;color:var(--ink-soft);transition:all .15s}
        .tt-opt:hover{border-color:var(--blue)}
        .tt-opt.chosen{border-color:var(--blue);background:rgba(37,99,255,.06)}
        .tt-opt.right{border-color:var(--lime);background:rgba(39,224,166,.1);color:#0a8f63}
        .tt-opt.wrong{border-color:var(--coral);background:rgba(255,93,115,.08);color:#d83a52}
        .tt-letter{width:28px;height:28px;border-radius:8px;background:var(--bg);display:grid;place-items:center;font-family:var(--font-display);font-weight:800;flex:0 0 auto;font-size:.85rem}
        .tt-nav{display:flex;gap:12px;margin-top:24px}
        .btn-nav{flex:1;padding:14px;border-radius:13px;border:1.5px solid var(--line);background:#fff;font-family:var(--font-display);font-weight:700;color:var(--ink-soft)}
        .btn-nav.main{background:var(--grad-hero);color:#fff;border:0}
        .btn-nav:disabled{opacity:.4}
        .tt-grid-nav{display:flex;flex-wrap:wrap;gap:8px;margin-top:24px}
        .gn{width:36px;height:36px;border-radius:9px;border:1.5px solid var(--line);background:#fff;font-weight:700;color:var(--muted)}
        .gn.done{background:rgba(37,99,255,.12);color:var(--blue);border-color:transparent}
        .gn.now{background:var(--grad-cta);color:#fff;border-color:transparent}
        .tt-result{max-width:560px;margin:0 auto;padding:56px 22px;text-align:center}
        .tt-badge{display:inline-block;font-family:var(--font-display);font-weight:800;font-size:1.1rem;padding:10px 24px;border-radius:999px;margin-bottom:18px}
        .tt-badge.pass{background:rgba(39,224,166,.16);color:#0a8f63}
        .tt-badge.fail{background:rgba(255,93,115,.14);color:#d83a52}
        .tt-result h2{font-size:1.8rem;font-weight:800;margin-bottom:8px}
        .tt-crit-msg{color:var(--coral);font-weight:600;margin-bottom:8px}
        .tt-sub{color:var(--muted);margin-bottom:24px}
        .tt-result-cta{display:flex;gap:12px;justify-content:center}
        @media(max-width:560px){.tt-modes{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}
