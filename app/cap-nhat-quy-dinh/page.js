import './capnhat.css';

export const metadata = {
  title: 'Cập nhật quy định thi GPLX mới nhất 2025 - 2027 | Bộ đề lý thuyết Bộ Công an | Lái Xe Quyết Thắng',
  description:
    'Cập nhật quy định thi sát hạch giấy phép lái xe (GPLX) mới nhất của Bộ Công an: bộ 600 câu hỏi lý thuyết áp dụng từ 01/6/2025 và thông tin dự kiến điều chỉnh bộ đề lý thuyết (50 câu hỏi) trong thời gian tới. Trung tâm Lái Xe Quyết Thắng Bình Thuận cập nhật liên tục.',
  keywords:
    '50 câu hỏi lý thuyết, bộ đề 50 câu, 600 câu hỏi lý thuyết, thi GPLX, sát hạch lái xe, Bộ Công an, Cục CSGT, quy định thi bằng lái mới, bộ đề lý thuyết 2027, học lái xe Bình Thuận, daylaixequyetthang',
  alternates: { canonical: 'https://daylaixequyetthang.vn/cap-nhat-quy-dinh' },
  openGraph: {
    title: 'Cập nhật quy định thi GPLX mới nhất - Bộ đề lý thuyết Bộ Công an',
    description:
      'Bộ 600 câu hỏi lý thuyết của Bộ Công an áp dụng từ 01/6/2025 và thông tin dự kiến điều chỉnh bộ đề (50 câu hỏi) sắp tới. Cập nhật bởi Trung tâm Lái Xe Quyết Thắng.',
    url: 'https://daylaixequyetthang.vn/cap-nhat-quy-dinh',
    type: 'article',
  },
};

export const revalidate = 3600;

export default function CapNhatQuyDinh() {
  const updated = '2025';
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Hiện thi lý thuyết GPLX bao nhiêu câu?',
        acceptedAnswer: { '@type': 'Answer', text: 'Hiện tại bộ đề chuẩn là 600 câu hỏi áp dụng từ 01/6/2025. Mỗi đề sát hạch chọn ngẫu nhiên theo hạng: hạng B 30 câu, C1 35 câu, C 40 câu, nâng hạng 45 câu, luôn có 1 câu điểm liệt.' },
      },
      {
        '@type': 'Question',
        name: 'Bộ đề 50 câu hỏi lý thuyết mới khi nào áp dụng?',
        acceptedAnswer: { '@type': 'Answer', text: 'Thông tin về việc rút gọn bộ đề lý thuyết xuống khoảng 50 câu (dự kiến năm 2027) hiện đang được tham khảo và chưa có quy định chính thức từ Bộ Công an. Trung tâm sẽ cập nhật ngay khi có văn bản chính thức.' },
      },
      {
        '@type': 'Question',
        name: 'Học ở Quyết Thắng có được cập nhật bộ đề mới không?',
        acceptedAnswer: { '@type': 'Answer', text: 'Có. Trung tâm Đào tạo Lái Xe Quyết Thắng (Bình Thuận) luôn cập nhật bộ đề lý thuyết theo quy định mới nhất của Bộ Công an. Liên hệ hotline 084 875 1111 để được tư vấn.' },
      },
    ],
  };
  return (
    <div className="cn">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <header className="cn-hdr">
        <a href="/" className="cn-back">← Trang chủ</a>
        <b>Cập nhật quy định</b>
        <a href="/dang-ky" className="cn-cta">Đăng ký học</a>
      </header>

      <article className="cn-wrap">
        <span className="cn-tag">CẬP NHẬT QUY ĐỊNH THI GPLX</span>
        <h1>Quy định thi sát hạch giấy phép lái xe (GPLX) mới nhất của Bộ Công an</h1>
        <p className="cn-lead">
          Trung tâm Đào tạo Lái Xe Quyết Thắng (Bình Thuận) cập nhật các quy định thi sát hạch lái xe
          cơ giới đường bộ mới nhất theo Cục Cảnh sát giao thông – Bộ Công an, để học viên luôn ôn tập
          đúng bộ đề đang có hiệu lực.
        </p>

        <section className="cn-card cn-now">
          <h2>📌 Đang áp dụng: Bộ 600 câu hỏi lý thuyết (từ 01/6/2025)</h2>
          <p>
            Hiện nay, kỳ thi sát hạch lý thuyết GPLX trên toàn quốc áp dụng <b>bộ 600 câu hỏi</b> do
            Cục Cảnh sát giao thông – Bộ Công an ban hành (Công văn 2262/CSGT-P5 ngày 07/5/2025),
            chính thức có hiệu lực từ ngày <b>01/6/2025</b>. Bộ đề gồm 600 câu chia thành 6 chương,
            trong đó có <b>60 câu hỏi điểm liệt</b> – sai 1 câu là trượt phần lý thuyết.
          </p>
          <p>
            Trung tâm Quyết Thắng đã tích hợp <b>đầy đủ 600 câu hỏi chính thức kèm hình ảnh biển báo,
            sa hình và đáp án</b> vào phần thi thử trực tuyến, đúng cấu trúc đề thi từng hạng (B, C1, C
            và nâng hạng).
          </p>
          <a href="/thi-thu" className="cn-btn">🎯 Thi thử 600 câu miễn phí ngay</a>
        </section>

        <section className="cn-card cn-future">
          <h2>🔔 Dự kiến điều chỉnh bộ đề lý thuyết trong thời gian tới</h2>
          <p>
            Theo một số thông tin đang được tham khảo, bộ đề thi lý thuyết GPLX có thể được{' '}
            <b>điều chỉnh, rút gọn còn khoảng 50 câu hỏi lý thuyết</b> trong giai đoạn tới (dự kiến
            khoảng năm 2027). Đây là thông tin mang tính tham khảo, <b>chưa phải quy định chính thức</b>.
          </p>
          <p>
            Trung tâm Lái Xe Quyết Thắng sẽ <b>cập nhật ngay lập tức</b> khi Bộ Công an / Cục Cảnh sát
            giao thông ban hành quy định chính thức về <b>bộ 50 câu hỏi lý thuyết mới</b>, đồng thời
            đưa bộ đề mới vào phần thi thử để học viên ôn tập kịp thời. Nội dung chi tiết của bộ đề mới
            hiện <b>đang được cập nhật</b>.
          </p>
          <p className="cn-noti">
            ✅ Học viên đăng ký tại Quyết Thắng luôn được học và thi thử theo bộ đề <b>mới nhất, đang
            có hiệu lực</b> tại thời điểm thi – không lo học nhầm bộ đề cũ.
          </p>
        </section>

        <section className="cn-faq">
          <h2>Câu hỏi thường gặp về quy định thi GPLX mới</h2>

          <div className="cn-q">
            <h3>Hiện thi lý thuyết GPLX bao nhiêu câu?</h3>
            <p>
              Hiện tại bộ đề chuẩn là 600 câu hỏi (áp dụng từ 01/6/2025). Mỗi đề sát hạch chọn ngẫu
              nhiên theo hạng: hạng B 30 câu, hạng C1 35 câu, hạng C 40 câu, nâng hạng 45 câu – luôn có
              1 câu điểm liệt.
            </p>
          </div>

          <div className="cn-q">
            <h3>Bộ đề 50 câu hỏi lý thuyết mới khi nào áp dụng?</h3>
            <p>
              Thông tin về việc rút gọn bộ đề lý thuyết xuống khoảng 50 câu (dự kiến năm 2027) hiện
              đang được tham khảo và chưa có quy định chính thức từ Bộ Công an. Trung tâm sẽ thông báo
              và cập nhật bộ đề ngay khi có văn bản chính thức.
            </p>
          </div>

          <div className="cn-q">
            <h3>Học ở Quyết Thắng có được cập nhật bộ đề mới không?</h3>
            <p>
              Có. Trung tâm Đào tạo Lái Xe Quyết Thắng (Bình Thuận) luôn cập nhật bộ đề lý thuyết theo
              quy định mới nhất của Bộ Công an để học viên ôn đúng, thi đậu cao. Liên hệ hotline{' '}
              <a href="tel:0848751111"><b>084 875 1111</b></a> để được tư vấn.
            </p>
          </div>
        </section>

        <div className="cn-foot">
          <p>
            Nguồn tham khảo quy định: Cục Cảnh sát giao thông – Bộ Công an (csgt.vn). Trung tâm Lái Xe
            Quyết Thắng tổng hợp và cập nhật.
          </p>
          <p className="cn-upd">Cập nhật năm {updated} · daylaixequyetthang.vn</p>
          <div className="cn-actions">
            <a href="/thi-thu" className="cn-btn">Thi thử lý thuyết</a>
            <a href="/dang-ky" className="cn-btn alt">Đăng ký khóa học</a>
          </div>
        </div>
      </article>
    </div>
  );
}
