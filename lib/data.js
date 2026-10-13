// Dữ liệu khóa học — đã cập nhật theo yêu cầu mới nhất.
// Thông tin hạng bằng phải được rà soát theo Luật Trật tự, an toàn giao thông đường bộ 2024.

export const PHONE = '0848751111';
export const PHONE_DISPLAY = '084 875 1111';
export const ZALO = 'https://zalo.me/0848751111';

export const COURSES = [
  {
    cls: 'Hạng B',
    name: 'Ô tô con dưới 9 chỗ',
    price: '15.500.000đ',
    unit: '/ trọn gói',
    popular: true,
    grad: 'var(--grad-hero)',
    points: [
      'Số tự động & số cơ khí (số sàn)',
      'Lộ trình học thường khoảng 3–4 tháng, theo kế hoạch khóa',
      'Gồm lý thuyết, sa hình, đường trường DAT',
      'Các khoản đào tạo ghi rõ trong hợp đồng',
    ],
  },
  {
    cls: 'Hạng C1',
    name: 'Xe tải trên 3,5 đến 7,5 tấn (khối lượng toàn bộ)',
    price: '19.000.000đ',
    unit: '/ trọn gói',
    grad: 'var(--grad-mint)',
    points: [
      'Lịch đào tạo thực tế xác nhận theo từng khóa',
      'Phù hợp lái xe dịch vụ, giao hàng',
      'Gồm lý thuyết, thực hành, DAT',
      'Các khoản đào tạo ghi rõ trong hợp đồng',
    ],
  },
  {
    cls: 'Nâng hạng C',
    name: 'Hạng C: xe tải trên 7,5 tấn (khối lượng toàn bộ)',
    price: 'Liên hệ',
    unit: '/ báo giá',
    grad: 'var(--grad-violet)',
    points: [
      'Nâng hạng phù hợp với điều kiện GPLX đang có',
      'Xe tập đời mới, sân tập rộng',
      'Học trọn gói theo khung GPLX mới',
      'Tư vấn lộ trình học phù hợp',
    ],
  },
  {
    cls: 'Hạng A1 / A',
    name: 'Mô tô – xe máy',
    price: 'A1: 250.000đ · A: Liên hệ',
    unit: '',
    grad: 'linear-gradient(135deg,#ff5d73,#ffb020)',
    points: [
      'A1 thi tại Phan Thiết',
      'A đào tạo trọn gói đến khi nhận GPLX',
      'Có bằng ô tô được miễn thi lý thuyết',
      'Hạng A có 2 kỳ thi mỗi tháng',
    ],
  },
];

export const UPGRADES = [
  { price: '10.500.000đ', desc: 'Nâng B / C1 → C · dưới 3 tháng · 57 giờ' },
  { price: '11.500.000đ', desc: 'Nâng B → D2 · dưới 3 tháng · 75 giờ' },
  { price: '10.500.000đ', desc: 'Nâng C1 / C → D2 · dưới 3 tháng' },
];

export const STEPS = [
  { t: 'Khởi động & đăng ký', d: 'Tư vấn lộ trình, chọn hạng, chuẩn bị hồ sơ & khám sức khỏe.' },
  { t: 'Lý thuyết online', d: 'Học luật, biển báo, 600 câu hỏi và 120 tình huống mô phỏng.' },
  { t: 'Cabin mô phỏng', d: 'Làm quen xe và rèn phản xạ xử lý tình huống trên cabin điện tử.' },
  { t: 'Kỹ thuật lái cơ bản', d: 'Làm quen vô lăng, chân ga – phanh – côn, cần số.' },
  { t: 'Thực hành sa hình', d: 'Luyện 11 bài thi sát hạch trong sân tập.' },
  { t: 'Đường trường – DAT', d: 'Lái thực tế trên đường và hoàn thành chỉ tiêu km DAT.' },
  { t: 'Thi & nhận bằng', d: 'Thi tốt nghiệp tại trường, thi sát hạch do Bộ Công an tổ chức.' },
];

export const FEATURES = [
  { t: 'Học phí trọn gói', d: 'Các khoản đào tạo và lệ phí được tư vấn, thể hiện rõ trong hợp đồng trước khi đăng ký.' },
  { t: 'Xe & cabin hiện đại', d: 'Cabin mô phỏng, xe tập đời mới, sân tập sát sân sát hạch giúp quen bài thi từ buổi đầu.' },
  { t: 'Luyện tập bài bản', d: 'Lý thuyết online linh hoạt, ôn 600 câu + 120 mô phỏng, luyện kỹ 11 bài sa hình.' },
  { t: 'Hỗ trợ tận tâm', d: 'Nhân viên theo dõi hồ sơ suốt khóa, hướng dẫn khám sức khỏe và hoàn thiện giấy tờ.' },
  { t: 'Lịch đào tạo theo khóa', d: 'Lịch học linh hoạt, học trước trả sau — chỉ cần 2.000.000đ ghi danh giữ chỗ.' },
  { t: 'Văn phòng và tư vấn online', d: 'Văn phòng tại Phan Thiết, La Gi, Bắc Bình; nhận tư vấn online từ Bình Thuận, Đồng Nai và TP.HCM.' },
];

export const FAQS = [
  { q: 'Học phí trọn gói gồm những gì?', a: 'Đã bao gồm toàn bộ chi phí đào tạo: xăng, xe, giáo viên, sân bãi, lý thuyết, sa hình, chạy đường trường DAT và lệ phí thi tốt nghiệp. Có hợp đồng đầy đủ, cam kết không phát sinh.' },
  { q: 'Học bằng B mất bao lâu?', a: 'Thời gian đào tạo thường khoảng 3–4 tháng tùy khóa và lịch học. Thời điểm sát hạch phụ thuộc thông báo của cơ quan có thẩm quyền.' },
  { q: 'Có học trước trả sau / trả góp không?', a: 'Nếu chưa đủ tài chính, đóng trước 2.000.000đ để ghi danh giữ chỗ; đóng đủ 50% là vào thẳng khóa học. Trung tâm hỗ trợ chia nhỏ học phí thành nhiều lần đóng.' },
  { q: 'Đăng ký ở đâu?', a: 'Bạn có thể đăng ký online (gọi/Zalo 084 875 1111, trung tâm tư vấn tận nơi) hoặc ghé văn phòng gần nhất. Một số văn phòng: 291 Trần Hưng Đạo (Phan Thiết); 280 Thống Nhất (La Gi); QL1A, Phan Hiệp (Bắc Bình).' },
  { q: 'Có được bảo lưu khóa học không?', a: 'Có. Nếu vì lý do cá nhân không thể tiếp tục, trung tâm xem xét bảo lưu và hỗ trợ học lại, tối đa 1 năm. Lưu ý: sau khi đã xếp khóa, theo hợp đồng học viên không rút hồ sơ và học phí.' },
  { q: 'Thi xong bao lâu có bằng?', a: 'Thời gian nhận kết quả và cấp GPLX phụ thuộc cơ quan có thẩm quyền. Trung tâm hỗ trợ hướng dẫn tra cứu khi có kết quả.' },
];

export const OFFICES = [
  {
    name: 'Văn phòng Phan Thiết',
    address: '291 Trần Hưng Đạo, Phan Thiết',
    maps: 'https://maps.app.goo.gl/8LEfReFyYD6CtuG36',
  },
  {
    name: 'Văn phòng La Gi',
    address: '280 Thống Nhất, P. La Gi',
    maps: 'https://maps.app.goo.gl/c9PymsTrhfRa2yP49',
  },
  {
    name: 'Văn phòng Bắc Bình',
    address: 'QL1A, Phan Hiệp, Bắc Bình',
    maps: 'https://maps.app.goo.gl/LNDdYkYsYoQUCGW67',
  },
];

// Link Google Maps chính để xem & viết đánh giá (dùng VP Phan Thiết làm điểm chính).
export const GOOGLE_MAPS_MAIN = 'https://maps.app.goo.gl/8LEfReFyYD6CtuG36';

// Banner chạy (marquee) — chỉnh được tại admin, đây là fallback.
export const BANNERS = [
  '🚗 Đăng ký tư vấn học lái xe B, C1, A1 online',
  '💳 Học trước trả sau — chỉ 2.000.000đ giữ chỗ',
  '📍 Văn phòng Phan Thiết, La Gi, Bắc Bình — hotline 084 875 1111',
  '🏝️ Tặng nghỉ dưỡng Mũi Né 2N1Đ + Đông Trùng Hạ Thảo khi đăng ký B/C1',
];

export const FB_PAGE = 'https://facebook.com/daylaixequyetthangbt';
export const MESSENGER = 'https://m.me/daylaixequyetthangbt';

export const SOCIAL = {
  facebook: FB_PAGE,
  messenger: MESSENGER,
  youtube: '',
  tiktok: '',
  zalo: ZALO,
};

// ============================================================
// ĐÁNH GIÁ / CẢM NHẬN HỌC VIÊN (REVIEW)
// ============================================================
// QUAN TRỌNG: Đây là review MẪU để hiển thị bố cục. Hãy THAY bằng review THẬT
// từ học viên (xin phép học viên, hoặc lấy từ bình luận Facebook/Google Maps thật).
// KHÔNG nên để review giả lâu dài: vi phạm quy định quảng cáo trung thực và mất uy tín.
// Cách thay: sửa nội dung bên dưới; hoặc để mảng rỗng [] thì mục "Học viên nói gì" tự ẩn.
export const REVIEWS = [];

// Link Google Maps review của trung tâm. Đã gắn link VP Phan Thiết để khách xem review thật.
export const GOOGLE_REVIEW_URL = 'https://maps.app.goo.gl/8LEfReFyYD6CtuG36';
