import './privacy.css';

export const metadata = {
  title: 'Chính sách quyền riêng tư',
  description:
    'Chính sách quyền riêng tư của Trung tâm Đào tạo Lái Xe Quyết Thắng: cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn, bao gồm cookie, Meta Pixel và Google Analytics.',
  alternates: { canonical: 'https://daylaixequyetthang.vn/chinh-sach-bao-mat' },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicy() {
  const updated = '06/2026';
  return (
    <div className="pv">
      <header className="pv-hdr">
        <a href="/" className="pv-back">← Trang chủ</a>
        <b>Chính sách quyền riêng tư</b>
        <span />
      </header>

      <article className="pv-wrap">
        <h1>Chính sách quyền riêng tư</h1>
        <p className="pv-upd">Cập nhật lần cuối: {updated}</p>

        <p className="pv-lead">
          Trung tâm Đào tạo Lái Xe Quyết Thắng ("chúng tôi") tôn trọng và cam kết bảo vệ thông tin cá
          nhân của bạn khi truy cập website daylaixequyetthang.vn. Chính sách này giải thích chúng tôi
          thu thập, sử dụng và bảo vệ thông tin của bạn như thế nào.
        </p>

        <h2>1. Thông tin chúng tôi thu thập</h2>
        <p>Khi bạn sử dụng website, chúng tôi có thể thu thập:</p>
        <ul>
          <li><b>Thông tin bạn cung cấp:</b> họ tên, số điện thoại, khóa học quan tâm khi bạn điền form tư vấn, đăng ký hoặc đặt cọc.</li>
          <li><b>Thông tin tra cứu:</b> số CCCD hoặc số điện thoại khi bạn tra cứu lịch học, tiến độ.</li>
          <li><b>Dữ liệu kỹ thuật tự động:</b> địa chỉ IP, loại thiết bị, trình duyệt, trang đã xem, qua cookie và công cụ phân tích.</li>
        </ul>

        <h2>2. Mục đích sử dụng thông tin</h2>
        <p>Chúng tôi sử dụng thông tin của bạn để:</p>
        <ul>
          <li>Liên hệ tư vấn khóa học, lịch khai giảng và học phí theo yêu cầu của bạn.</li>
          <li>Xử lý đăng ký, đặt cọc và hỗ trợ hồ sơ học lái xe.</li>
          <li>Cung cấp dịch vụ tra cứu lịch học, tiến độ học tập.</li>
          <li>Cải thiện chất lượng website và trải nghiệm người dùng.</li>
          <li>Đo lường hiệu quả quảng cáo và truyền thông.</li>
        </ul>

        <h2>3. Cookie và công cụ của bên thứ ba</h2>
        <p>
          Website sử dụng cookie và các công cụ đo lường của bên thứ ba để phân tích lưu lượng truy
          cập và tối ưu quảng cáo:
        </p>
        <ul>
          <li>
            <b>Google Analytics</b> (Google LLC): phân tích hành vi truy cập website một cách ẩn danh.
            Tham khảo chính sách của Google tại policies.google.com/privacy.
          </li>
          <li>
            <b>Meta Pixel</b> (Meta Platforms, Inc.): đo lường hiệu quả quảng cáo trên Facebook,
            Instagram. Tham khảo chính sách của Meta tại facebook.com/privacy/policy.
          </li>
        </ul>
        <p>
          Các công cụ này có thể đặt cookie trên trình duyệt của bạn. Bạn có thể quản lý hoặc xóa
          cookie trong phần cài đặt của trình duyệt. Việc tắt cookie có thể ảnh hưởng đến một số chức
          năng của website.
        </p>

        <h2>4. Chia sẻ thông tin</h2>
        <p>
          Chúng tôi <b>không bán</b> thông tin cá nhân của bạn cho bên thứ ba. Thông tin chỉ được sử
          dụng nội bộ để phục vụ bạn, hoặc chia sẻ với cơ quan chức năng khi pháp luật yêu cầu (ví dụ
          trong quá trình làm hồ sơ, sát hạch lái xe theo quy định).
        </p>

        <h2>5. Bảo mật thông tin</h2>
        <p>
          Chúng tôi áp dụng các biện pháp hợp lý để bảo vệ thông tin của bạn khỏi truy cập, sử dụng
          hoặc tiết lộ trái phép. Tuy nhiên, không có phương thức truyền tải qua Internet nào an toàn
          tuyệt đối.
        </p>

        <h2>6. Quyền của bạn</h2>
        <p>Bạn có quyền:</p>
        <ul>
          <li>Yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân mà chúng tôi lưu giữ.</li>
          <li>Rút lại sự đồng ý cho việc liên hệ tư vấn bất cứ lúc nào.</li>
          <li>Quản lý cookie qua cài đặt trình duyệt.</li>
        </ul>
        <p>Để thực hiện các quyền trên, vui lòng liên hệ hotline bên dưới.</p>

        <h2>7. Liên hệ</h2>
        <p>
          Mọi thắc mắc về chính sách quyền riêng tư, vui lòng liên hệ:
        </p>
        <ul>
          <li><b>Trung tâm Đào tạo Lái Xe Quyết Thắng</b></li>
          <li>Hotline / Zalo: <a href="tel:0848751111">084 875 1111</a></li>
          <li>Văn phòng: 291 Trần Hưng Đạo, Phan Thiết, Bình Thuận</li>
        </ul>

        <p className="pv-note">
          Chúng tôi có thể cập nhật chính sách này theo thời gian. Mọi thay đổi sẽ được đăng tải trên
          trang này.
        </p>

        <div className="pv-actions">
          <a href="/" className="pv-btn">Về trang chủ</a>
          <a href="/dang-ky" className="pv-btn alt">Đăng ký học</a>
        </div>
      </article>
    </div>
  );
}
